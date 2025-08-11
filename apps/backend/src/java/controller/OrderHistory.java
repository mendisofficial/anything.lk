package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.DeliveryTypes;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.Product;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "OrderHistory", urlPatterns = {"/OrderHistory"})
public class OrderHistory extends HttpServlet {

    // Resolve the first available image for a product and return its relative URL
    private String getFirstProductImage(int productId) {
        String appPath = getServletContext().getRealPath("");

        String productImagesPath;
        if (appPath.contains("build" + File.separator + "web")) {
            productImagesPath = appPath.replace("build" + File.separator + "web",
                    "web" + File.separator + "product-images");
        } else {
            productImagesPath = appPath + File.separator + "product-images";
        }

        File productFolder = new File(productImagesPath, String.valueOf(productId));
        if (productFolder.exists() && productFolder.isDirectory()) {
            String[] extensions = { ".png", ".jpg", ".jpeg", ".gif", ".webp" };
            for (int i = 1; i <= 3; i++) {
                for (String ext : extensions) {
                    File imageFile = new File(productFolder, "image" + i + ext);
                    if (imageFile.exists()) {
                        return "product-images/" + productId + "/image" + i + ext;
                    }
                }
            }
        }
        return null;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria cOrders = s.createCriteria(Orders.class);
            cOrders.add(Restrictions.eq("user", sessionUser));
            cOrders.addOrder(Order.desc("createdAt"));

            @SuppressWarnings("unchecked")
            List<Orders> ordersList = cOrders.list();

            JsonArray ordersArr = new JsonArray();

            for (Orders o : ordersList) {
                JsonObject orderJson = new JsonObject();
                orderJson.addProperty("id", o.getId());
                if (o.getCreatedAt() != null) {
                    orderJson.addProperty("createdAt", o.getCreatedAt().getTime()); // epoch millis for consistency
                }

                // Shipping summary
                Address addr = o.getAddress();
                if (addr != null) {
                    JsonObject ship = new JsonObject();
                    ship.addProperty("firstName", addr.getFirstName());
                    ship.addProperty("lastName", addr.getLastName());
                    ship.addProperty("lineOne", addr.getLineOne());
                    ship.addProperty("lineTwo", addr.getLineTwo());
                    ship.addProperty("postalCode", addr.getPostalCode());
                    ship.addProperty("mobile", addr.getMobile());
                    if (addr.getCity() != null) {
                        ship.addProperty("city", addr.getCity().getName());
                    }
                    orderJson.add("shipping", ship);
                }

                // Items in this order
                Criteria cItems = s.createCriteria(OrderItems.class);
                cItems.add(Restrictions.eq("orders", o));
                @SuppressWarnings("unchecked")
                List<OrderItems> items = cItems.list();

                JsonArray itemsArr = new JsonArray();
                double orderSubtotal = 0.0;
                double orderShipping = 0.0;

                for (OrderItems it : items) {
                    JsonObject itJson = new JsonObject();
                    itJson.addProperty("id", it.getId());
                    itJson.addProperty("qty", it.getQty());

                    OrderStatus st = it.getOrderStatus();
                    if (st != null) {
                        JsonObject stJson = new JsonObject();
                        stJson.addProperty("id", st.getId());
                        stJson.addProperty("value", st.getValue());
                        itJson.add("status", stJson);
                    }

                    DeliveryTypes dt = it.getDeliveryTypes();
                    if (dt != null) {
                        JsonObject dtJson = new JsonObject();
                        dtJson.addProperty("id", dt.getId());
                        dtJson.addProperty("name", dt.getName());
                        dtJson.addProperty("price", dt.getPrice());
                        itJson.add("deliveryType", dtJson);
                        orderShipping += dt.getPrice() * it.getQty();
                    }

                    Product p = it.getProduct();
                    if (p != null) {
                        JsonObject pJson = new JsonObject();
                        pJson.addProperty("id", p.getId());
                        pJson.addProperty("title", p.getTitle());
                        pJson.addProperty("price", p.getPrice());
                        String firstImg = getFirstProductImage(p.getId());
                        if (firstImg != null) {
                            pJson.addProperty("firstImage", firstImg);
                        }
                        itJson.add("product", pJson);

                        orderSubtotal += p.getPrice() * it.getQty();
                    }

                    itemsArr.add(itJson);
                }

                orderJson.add("items", itemsArr);
                orderJson.addProperty("subtotal", orderSubtotal);
                orderJson.addProperty("shipping", orderShipping);
                orderJson.addProperty("total", orderSubtotal + orderShipping);

                ordersArr.add(orderJson);
            }

            responseObject.add("orders", ordersArr);
            responseObject.addProperty("status", true);

            s.close();
        }

    response.setContentType("application/json");
    response.getWriter().write(gson.toJson(responseObject));
    }
}
