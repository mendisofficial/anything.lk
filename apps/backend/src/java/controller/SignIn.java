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
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject signIn = gson.fromJson(request.getReader(), JsonObject.class);
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        final String email = signIn.get("email").getAsString();
        String password = signIn.get("password").getAsString();

        if (email.isEmpty()) {
            responseObject.addProperty("message", "Email can't be empty!");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter a valid email!");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password can't be empty!");  
        } else {
            
            Session s = HibernateUtil.getSessionFactory().openSession();
            Criteria c = s.createCriteria(User.class);
            
            Criterion crt1 = Restrictions.eq("email", email);
            Criterion crt2 = Restrictions.eq("password", password);
            
            c.add(crt1);
            c.add(crt2);
            
            if (c.list().isEmpty()) {
                responseObject.addProperty("message", "Invalid email or password!");
            } else {
                
                User u = (User) c.list().get(0);
                
                responseObject.addProperty("status", true);

                //Add session 
                HttpSession ses = request.getSession();
                
                boolean isAdmin = "Admin".equals(u.getVerification());
                if (!u.getVerification().equals("Verified") && !isAdmin) { // not verified
                    ses.setAttribute("email", email);
                    responseObject.addProperty("message", "Please verify your email"); // email not verified user
                } else { // verified or admin
                    ses.setAttribute("user", u);
                    responseObject.addProperty("message", "Successfully signed in!"); // verified User
                    
                    // Add user details to response
                    JsonObject userObject = new JsonObject();
                    userObject.addProperty("id", u.getId());
                    userObject.addProperty("firstName", u.getFirst_name());
                    userObject.addProperty("lastName", u.getLast_name());
                    userObject.addProperty("email", u.getEmail());
                    userObject.addProperty("isAdmin", isAdmin);
                    // userObject.addProperty("verification", u.getVerification());
                    // userObject.addProperty("created_at", u.getCreated_at().toString());
                    responseObject.add("user", userObject);
                }
            }
            s.close();
        }
        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
    }
}
