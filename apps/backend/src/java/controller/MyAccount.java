package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

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
            
            Session s = HibernateUtil.getSessionFactory().openSession();
            Criteria c = s.createCriteria(Address.class);
            
            c.add(Restrictions.eq("user", user));
            if (!c.list().isEmpty()) {
                
                @SuppressWarnings("unchecked")
                List<Address> addressList = c.list();
                
                respoJsonObject.add("addressList", gson.toJsonTree(addressList));
                
            }
            
            String toJson = gson.toJson(respoJsonObject);
            response.setContentType("application/json");
            response.getWriter().write(toJson);
            
        }
        
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);
        
        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String postalCode = userData.get("postalCode").getAsString();
        int cityId = userData.get("cityId").getAsInt();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "First name can not be empty!");
        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last name can not be empty!");
        } else if (lineOne.isEmpty()) {
            responseObject.addProperty("message", "Enter address line one");
        } else if (lineTwo.isEmpty()) {
            responseObject.addProperty("message", "Enter address line two");
        } else if (postalCode.isEmpty()) {
            responseObject.addProperty("message", "Enter your postal code");
        } else if (!Util.isCodeValid(postalCode)) {
            responseObject.addProperty("message", "Enter correct postal code");
        } else if (cityId == 0) {
            
            responseObject.addProperty("message", "Select a city");
            
        } else {
            
            HttpSession ses = request.getSession();
            
            if (ses.getAttribute("user") != null) {
                
                User u = (User) ses.getAttribute("user");  // get session user

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                
                User u1 = (User) s.get(User.class, u.getId());

                if (u1 != null) {
                    
                    u1.setFirst_name(firstName);
                    u1.setLast_name(lastName);
                    
                    City city = (City) s.load(City.class, cityId);   // primary key search
                    
                    Criteria addressCriteria = s.createCriteria(Address.class);
                    addressCriteria.add(Restrictions.eq("user", u1));
                    Address address;
                    if(addressCriteria.list().isEmpty()){
                        address = new Address();
                    }else{
                        address = (Address) addressCriteria.list().get(0);
                    }
                    
                    address.setLineOne(lineOne);
                    address.setLineTwo(lineTwo);
                    address.setPostalCode(postalCode);
                    address.setCity(city);
                    address.setUser(u1);

                    // session-management
                    ses.setAttribute("user", u1);
                    // session-management

                    s.merge(u1);
                    s.saveOrUpdate(address);
                    
                    s.beginTransaction().commit();
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "User profile details update successfully!");
                    s.close();
                    
                }
                
            }
            
        }
        
        String responseText = gson.toJson(responseObject);
        
        response.setContentType("application/json");
        response.getWriter().write(responseText);
    }
}
