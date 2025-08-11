package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.CollectionProduct;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.ProductCollection;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "RemoveProductFromCollection", urlPatterns = {"/RemoveProductFromCollection"})
public class RemoveProductFromCollection extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject req = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        HttpSession ses = request.getSession(false);
        if (ses == null || ses.getAttribute("user") == null) {
            res.addProperty("message", "Please sign in to continue");
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(res));
            return;
        }

        String collectionIdStr = req.has("collectionId") ? req.get("collectionId").getAsString() : null;
        String productIdStr = req.has("productId") ? req.get("productId").getAsString() : null;

        if (!Util.isInteger(collectionIdStr) || !Util.isInteger(productIdStr)) {
            res.addProperty("message", "Invalid IDs");
        } else {
            int collectionId = Integer.parseInt(collectionIdStr);
            int productId = Integer.parseInt(productIdStr);

            Session s = HibernateUtil.getSessionFactory().openSession();
            Transaction tx = s.beginTransaction();
            try {
                User u = (User) ses.getAttribute("user");
                ProductCollection col = (ProductCollection) s.get(ProductCollection.class, collectionId);
                if (col == null || col.getUser() == null || col.getUser().getId() != u.getId()) {
                    res.addProperty("message", "Collection not found");
                } else {
                    Product p = (Product) s.get(Product.class, productId);
                    if (p == null || p.getUser() == null || p.getUser().getId() != u.getId()) {
                        res.addProperty("message", "Product not found");
                    } else {
                        Criteria c = s.createCriteria(CollectionProduct.class);
                        c.add(Restrictions.eq("collection", col));
                        c.add(Restrictions.eq("product", p));
                        CollectionProduct cp = (CollectionProduct) c.uniqueResult();
                        if (cp == null) {
                            res.addProperty("message", "Not in collection");
                        } else {
                            s.delete(cp);
                            tx.commit();
                            res.addProperty("status", true);
                            res.addProperty("message", "Removed from collection");
                        }
                    }
                }
            } catch (Exception e) {
                if (tx != null) tx.rollback();
                res.addProperty("message", "Failed to remove from collection");
            } finally {
                s.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
