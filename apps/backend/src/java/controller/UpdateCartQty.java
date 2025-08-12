package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UpdateCartQty", urlPatterns = {"/UpdateCartQty"})
public class UpdateCartQty extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String prId = request.getParameter("prId");
        String qty = request.getParameter("qty");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (!Util.isInteger(prId)) {
            responseObject.addProperty("message", "Invalid product Id");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid product Quantity!");
        } else {
            int pid = Integer.parseInt(prId);
            int newQty = Integer.parseInt(qty);

            if (newQty <= 0) {
                responseObject.addProperty("message", "Quantity must be at least 1");
            } else {
                User user = (User) request.getSession().getAttribute("user");

                if (user != null) { // DB-backed cart
                    SessionFactory sf = HibernateUtil.getSessionFactory();
                    Session s = sf.openSession();
                    Transaction tr = s.beginTransaction();

                    Product product = (Product) s.get(Product.class, pid);

                    if (product == null) {
                        responseObject.addProperty("message", "Product not found!");
                    } else if (newQty > product.getQty()) {
                        responseObject.addProperty("message", "OOPS....Insufficient Product quantity!!");
                    } else {
                        Criteria c1 = s.createCriteria(Cart.class);
                        c1.add(Restrictions.eq("user", user));
                        c1.add(Restrictions.eq("product", product));

                        if (c1.list().isEmpty()) {
                            responseObject.addProperty("message", "Cart item not found");
                        } else {
                            Cart cart = (Cart) c1.uniqueResult();
                            cart.setQty(newQty);
                            s.update(cart);
                            tr.commit();
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Cart quantity updated");
                        }
                    }

                    s.close();

                } else { // Session cart
                    @SuppressWarnings("unchecked")
                    ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");

                    if (sessionCarts == null || sessionCarts.isEmpty()) {
                        responseObject.addProperty("message", "Cart item not found");
                    } else {
                        Cart target = null;
                        for (Cart c : sessionCarts) {
                            if (c.getProduct() != null && c.getProduct().getId() == pid) {
                                target = c;
                                break;
                            }
                        }

                        if (target == null) {
                            responseObject.addProperty("message", "Cart item not found");
                        } else {
                            // Check stock against product qty
                            Product productRef = target.getProduct();
                            if (productRef != null && newQty <= productRef.getQty()) {
                                target.setQty(newQty);
                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Cart quantity updated");
                            } else {
                                responseObject.addProperty("message", "OOPS....Insufficient Product quantity!!");
                            }
                        }
                    }
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
