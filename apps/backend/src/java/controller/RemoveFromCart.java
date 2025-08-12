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

@WebServlet(name = "RemoveFromCart", urlPatterns = {"/RemoveFromCart"})
public class RemoveFromCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String prId = request.getParameter("prId");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (!Util.isInteger(prId)) {
            responseObject.addProperty("message", "Invalid product Id");
        } else {
            // remove-from-cart process
            User user = (User) request.getSession().getAttribute("user");

            if (user != null) { // DB-backed cart
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Transaction tr = s.beginTransaction();

                Product product = (Product) s.get(Product.class, Integer.valueOf(prId));

                if (product == null) {
                    responseObject.addProperty("message", "Product not found!");
                } else {
                    Criteria c1 = s.createCriteria(Cart.class);
                    c1.add(Restrictions.eq("user", user));
                    c1.add(Restrictions.eq("product", product));

                    if (c1.list().isEmpty()) {
                        responseObject.addProperty("message", "Cart item not found");
                    } else {
                        Cart cart = (Cart) c1.uniqueResult();
                        s.delete(cart);
                        tr.commit();
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Item removed from cart");
                    }
                }

                s.close();

            } else { // Session cart
                @SuppressWarnings("unchecked")
                ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");

                if (sessionCarts == null || sessionCarts.isEmpty()) {
                    responseObject.addProperty("message", "Cart item not found");
                } else {
                    Cart toRemove = null;
                    int pid = Integer.parseInt(prId);
                    for (Cart c : sessionCarts) {
                        if (c.getProduct() != null && c.getProduct().getId() == pid) {
                            toRemove = c;
                            break;
                        }
                    }

                    if (toRemove != null) {
                        sessionCarts.remove(toRemove);
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Item removed from cart");
                    } else {
                        responseObject.addProperty("message", "Cart item not found");
                    }
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
