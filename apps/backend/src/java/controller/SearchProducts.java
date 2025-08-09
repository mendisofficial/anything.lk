package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.Condition;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Status;
import hibernate.Storage;
import java.io.IOException;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SearchProducts", urlPatterns = {"/SearchProducts"})
public class SearchProducts extends HttpServlet {

    private static final int MAX_RESULT = 6;

    private static final int ACTIVE_ID = 8;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        JsonObject requestObject = gson.fromJson(request.getReader(), JsonObject.class);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Product.class); // get all products form the filter

        if (requestObject.has("brandName")) {
            String brandName = requestObject.get("brandName").getAsString();

            //get brand details
            Criteria c2 = s.createCriteria(Brand.class);
            c2.add(Restrictions.eq("name", brandName));
            Brand brand = (Brand) c2.uniqueResult();

            //filter by model using brand for get brand details        
            Criteria c3 = s.createCriteria(Model.class);
            c3.add(Restrictions.eq("brand", brand));
            @SuppressWarnings("unchecked")
            List<Model> modelList = (List<Model>) c3.list();

            //filter product by using model list
            c1.add(Restrictions.in("model", modelList));
        }
        if (requestObject.has("conditionName")) {
            String qualityVale = requestObject.get("conditionName").getAsString();

            //get quality details
            Criteria c4 = s.createCriteria(Condition.class);
            c4.add(Restrictions.eq("value", qualityVale));
            Condition quality = (Condition) c4.uniqueResult();

            //filter product by quality
            c1.add(Restrictions.eq("condition", quality));
        }
        if (requestObject.has("colorName")) {
            String colorValue = requestObject.get("colorName").getAsString();

            //get color details
            Criteria c5 = s.createCriteria(Color.class);
            c5.add(Restrictions.eq("value", colorValue));
            Color color = (Color) c5.uniqueResult();

            //filter product from color
            c1.add(Restrictions.eq("color", color));        
        }
        if (requestObject.has("storageValue")) {
            String storageValue = requestObject.get("storageValue").getAsString();

            Criteria c6 = s.createCriteria(Storage.class);
            c6.add(Restrictions.eq("value", storageValue));
            Storage storage = (Storage) c6.uniqueResult();

            //filter product from storage
            c1.add(Restrictions.eq("storage", storage));           
        }

        if (requestObject.has("priceStart") && requestObject.has("priceEnd")) {
            double priceStart = requestObject.get("priceStart").getAsDouble();
            double priceEnd = requestObject.get("priceEnd").getAsDouble();

            c1.add(Restrictions.ge("price", priceStart));
            c1.add(Restrictions.le("price", priceEnd));
        }

        // product sorting
        if (requestObject.has("sortValue")) {

            String sortValue = requestObject.get("sortValue").getAsString();

            if (sortValue.equals("Sort by Latest")) {

                c1.addOrder(Order.desc("id"));

            } else if (sortValue.equals("Sort by Oldest")) {

                c1.addOrder(Order.asc("id"));

            } else if (sortValue.endsWith("Sort by Name")) {

                c1.addOrder(Order.asc("title"));

            } else if (sortValue.equals("Sort by Price")) {

                c1.addOrder(Order.asc("price"));

            }

        }

        // product sorting
        if (requestObject.has("firstResult")) {

            int firstResult = requestObject.get("firstResult").getAsInt();
            c1.setFirstResult(firstResult);
            // get the max value from search products in criteria search
            c1.setMaxResults(SearchProducts.MAX_RESULT);

        }

        // get filtered product list from all above filters
        Status status = (Status) s.get(Status.class, ACTIVE_ID);
        c1.add(Restrictions.eq("status", status));
    @SuppressWarnings("unchecked")
    List<Product> productList = (List<Product>) c1.list();

        // set user details null
        for (Product product : productList) {
            product.setUser(null);

            // derive first image path from product-images/<id>/ directory
            try {
                String imagesBasePath = request.getServletContext().getRealPath("/product-images/");
                File productDir = new File(imagesBasePath, String.valueOf(product.getId()));
                if (productDir.exists() && productDir.isDirectory()) {
                    String[] files = productDir.list((dir, name) -> !new File(dir, name).isDirectory());
                    if (files != null && files.length > 0) {
                        Arrays.sort(files); // ensure deterministic first image
                        String first = files[0];
                        String relative = "/product-images/" + product.getId() + "/" + first;
                        product.setFirstImage(relative);
                    }
                }
            } catch (Exception e) {
                // ignore image resolution errors; keep response robust
            }
        }

        // hibernate session close
        s.close();

        // send data as response to frontend
        responseObject.add("productList", gson.toJsonTree(productList));
        responseObject.addProperty("status", true);
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));

    }
    
}
