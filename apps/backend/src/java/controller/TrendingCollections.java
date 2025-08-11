package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.CollectionProduct;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.Product;
import hibernate.ProductCollection;
import hibernate.Status;
import java.io.File;
import java.io.FilenameFilter;
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

@WebServlet(name = "TrendingCollections", urlPatterns = {"/TrendingCollections"})
public class TrendingCollections extends HttpServlet {

    private static final int ACTIVE_STATUS_ID = 8; // same active status used for products
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

            // If no named image found, pick the first non-directory file
            String[] files = productFolder.list(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return !new File(dir, name).isDirectory();
                }
            });
            if (files != null && files.length > 0) {
                return "product-images/" + productId + "/" + files[0];
            }
        }
        return null;
    }

    // Pick a preview image from any product in the collection
    private String getCollectionPreviewImage(HttpServletRequest request, Session s, ProductCollection col) {
        Criteria cp = s.createCriteria(CollectionProduct.class);
        cp.add(Restrictions.eq("collection", col));
        cp.setMaxResults(1);
        @SuppressWarnings("unchecked")
        List<CollectionProduct> cps = (List<CollectionProduct>) cp.list();
        if (!cps.isEmpty()) {
            Product p = cps.get(0).getProduct();
            return getFirstProductImage(request, p.getId());
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

            Date fromDate = new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000); // last 30 days

            // Aggregate total sold qty per public collection in last 30 days
            String hql = "select cp.collection, sum(oi.qty) as totalQty "
                    + "from " + CollectionProduct.class.getSimpleName() + " cp, " + OrderItems.class.getSimpleName() + " oi "
                    + "join oi.orders o "
                    + "where oi.product = cp.product and cp.collection.isPublic = true and o.createdAt >= :fromDate and oi.product.status = :active "
                    + "group by cp.collection "
                    + "order by totalQty desc";

            Query q = s.createQuery(hql);
            q.setParameter("fromDate", fromDate);
            q.setParameter("active", active);
            q.setMaxResults(TREND_LIMIT);

            @SuppressWarnings("unchecked")
            List<Object[]> rows = q.list();

            List<ProductCollection> trending = new ArrayList<>();
            Set<Integer> seenIds = new HashSet<>();

            for (Object[] row : rows) {
                ProductCollection col = (ProductCollection) row[0];
                trending.add(col);
                seenIds.add(col.getId());
            }

            // Fallback with newest public collections if we have fewer than limit
            if (trending.size() < TREND_LIMIT) {
                Criteria c = s.createCriteria(ProductCollection.class);
                c.add(Restrictions.eq("isPublic", true));
                if (!seenIds.isEmpty()) {
                    c.add(Restrictions.not(Restrictions.in("id", seenIds)));
                }
                c.addOrder(Order.desc("created_at"));
                c.setMaxResults(TREND_LIMIT - trending.size());

                @SuppressWarnings("unchecked")
                List<ProductCollection> fallback = c.list();
                trending.addAll(fallback);
            }

            // Build response array
            JsonArray arr = new JsonArray();
            for (ProductCollection col : trending) {
                JsonObject item = new JsonObject();
                item.addProperty("id", col.getId());
                item.addProperty("name", col.getName());
                item.addProperty("slug", col.getSlug());
                item.addProperty("description", col.getDescription());

                // product count
                Criteria cpCount = s.createCriteria(CollectionProduct.class);
                cpCount.add(Restrictions.eq("collection", col));
                @SuppressWarnings("unchecked")
                List<CollectionProduct> cps = (List<CollectionProduct>) cpCount.list();
                item.addProperty("productCount", cps.size());

                // preview image
                String preview = getCollectionPreviewImage(request, s, col);
                if (preview != null) {
                    item.addProperty("previewImage", preview);
                }

                arr.add(item);
            }

            res.add("trendingCollections", arr);
            res.addProperty("status", true);
        } catch (Exception e) {
            res.addProperty("message", "Failed to load trending collections");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
