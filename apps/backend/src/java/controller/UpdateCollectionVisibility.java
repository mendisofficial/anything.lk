package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
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
import org.hibernate.Session;
import org.hibernate.Transaction;

@WebServlet(name = "UpdateCollectionVisibility", urlPatterns = {"/UpdateCollectionVisibility"})
public class UpdateCollectionVisibility extends HttpServlet {

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
        boolean isPublic = req.has("isPublic") && req.get("isPublic").getAsBoolean();

        if (!Util.isInteger(collectionIdStr)) {
            res.addProperty("message", "Invalid collection id");
        } else {
            int collectionId = Integer.parseInt(collectionIdStr);
            Session s = HibernateUtil.getSessionFactory().openSession();
            Transaction tx = s.beginTransaction();
            try {
                User u = (User) ses.getAttribute("user");
                ProductCollection col = (ProductCollection) s.get(ProductCollection.class, collectionId);
                if (col == null || col.getUser() == null || col.getUser().getId() != u.getId()) {
                    res.addProperty("message", "Collection not found");
                } else {
                    col.setIsPublic(isPublic);
                    s.update(col);
                    tx.commit();
                    res.addProperty("status", true);
                    res.addProperty("message", "Collection updated");
                }
            } catch (Exception e) {
                if (tx != null) tx.rollback();
                res.addProperty("message", "Failed to update collection");
            } finally {
                s.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
