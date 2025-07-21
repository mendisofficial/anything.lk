package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.text.SimpleDateFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "MyAccount", urlPatterns = {"/MyAccount"})
public class MyAccount extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        HttpSession ses = request.getSession(false);
        
        if (ses != null && ses.getAttribute("user") != null) {
            
            Gson gson = new Gson();
            
            User user = (User) ses.getAttribute("user");
            
            JsonObject respoJsonObject = new JsonObject();
            
            respoJsonObject.addProperty("firstname", user.getFirst_name());
            respoJsonObject.addProperty("lastname", user.getLast_name());

            String since = new SimpleDateFormat("MMM yyyy").format(user.getCreated_at());
            respoJsonObject.addProperty("since", since);
            
            String toJson = gson.toJson(respoJsonObject);
            response.setContentType("application/json");
            response.getWriter().write(toJson);
            
        } else {
            
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Please sign in to continue");
            
            response.setContentType("application/json");
            response.getWriter().write(new Gson().toJson(responseObject));
        }
        
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);
        
        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "First name can not be empty!");
        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last name can not be empty!");
        } else {
            
            HttpSession ses = request.getSession(false);
            
            if (ses == null || ses.getAttribute("user") == null) {
                responseObject.addProperty("message", "Please sign in to continue");
            } else {
                
                User u = (User) ses.getAttribute("user");  // get session user

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                
                try {
                    s.beginTransaction();
                    
                    User u1 = (User) s.get(User.class, u.getId());

                    if (u1 != null) {
                        
                        u1.setFirst_name(firstName);
                        u1.setLast_name(lastName);

                        // session-management
                        ses.setAttribute("user", u1);
                        // session-management

                        s.merge(u1);
                        s.getTransaction().commit();
                        
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "User profile details updated successfully!");
                        
                    } else {
                        responseObject.addProperty("message", "User not found");
                    }
                    
                } catch (Exception e) {
                    s.getTransaction().rollback();
                    responseObject.addProperty("message", "Error updating profile: " + e.getMessage());
                } finally {
                    s.close();
                }
            }
            
        }
        
        String responseText = gson.toJson(responseObject);
        
        response.setContentType("application/json");
        response.getWriter().write(responseText);
    }
}
