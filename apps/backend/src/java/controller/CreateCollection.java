package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.ProductCollection;
import hibernate.User;
import java.io.IOException;
import java.text.Normalizer;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "CreateCollection", urlPatterns = {"/CreateCollection"})
public class CreateCollection extends HttpServlet {

    private static String toSlug(String input) {
        String now = String.valueOf(System.currentTimeMillis());
        String lower = input == null ? "" : input.toLowerCase(Locale.ENGLISH).trim();
        String nfdNormalizedString = Normalizer.normalize(lower, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String base = pattern.matcher(nfdNormalizedString).replaceAll("");
        base = base.replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (base.isEmpty()) base = "collection";
        return base + "-" + now.substring(now.length()-6);
    }

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

        String name = req.has("name") ? req.get("name").getAsString().trim() : "";
        String description = req.has("description") ? req.get("description").getAsString().trim() : null;
        boolean isPublic = req.has("isPublic") && req.get("isPublic").getAsBoolean();

        if (name.isEmpty()) {
            res.addProperty("message", "Collection name is required");
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();
            try {
                User u = (User) ses.getAttribute("user");

                // Optional: ensure unique per user by name
                Criteria c = s.createCriteria(ProductCollection.class);
                c.add(Restrictions.eq("user.id", u.getId()));
                c.add(Restrictions.eq("name", name));
                if (!c.list().isEmpty()) {
                    res.addProperty("message", "You already have a collection with this name");
                } else {
                    ProductCollection col = new ProductCollection();
                    col.setName(name);
                    col.setDescription(description);
                    col.setIsPublic(isPublic);
                    col.setUser(u);
                    col.setCreated_at(new Date());

                    // Generate unique slug
                    String slug = toSlug(name);
                    col.setSlug(slug);

                    int id = (int) s.save(col);
                    s.beginTransaction().commit();

                    res.addProperty("status", true);
                    JsonObject payload = new JsonObject();
                    payload.addProperty("id", id);
                    payload.addProperty("slug", slug);
                    res.add("collection", payload);
                }
            } catch (Exception e) {
                res.addProperty("message", "Failed to create collection");
            } finally {
                s.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
