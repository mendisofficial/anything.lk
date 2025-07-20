package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "UpdatePassword", urlPatterns = {"/UpdatePassword"})
public class UpdatePassword extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);

        String currentPassword = userData.get("currentPassword").getAsString();
        String newPassword = userData.get("newPassword").getAsString();
        String confirmPassword = userData.get("confirmPassword").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (currentPassword.isEmpty()) {
            responseObject.addProperty("message", "Enter your current password");
        } else if (!Util.isPasswordValid(currentPassword)) {
            responseObject.addProperty("message", "The Password must contains at least one uppercase, one lowercase, one number, one special character and to be eight characters long!");
        } else if (newPassword.isEmpty()) {
            responseObject.addProperty("message", "Enter your new password");
        } else if (!Util.isPasswordValid(newPassword)) {
            responseObject.addProperty("message", "The Password must contains at least one uppercase, one lowercase, one number, one special character and to be eight characters long!");
        } else if (newPassword.equals(currentPassword)) {
            responseObject.addProperty("message", "The new password cannot be the same as the current password");
        } else if (confirmPassword.isEmpty()) {
            responseObject.addProperty("message", "Confirm your new password");
        } else if (!confirmPassword.equals(newPassword)) {
            responseObject.addProperty("message", "Passwords do not match!");
        } else {
            HttpSession ses = request.getSession(false);
            if (ses != null && ses.getAttribute("user") != null) {
                User sessionUser = (User) ses.getAttribute("user");

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                
                User dbUser = (User) s.get(User.class, sessionUser.getId());

                if (dbUser != null && dbUser.getPassword().equals(currentPassword)) {
                    dbUser.setPassword(newPassword);
                    s.update(dbUser);
                    s.beginTransaction().commit();

                    ses.setAttribute("user", dbUser);

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Password updated successfully!");
                } else {
                    responseObject.addProperty("message", "Invalid current password!");
                }
                s.close();
            } else {
                responseObject.addProperty("message", "Authentication failed. Please sign in again.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        }

        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
    }
}
