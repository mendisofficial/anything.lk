package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadCartItems", urlPatterns = {"/LoadCartItems"})
public class LoadCartItems extends HttpServlet {

    // Resolve the first available image for a product and return its relative URL
    private String getFirstProductImage(int productId) {
        // App absolute path
        String appPath = getServletContext().getRealPath("");

        // Figure out the product-images directory depending on build/runtime path
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

        return null; // No image found
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseObject = new JsonObject();

        responseObject.addProperty("status", false);

        User user = (User) request.getSession().getAttribute("user");

        if (user != null) {

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

            Criteria c1 = s.createCriteria(Cart.class);

            c1.add(Restrictions.eq("user", user));

            @SuppressWarnings("unchecked")
            List<Cart> cartList = c1.list();

            if (cartList.isEmpty()) {

                responseObject.addProperty("message", "Your cart is empty");

            } else {

                for (Cart cart : cartList) {

                    cart.getProduct().setUser(user);
                    cart.setUser(null);

            // Attach first product image URL
            String firstImage = getFirstProductImage(cart.getProduct().getId());
            cart.getProduct().setFirstImage(firstImage);

                }

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Cart item successfully loaded");
                responseObject.add("cartItems", gson.toJsonTree(cartList));

            }

        s.close();

        } else { // session cart

            @SuppressWarnings("unchecked")
            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");

            if (sessionCarts != null) {

                if (sessionCarts.isEmpty()) {

                    responseObject.addProperty("message", "Your cart is empty");

                } else {

                    for (Cart sessionCart : sessionCarts) {

                        sessionCart.getProduct().setUser(null);
                        sessionCart.setUser(null);

                        // Attach first product image URL
                        String firstImage = getFirstProductImage(sessionCart.getProduct().getId());
                        sessionCart.getProduct().setFirstImage(firstImage);

                    }

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Cart items successfully loaded");
                    responseObject.add("cartItems", gson.toJsonTree(sessionCarts));

                }

            } else {

                responseObject.addProperty("message", "Your cart is empty");

            }

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));

    }

}
