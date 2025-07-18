package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "ValidateSession", urlPatterns = {"/ValidateSession"})
public class ValidateSession extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        responseObject.addProperty("isValid", false);
        responseObject.addProperty("isAuthenticated", false);
        
        try {
            // Get the current session (don't create a new one if it doesn't exist)
            HttpSession session = request.getSession(false);
            
            if (session == null) {
                // No session exists
                responseObject.addProperty("message", "No active session found");
            } else {
                // Session exists, check if it's valid and has a user
                Object userObj = session.getAttribute("user");
                Object emailObj = session.getAttribute("email");
                
                if (userObj != null && userObj instanceof User) {
                    // User is fully authenticated and verified
                    User user = (User) userObj;
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("isValid", true);
                    responseObject.addProperty("isAuthenticated", true);
                    responseObject.addProperty("message", "Session is valid and user is authenticated");
                    
                    // Add user information to response
                    JsonObject userInfo = new JsonObject();
                    userInfo.addProperty("id", user.getId());
                    userInfo.addProperty("firstName", user.getFirst_name());
                    userInfo.addProperty("lastName", user.getLast_name());
                    userInfo.addProperty("email", user.getEmail());
                    userInfo.addProperty("verified", "Verified".equals(user.getVerification()));
                    responseObject.add("user", userInfo);
                    
                } else if (emailObj != null) {
                    // User has registered but not verified yet
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("isValid", true);
                    responseObject.addProperty("isAuthenticated", false);
                    responseObject.addProperty("message", "Session is valid but user is not verified");
                    responseObject.addProperty("email", emailObj.toString());
                    responseObject.addProperty("requiresVerification", true);
                    
                } else {
                    // Session exists but no user data
                    responseObject.addProperty("message", "Session exists but no user data found");
                }
            }
            
        } catch (Exception e) {
            responseObject.addProperty("message", "Error validating session: " + e.getMessage());
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
