package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Condition;
import hibernate.Status;
import hibernate.Storage;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SaveProduct", urlPatterns = {"/SaveProduct"})
public class SaveProduct extends HttpServlet {

    //pending product
    private static final int PENDING_STATUS_ID = 1;

    // Helper method to get file extension
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return ".png"; // default extension
        }
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return ".png"; // default if no extension found
        }
        String extension = fileName.substring(lastDotIndex);
        // Validate allowed image extensions
        if (extension.equalsIgnoreCase(".jpg") || extension.equalsIgnoreCase(".jpeg") || 
            extension.equalsIgnoreCase(".png") || extension.equalsIgnoreCase(".gif") || 
            extension.equalsIgnoreCase(".webp")) {
            return extension.toLowerCase();
        }
        return ".png"; // default for unsupported extensions
    }

    // Helper method to validate image file types
    private boolean isValidImageFile(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return false;
        }
        String extension = getFileExtension(fileName);
        return extension.equals(".jpg") || extension.equals(".jpeg") || 
               extension.equals(".png") || extension.equals(".gif") || 
               extension.equals(".webp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String branId = request.getParameter("brandId");
        String modelId = request.getParameter("modelId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String storageId = request.getParameter("storageId");
        String colorId = request.getParameter("colorId");
        String conditionId = request.getParameter("conditionId");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");
        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");

        Gson gson = new Gson();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session s = HibernateUtil.getSessionFactory().openSession();

        //start validation
        if (request.getSession().getAttribute("user") == null) {
            responseObject.addProperty("message", "You must login to add a product!");
        } else if (!Util.isInteger(branId)) {
            responseObject.addProperty("message", "Invalid brand!");
        } else if (Integer.parseInt(branId) == 0) {
            responseObject.addProperty("message", "Please select a brand!");
        } else if (!Util.isInteger(modelId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(modelId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "Product title cannot be empty!");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Product description cannot be empty!");
        } else if (!Util.isInteger(storageId)) {
            responseObject.addProperty("message", "Invalid storage!");
        } else if (Integer.parseInt(storageId) == 0) {
            responseObject.addProperty("message", "Please select a valid storage!");
        } else if (!Util.isInteger(colorId)) {
            responseObject.addProperty("message", "Invalid color!");
        } else if (Integer.parseInt(colorId) == 0) {
            responseObject.addProperty("message", "Please select a valid color!");
        } else if (!Util.isInteger(conditionId)) {
            responseObject.addProperty("message", "Invalid condition!");
        } else if (Integer.parseInt(conditionId) == 0) {
            responseObject.addProperty("message", "Please select a valid condition!");
        } else if (!Util.isDouble(price)) {
            responseObject.addProperty("message", "Invalid price!");
        } else if (Double.parseDouble(price) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0!");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid quantity!");
        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Quantity must be greater than 0!");
        } else if (part1.getSubmittedFileName() == null || part1.getSubmittedFileName().isEmpty()) {
            responseObject.addProperty("message", "Product image one is required!");
        } else if (part2.getSubmittedFileName() == null || part2.getSubmittedFileName().isEmpty()) {
            responseObject.addProperty("message", "Product image two is required!");
        } else if (part3.getSubmittedFileName() == null || part3.getSubmittedFileName().isEmpty()) {
            responseObject.addProperty("message", "Product image three is required!");
        } else if (!isValidImageFile(part1.getSubmittedFileName())) {
            responseObject.addProperty("message", "Image 1 must be a valid image file (jpg, jpeg, png, gif, webp)!");
        } else if (!isValidImageFile(part2.getSubmittedFileName())) {
            responseObject.addProperty("message", "Image 2 must be a valid image file (jpg, jpeg, png, gif, webp)!");
        } else if (!isValidImageFile(part3.getSubmittedFileName())) {
            responseObject.addProperty("message", "Image 3 must be a valid image file (jpg, jpeg, png, gif, webp)!");
        } else {
            Brand brand = (Brand) s.get(Brand.class, Integer.valueOf(branId));
            if (brand == null) {
                responseObject.addProperty("message", "Please select a valid brand name!");
            } else {
                Model model = (Model) s.get(Model.class, Integer.parseInt(modelId));
                if (model == null) {
                    responseObject.addProperty("message", "Please select a valid model!");
                } else {
                    if (model.getBrand().getId() != brand.getId()) {
                        responseObject.addProperty("message", "Please select a suitable model!");
                    } else {
                        Storage storage = (Storage) s.get(Storage.class, Integer.valueOf(storageId));
                        if (storage == null) {
                            responseObject.addProperty("message", "Please select a valid storage!");
                        } else {
                            Color color = (Color) s.get(Color.class, Integer.valueOf(colorId));
                            if (color == null) {
                                responseObject.addProperty("message", "Please select a valid color!");
                            } else {
                                Condition quality = (Condition) s.get(Condition.class, Integer.valueOf(conditionId));
                                if (quality == null) {
                                    responseObject.addProperty("message", "Please select a valid quality!");
                                } else {
                                    // call product entity for add the new product and set product details
                                    Product p = new Product();
                                    p.setTitle(title);
                                    p.setModel(model);
                                    p.setDescription(description);
                                    p.setPrice(Double.parseDouble(price));
                                    p.setQty(Integer.parseInt(qty));
                                    p.setColor(color);
                                    p.setStorage(storage);
                                    p.setCondition(quality);

                                    // get the status and set pending status
                                    Status status = (Status) s.get(Status.class, SaveProduct.PENDING_STATUS_ID);
                                    if (status == null) {
                                        responseObject.addProperty("message", "System error: Default status not found. Please contact administrator.");
                                    } else {
                                        p.setStatus(status);

                                        // get the user from session in the request
                                        User user = (User) request.getSession().getAttribute("user");

                                        // create criteria search for get user in user entity
                                        Criteria c1 = s.createCriteria(User.class);

                                        // check is the email is equal to the email in user table
                                        c1.add(Restrictions.eq("email", user.getEmail()));

                                        // get the unique data
                                        User u1 = (User) c1.uniqueResult();

                                        // set user to the product
                                        p.setUser(u1);

                                        // product adding data
                                        p.setCreated_at(new Date());

                                        // get the product id as int,save the data to the product table
                                        int id = (int) s.save(p);

                                        try {
                                            // start the saving
                                            s.beginTransaction().commit();

                                            // full path of the web pages folder
                                            String appPath = getServletContext().getRealPath("");
                                            
                                            // Improved path construction - handle both development and production paths
                                            String productImagesPath;
                                            if (appPath.contains("build" + File.separator + "web")) {
                                                productImagesPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "product-images");
                                            } else {
                                                productImagesPath = appPath + File.separator + "product-images";
                                            }

                                            File productImagesDir = new File(productImagesPath);
                                            if (!productImagesDir.exists()) {
                                                productImagesDir.mkdirs();
                                            }

                                            File productFolder = new File(productImagesDir, String.valueOf(id));
                                            if (!productFolder.exists()) {
                                                productFolder.mkdirs();
                                            }

                                            // Get file extensions from uploaded files
                                            String ext1 = getFileExtension(part1.getSubmittedFileName());
                                            String ext2 = getFileExtension(part2.getSubmittedFileName());
                                            String ext3 = getFileExtension(part3.getSubmittedFileName());

                                            //for part 1
                                            File file1 = new File(productFolder, "image1" + ext1);
                                            Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                            //for part 2
                                            File file2 = new File(productFolder, "image2" + ext2);
                                            Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                            //for part 3
                                            File file3 = new File(productFolder, "image3" + ext3);
                                            Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                            responseObject.addProperty("status", true);
                                            responseObject.addProperty("message", "Product saved successfully!");
                                        } catch (Exception e) {
                                            // Rollback transaction if file operations fail
                                            s.getTransaction().rollback();
                                            responseObject.addProperty("message", "Failed to save product images: " + e.getMessage());
                                            e.printStackTrace();
                                        } finally {
                                            s.close();
                                        }
                                    }
                                }
                            }
                        }

                    }

                }

            }

        }

        //send response to the user
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }

}
