package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.Product;
import hibernate.Status;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "TrendingProducts", urlPatterns = {"/TrendingProducts"})
public class TrendingProducts extends HttpServlet {

    private static final int ACTIVE_STATUS_ID = 8; // matches existing usage
    private static final int TREND_LIMIT = 4;

    // Resolve the first available image for a product and return its relative URL
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
            // Prefer image1.*, fall back to image2/3 if image1 is missing
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

        Session s = HibernateUtil.getSessionFactory().openSession();

        try {
            Status active = (Status) s.get(Status.class, ACTIVE_STATUS_ID);

            // 30 days window for trending
            Date fromDate = new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000);

            // Get top-selling products in the last 30 days
            String hql = "select oi.product, sum(oi.qty) as totalQty "
                    + "from " + OrderItems.class.getSimpleName() + " oi "
                    + "join oi.orders o "
                    + "where o.createdAt >= :fromDate and oi.product.status = :active "
                    + "group by oi.product "
                    + "order by totalQty desc";

            Query q = s.createQuery(hql);
            q.setParameter("fromDate", fromDate);
            q.setParameter("active", active);
            q.setMaxResults(TREND_LIMIT);

            @SuppressWarnings("unchecked")
            List<Object[]> rows = q.list();

            List<Product> result = new ArrayList<>();
            Set<Integer> seenIds = new HashSet<>();

            for (Object[] row : rows) {
                Product p = (Product) row[0];
                p.setUser(null);
                p.setFirstImage(getFirstProductImage(request, p.getId()));
                result.add(p);
                seenIds.add(p.getId());
            }

            // If fewer than required, fill with most recent active products not already included
            if (result.size() < TREND_LIMIT) {
                Criteria c = s.createCriteria(Product.class);
                c.add(Restrictions.eq("status", active));
                if (!seenIds.isEmpty()) {
                    c.add(Restrictions.not(Restrictions.in("id", seenIds)));
                }
                // prefer newest-first
                c.addOrder(Order.desc("created_at"));
                c.setMaxResults(TREND_LIMIT - result.size());

                @SuppressWarnings("unchecked")
                List<Product> fallback = c.list();
                for (Product p : fallback) {
                    p.setUser(null);
                    p.setFirstImage(getFirstProductImage(request, p.getId()));
                    result.add(p);
                }
            }

            res.add("trendingProducts", gson.toJsonTree(result));
            res.addProperty("status", true);

        } catch (Exception e) {
            res.addProperty("message", "Failed to load trending products");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
