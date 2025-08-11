package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.CollectionProduct;
import hibernate.HibernateUtil;
import hibernate.ProductCollection;
import hibernate.User;
import java.io.IOException;
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

@WebServlet(name = "LoadMyCollections", urlPatterns = {"/LoadMyCollections"})
public class LoadMyCollections extends HttpServlet {

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
            Criteria c = s.createCriteria(ProductCollection.class);
            c.add(Restrictions.eq("user.id", u.getId()));
            c.addOrder(Order.desc("created_at"));
            @SuppressWarnings("unchecked")
            List<ProductCollection> cols = (List<ProductCollection>) c.list();

            JsonArray arr = new JsonArray();
            for (ProductCollection col : cols) {
                JsonObject cj = new JsonObject();
                cj.addProperty("id", col.getId());
                cj.addProperty("name", col.getName());
                cj.addProperty("slug", col.getSlug());
                cj.addProperty("isPublic", col.isIsPublic());

                Criteria cp = s.createCriteria(CollectionProduct.class);
                cp.add(Restrictions.eq("collection", col));
                @SuppressWarnings("unchecked")
                List<CollectionProduct> cps = (List<CollectionProduct>) cp.list();
                cj.addProperty("productCount", cps.size());

                arr.add(cj);
            }

            res.add("collections", arr);
            res.addProperty("status", true);
        } catch (Exception e) {
            res.addProperty("message", "Failed to load collections");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
