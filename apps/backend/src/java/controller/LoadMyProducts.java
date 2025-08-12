package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadMyProducts", urlPatterns = {"/LoadMyProducts"})
public class LoadMyProducts extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        HttpSession ses = request.getSession(false);
        if (ses == null || ses.getAttribute("user") == null) {
            res.addProperty("message", "Please sign in to continue");
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(res));
            return;
        }

        User u = (User) ses.getAttribute("user");

        Session s = HibernateUtil.getSessionFactory().openSession();
        try {
            Criteria c = s.createCriteria(Product.class);
            // Filter by current user (by id to avoid attaching detached entity)
            c.add(Restrictions.eq("user.id", u.getId()));
            // Newest first for settings page
            c.addOrder(Order.desc("created_at"));

            @SuppressWarnings("unchecked")
            List<Product> list = (List<Product>) c.list();

            // Sanitize and enrich response objects
            for (Product p : list) {
                // Do not leak user details back
                p.setUser(null);

                // Attach first image similar to SearchProducts
                try {
                    String imagesBasePath = request.getServletContext().getRealPath("/product-images/");
                    File productDir = new File(imagesBasePath, String.valueOf(p.getId()));
                    if (productDir.exists() && productDir.isDirectory()) {
                        String[] files = productDir.list((dir, name) -> !new File(dir, name).isDirectory());
                        if (files != null && files.length > 0) {
                            Arrays.sort(files);
                            String first = files[0];
                            String relative = "/product-images/" + p.getId() + "/" + first;
                            p.setFirstImage(relative);
                        }
                    }
                } catch (Exception ignored) {
                }
            }

            res.add("productList", gson.toJsonTree(list));
            res.addProperty("status", true);
        } catch (Exception e) {
            res.addProperty("message", "Failed to load your products");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
