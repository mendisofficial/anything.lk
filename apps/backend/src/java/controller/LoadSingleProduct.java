package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadSingleProduct", urlPatterns = { "/LoadSingleProduct" })
public class LoadSingleProduct extends HttpServlet {
    // Limit for similar products
    private static final int SIMILAR_PRODUCT_LIMIT = 4;

    // Helper method to get product images
    private List<String> getProductImages(int productId) {
        List<String> images = new ArrayList<>();
        
        // Get the application path
        String appPath = getServletContext().getRealPath("");
        
        // Construct the product images path
        String productImagesPath;
        if (appPath.contains("build" + File.separator + "web")) {
            productImagesPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "product-images");
        } else {
            productImagesPath = appPath + File.separator + "product-images";
        }
        
        File productFolder = new File(productImagesPath, String.valueOf(productId));
        
        if (productFolder.exists() && productFolder.isDirectory()) {
            // Common image extensions
            String[] extensions = {".png", ".jpg", ".jpeg", ".gif", ".webp"};
            
            for (int i = 1; i <= 3; i++) {
                for (String ext : extensions) {
                    File imageFile = new File(productFolder, "image" + i + ext);
                    if (imageFile.exists()) {
                        images.add("product-images/" + productId + "/image" + i + ext);
                        break; // Found the image with this number, move to next
                    }
                }
            }
        }
        
        return images;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        responseObject.addProperty("status", false);

        String productId = request.getParameter("id");

        if (Util.isInteger(productId)) {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            try {
                Product product = (Product) s.get(Product.class, Integer.valueOf(productId));

                if (product.getStatus().getValue().equals("Active")) {

                    product.getUser().setEmail(null);
                    product.getUser().setPassword(null);
                    product.getUser().setVerification(null);
                    product.getUser().setId(-1);
                    product.getUser().setCreated_at(null);

                    // Get product images
                    List<String> productImages = getProductImages(product.getId());

                    // Similar Products
                    Criteria c1 = s.createCriteria(Model.class);
                    c1.add(Restrictions.eq("brand", product.getModel().getBrand()));
                    List<Model> modelList = c1.list();

                    Criteria c2 = s.createCriteria(Product.class);
                    c2.add(Restrictions.in("model", modelList));
                    c2.add(Restrictions.ne("id", product.getId()));
                    c2.setMaxResults(SIMILAR_PRODUCT_LIMIT);
                    List<Product> productList = c2.list();

                    // Get images for similar products
                    List<List<String>> similarProductImages = new ArrayList<>();
                    
                    for (Product pr : productList) {

                        pr.getUser().setEmail(null);
                        pr.getUser().setPassword(null);
                        pr.getUser().setVerification(null);
                        pr.getUser().setId(-1);
                        pr.getUser().setCreated_at(null);
                        
                        // Get images for this similar product
                        List<String> images = getProductImages(pr.getId());
                        similarProductImages.add(images);

                    }

                    responseObject.add("product", gson.toJsonTree(product));
                    responseObject.add("productImages", gson.toJsonTree(productImages));
                    responseObject.add("productList", gson.toJsonTree(productList));
                    responseObject.add("similarProductImages", gson.toJsonTree(similarProductImages));

                    responseObject.addProperty("status", true);

                } else {

                    responseObject.addProperty("message", "Product Not Found!");

                }

            } catch (Exception e) {
                responseObject.addProperty("message", "Product Not Found!");
            }

        }

        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);

    }

}
