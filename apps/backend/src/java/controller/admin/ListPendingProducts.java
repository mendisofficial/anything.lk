package controller.admin;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Status;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
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

@WebServlet(name = "ListPendingProducts", urlPatterns = {"/admin/ListPendingProducts"})
public class ListPendingProducts extends HttpServlet {

    private static final int PENDING_STATUS_ID = 1; // matches SaveProduct

    private String getFirstProductImage(HttpServletRequest request, int productId) {
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
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        // AuthZ: only Admin can access
        HttpSession httpSession = request.getSession(false);
        if (httpSession == null || httpSession.getAttribute("user") == null ||
                !"Admin".equals(((User) httpSession.getAttribute("user")).getVerification())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            res.addProperty("message", "Forbidden: Admins only");
            writeJson(response, gson, res);
            return;
        }

        Session s = HibernateUtil.getSessionFactory().openSession();
        try {
            Status pending = (Status) s.get(Status.class, PENDING_STATUS_ID);

            Criteria c = s.createCriteria(Product.class);
            c.add(Restrictions.eq("status", pending));
            c.addOrder(Order.desc("created_at"));

            @SuppressWarnings("unchecked")
            List<Product> products = c.list();

            List<Product> sanitized = new ArrayList<>();
            for (Product p : products) {
                p.setUser(null); // hide user details here; fetch separately if needed
                p.setFirstImage(getFirstProductImage(request, p.getId()));
                sanitized.add(p);
            }

            res.add("pendingProducts", gson.toJsonTree(sanitized));
            res.addProperty("status", true);
        } catch (Exception e) {
            res.addProperty("message", "Failed to load pending products");
        } finally {
            s.close();
        }

        writeJson(response, gson, res);
    }

    private void writeJson(HttpServletResponse response, Gson gson, JsonObject obj) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(obj));
    }
}
