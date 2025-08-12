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
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "GetCollection", urlPatterns = {"/GetCollection"})
public class GetCollection extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        String idStr = request.getParameter("id");
        String slug = request.getParameter("slug");

        Session s = HibernateUtil.getSessionFactory().openSession();
        try {
            ProductCollection col = null;
            if (idStr != null && Util.isInteger(idStr)) {
                col = (ProductCollection) s.get(ProductCollection.class, Integer.parseInt(idStr));
            } else if (slug != null && !slug.isEmpty()) {
                Criteria c = s.createCriteria(ProductCollection.class);
                c.add(Restrictions.eq("slug", slug));
                col = (ProductCollection) c.uniqueResult();
            }

            if (col == null || !col.isIsPublic()) {
                res.addProperty("message", "Collection not found");
            } else {
                JsonObject meta = new JsonObject();
                meta.addProperty("id", col.getId());
                meta.addProperty("name", col.getName());
                meta.addProperty("slug", col.getSlug());
                meta.addProperty("description", col.getDescription());
                res.add("collection", meta);

                Criteria cp = s.createCriteria(CollectionProduct.class);
                cp.add(Restrictions.eq("collection", col));
                @SuppressWarnings("unchecked")
                List<CollectionProduct> cps = (List<CollectionProduct>) cp.list();

                JsonArray products = new JsonArray();
                for (CollectionProduct link : cps) {
                    Product p = link.getProduct();
                    if (p == null) continue;
                    JsonObject pj = new JsonObject();
                    pj.addProperty("id", p.getId());
                    pj.addProperty("title", p.getTitle());
                    pj.addProperty("price", p.getPrice());

                    try {
                        String imagesBasePath = request.getServletContext().getRealPath("/product-images/");
                        File productDir = new File(imagesBasePath, String.valueOf(p.getId()));
                        if (productDir.exists() && productDir.isDirectory()) {
                            String[] files = productDir.list((dir, name) -> !new File(dir, name).isDirectory());
                            if (files != null && files.length > 0) {
                                Arrays.sort(files);
                                String first = files[0];
                                String relative = "/product-images/" + p.getId() + "/" + first;
                                pj.addProperty("firstImage", relative);
                            }
                        }
                    } catch (Exception ignored) {}

                    products.add(pj);
                }
                res.add("products", products);
                res.addProperty("status", true);
            }
        } catch (Exception e) {
            res.addProperty("message", "Failed to load collection");
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(res));
    }
}
