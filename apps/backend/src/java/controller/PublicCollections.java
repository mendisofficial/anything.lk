package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.CollectionProduct;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.ProductCollection;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "PublicCollections", urlPatterns = {"/PublicCollections"})
public class PublicCollections extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        Session s = HibernateUtil.getSessionFactory().openSession();
        try {
            Criteria c = s.createCriteria(ProductCollection.class);
            c.add(Restrictions.eq("isPublic", true));
            c.addOrder(Order.desc("created_at"));
            @SuppressWarnings("unchecked")
            List<ProductCollection> cols = (List<ProductCollection>) c.list();

            JsonArray arr = new JsonArray();
            for (ProductCollection col : cols) {
                JsonObject item = new JsonObject();
                item.addProperty("id", col.getId());
                item.addProperty("name", col.getName());
                item.addProperty("slug", col.getSlug());
                item.addProperty("description", col.getDescription());

                // Count products
                Criteria cp = s.createCriteria(CollectionProduct.class);
                cp.add(Restrictions.eq("collection", col));
                @SuppressWarnings("unchecked")
                List<CollectionProduct> cps = (List<CollectionProduct>) cp.list();
                item.addProperty("productCount", cps.size());

                // Try to attach a preview image from the first product, if any
                if (!cps.isEmpty()) {
                    Product p = cps.get(0).getProduct();
                    try {
                        String imagesBasePath = request.getServletContext().getRealPath("/product-images/");
                        File productDir = new File(imagesBasePath, String.valueOf(p.getId()));
                        if (productDir.exists() && productDir.isDirectory()) {
                            String[] files = productDir.list((dir, name) -> !new File(dir, name).isDirectory());
                            if (files != null && files.length > 0) {
                                Arrays.sort(files);
                                String first = files[0];
                                String relative = "/product-images/" + p.getId() + "/" + first;
                                item.addProperty("previewImage", relative);
                            }
                        }
                    } catch (Exception ignored) {}
                }

                arr.add(item);
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
