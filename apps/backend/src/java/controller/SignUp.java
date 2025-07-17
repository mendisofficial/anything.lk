package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//        System.out.println("OK");
        Gson gson = new Gson();
        
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);
        
        String firstname = user.get("firstname").getAsString();
        String lastname = user.get("lastname").getAsString();
        final String email = user.get("email").getAsString();
        String password = user.get("password").getAsString();

//        System.out.println(firstname);
//        System.out.println(lastname);
//        System.out.println(email);
//        System.out.println(password);
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Validation
        if (firstname.isEmpty()) {
            
            responseObject.addProperty("message", "First Name can be empty!");
            
        } else if (lastname.isEmpty()) {
            
            responseObject.addProperty("message", "Last Name can be empty!");
            
        } else if (email.isEmpty()) {
            
            responseObject.addProperty("message", "Email can be empty!");
            
        } else if (!Util.isEmailValid(email)) {
            
            responseObject.addProperty("message", "Please enter a Valide email!");
            
        } else if (password.isEmpty()) {
            
            responseObject.addProperty("message", "Password can be empty!");
            
        } else if (!Util.isPasswordValid(password)) {
            
            responseObject.addProperty("message", "The Password must contains at least uppercase,lowercase "
                    + "number, special character and to be eight characters long!");
            
        } else {

            //Save
            Session session = HibernateUtil.getSessionFactory().openSession();
            
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));
            
            if (!criteria.list().isEmpty()) {
                
                responseObject.addProperty("message", "User with this Email already exists!!");
                
            } else {
                
                User u = new User();
                u.setFirst_name(firstname);
                u.setLast_name(lastname);
                u.setEmail(email);
                u.setPassword(password);

                // genarate verification code
                final String verificationCode = Util.genrateCode();
                u.setVerification(verificationCode);
                
                u.setCreated_at(new Date());
                
                session.save(u);
                session.beginTransaction().commit();

                // send Email
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        
                        Mail.sendMail(email, "SmartTrade - Verification", "<h1>" + verificationCode + "</h1>");
                        
                    }
                }).start();

                //session management
                HttpSession ses = request.getSession();
                ses.setAttribute("email", email);
                //session management
                
                responseObject.addProperty("status", true);
                
                responseObject.addProperty("message", "Registration success!!. Please check You email for the verification code.");
                
            }
            
            session.close();
        }
        
        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);
        
    }
    
}
