package controller;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import model.Mail;
import hibernate.HibernateUtil;
import hibernate.Orders;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Product;
import hibernate.Address;
import hibernate.DeliveryTypes;
import hibernate.User;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "VerifyPayments", urlPatterns = {"/VerifyPayments"})
public class VerifyPayments extends HttpServlet {

   private static final int PAYHERE_SUCCESS = 2;
   private static final int ORDER_STATUS_PROCESSING = 2; // matches seed data ("Processing")
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String merchant_id = request.getParameter("merchant_id");
        String order_id = request.getParameter("order_id");
        String payhere_amount = request.getParameter("payhere_amount");
        String payhere_currency = request.getParameter("payhere_currency");
        String status_code = request.getParameter("status_code");
        String md5sig = request.getParameter("md5sig");

        if (merchant_id == null || order_id == null || payhere_amount == null || payhere_currency == null || status_code == null || md5sig == null) {
            System.err.println("VerifyPayments: Missing required parameters");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String merchantSecret = "your_merchant_secret";
        String merchantSecretMD5 = PayHere.generateMD5(merchantSecret);
        // md5sig formula for server-to-server notify: md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(secret))
        String hash = PayHere.generateMD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchantSecretMD5);

        boolean verified = md5sig.equalsIgnoreCase(hash);
        int status;
        try {
            status = Integer.parseInt(status_code);
        } catch (NumberFormatException nfe) {
            status = -1;
        }

    if (verified && status == VerifyPayments.PAYHERE_SUCCESS) {
            System.out.println("Payment Completed. Order Id:" + order_id);
            // Extract numeric order ID from formatted "#000123" etc.
            String digitsOnly = order_id.replaceAll("\\D+", "");
            int orderPk;
            try {
                orderPk = Integer.parseInt(digitsOnly.replaceFirst("^0+", ""));
            } catch (Exception ex) {
                System.err.println("Unable to parse order id from: " + order_id);
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            // Load order + items, update statuses, and email receipt
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tx = s.beginTransaction();
            try {
                Orders o = (Orders) s.get(Orders.class, orderPk);
                if (o == null) {
                    System.err.println("Order not found for id: " + orderPk);
                    tx.commit();
                    s.close();
                    response.setStatus(HttpServletResponse.SC_OK);
                    return;
                }

                // Fetch items for this order
                Criteria cItems = s.createCriteria(OrderItems.class);
                cItems.add(Restrictions.eq("orders", o));
                @SuppressWarnings("unchecked")
                List<OrderItems> items = cItems.list();

                // Update status to Processing
                OrderStatus processing = (OrderStatus) s.get(OrderStatus.class, ORDER_STATUS_PROCESSING);

                double subtotal = 0.0;
                double shipping = 0.0;
                StringBuilder itemsHtml = new StringBuilder();
                itemsHtml.append("<table border='0' cellspacing='0' cellpadding='6' style='width:100%;font-family:Arial,sans-serif;'>")
                        .append("<thead><tr><th align='left'>Item</th><th align='right'>Qty</th><th align='right'>Price</th></tr></thead><tbody>");

                for (OrderItems it : items) {
                    if (processing != null) {
                        it.setOrderStatus(processing);
                        s.update(it);
                    }
                    Product p = it.getProduct();
                    DeliveryTypes dt = it.getDeliveryTypes();
                    int qty = it.getQty();
                    if (p != null) {
                        subtotal += p.getPrice() * qty;
                        itemsHtml.append("<tr>")
                                .append("<td>").append(escapeHtml(p.getTitle())).append("</td>")
                                .append("<td align='right'>").append(qty).append("</td>")
                                .append("<td align='right'>LKR ").append(fmt(p.getPrice())).append("</td>")
                                .append("</tr>");
                    }
                    if (dt != null) {
                        shipping += dt.getPrice() * qty;
                    }
                }
                itemsHtml.append("</tbody></table>");

                double total = subtotal + shipping;

                // Build shipping address
                Address addr = o.getAddress();
                StringBuilder shipHtml = new StringBuilder();
                if (addr != null) {
                    shipHtml.append(escapeHtml(nullToEmpty(addr.getFirstName()))).append(" ")
                            .append(escapeHtml(nullToEmpty(addr.getLastName()))).append("<br>")
                            .append(escapeHtml(nullToEmpty(addr.getLineOne()))).append(", ")
                            .append(escapeHtml(nullToEmpty(addr.getLineTwo()))).append("<br>")
                            .append(addr.getCity() != null ? escapeHtml(addr.getCity().getName()) : "").append(" ")
                            .append(escapeHtml(nullToEmpty(addr.getPostalCode()))).append("<br>")
                            .append("Phone: ").append(escapeHtml(nullToEmpty(addr.getMobile())));
                }

                // Email content
                String orderCode = "#000" + o.getId();
                String subject = "Your order " + orderCode + " is confirmed";
                StringBuilder html = new StringBuilder();
                User u = o.getUser();
                html.append("<div style='font-family:Arial,sans-serif;max-width:640px;margin:0 auto;'>")
                    .append("<h2>Thanks for your purchase</h2>")
                    .append("<p>")
                    .append("Hi ").append(escapeHtml(u != null ? nullToEmpty(u.getFirst_name()) : "Customer"))
                    .append(", your payment was successful. Here is your receipt.")
                    .append("</p>")
                    .append("<p><strong>Order:</strong> ").append(orderCode)
                    .append("<br><strong>Date:</strong> ").append(o.getCreatedAt() != null ? o.getCreatedAt() : "").append("</p>")
                    .append(itemsHtml)
                    .append("<hr>")
                    .append("<p><strong>Subtotal:</strong> LKR ").append(fmt(subtotal)).append("<br>")
                    .append("<strong>Shipping:</strong> LKR ").append(fmt(shipping)).append("<br>")
                    .append("<strong>Total:</strong> LKR ").append(fmt(total)).append("</p>")
                    .append("<h3>Shipping to</h3>")
                    .append("<p>").append(shipHtml).append("</p>")
                    .append("<p style='color:#777;'>If you have questions, reply to this email.</p>")
                    .append("</div>");

                // Send email
                if (u != null && u.getEmail() != null && !u.getEmail().isEmpty()) {
                    try {
                        Mail.sendMail(u.getEmail(), subject, html.toString());
                    } catch (Exception ex) {
                        System.err.println("Failed to send receipt email: " + ex.getMessage());
                    }
                }

                tx.commit();
            } catch (Exception e) {
                tx.rollback();
                System.err.println("VerifyPayments error: " + e.getMessage());
            } finally {
                s.close();
            }
        } else {
            System.err.println("VerifyPayments: Signature/status mismatch. md5sig=" + md5sig + ", expected=" + hash + ", status_code=" + status_code);
        }
    }

    // Helpers
    private static String fmt(double v) {
        return new DecimalFormat("0.00").format(v);
    }

    private static String nullToEmpty(String s) { return s == null ? "" : s; }

    private static String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }

}
