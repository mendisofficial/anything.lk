package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
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

@WebServlet(name = "AddressManagement", urlPatterns = {"/AddressManagement"})
public class AddressManagement extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        HttpSession ses = request.getSession(false);
        
        if (ses == null || ses.getAttribute("user") == null) {
            responseObject.addProperty("message", "Please sign in to continue");
        } else {
            User user = (User) ses.getAttribute("user");
            
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            
            try {
                Criteria c = s.createCriteria(Address.class);
                c.add(Restrictions.eq("user", user));
                
                @SuppressWarnings("unchecked")
                List<Address> addressList = c.list();
                
                responseObject.addProperty("status", true);
                responseObject.add("addressList", gson.toJsonTree(addressList));
                
            } catch (Exception e) {
                responseObject.addProperty("message", "Error retrieving addresses: " + e.getMessage());
            } finally {
                s.close();
            }
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject addressData = gson.fromJson(request.getReader(), JsonObject.class);
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        // Extract address data from request
        String lineOne = addressData.has("lineOne") ? addressData.get("lineOne").getAsString() : "";
        String lineTwo = addressData.has("lineTwo") ? addressData.get("lineTwo").getAsString() : "";
        String postalCode = addressData.has("postalCode") ? addressData.get("postalCode").getAsString() : "";
        String label = addressData.has("label") ? addressData.get("label").getAsString() : "";
        boolean isDefault = addressData.has("isDefault") ? addressData.get("isDefault").getAsBoolean() : false;
        int cityId = addressData.has("cityId") ? addressData.get("cityId").getAsInt() : 0;
        int addressId = addressData.has("addressId") ? addressData.get("addressId").getAsInt() : 0; // For updates
        
        // Validation
        if (lineOne.isEmpty()) {
            responseObject.addProperty("message", "Address line one is required");
        } else if (lineTwo.isEmpty()) {
            responseObject.addProperty("message", "Address line two is required");
        } else if (postalCode.isEmpty()) {
            responseObject.addProperty("message", "Postal code is required");
        } else if (!Util.isCodeValid(postalCode)) {
            responseObject.addProperty("message", "Enter correct postal code format");
        } else if (cityId == 0) {
            responseObject.addProperty("message", "Please select a city");
        } else if (label.isEmpty()) {
            responseObject.addProperty("message", "Address label is required");
        } else {
            
            HttpSession ses = request.getSession(false);
            
            if (ses == null || ses.getAttribute("user") == null) {
                responseObject.addProperty("message", "Please sign in to continue");
            } else {
                
                User user = (User) ses.getAttribute("user");
                
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                
                try {
                    s.beginTransaction();
                    
                    // Get the city
                    City city = (City) s.get(City.class, cityId);
                    if (city == null) {
                        responseObject.addProperty("message", "Invalid city selected");
                    } else {
                        
                        Address address;
                        boolean isUpdate = false;
                        
                        // Check if this is an update (addressId > 0) or new address
                        if (addressId > 0) {
                            address = (Address) s.get(Address.class, addressId);
                            if (address == null || address.getUser().getId() != user.getId()) {
                                responseObject.addProperty("message", "Address not found or access denied");
                                return;
                            }
                            isUpdate = true;
                        } else {
                            address = new Address();
                            address.setUser(user);
                        }
                        
                        // If setting as default, remove default from other addresses
                        if (isDefault) {
                            Criteria defaultCriteria = s.createCriteria(Address.class);
                            defaultCriteria.add(Restrictions.eq("user", user));
                            defaultCriteria.add(Restrictions.eq("isDefault", true));
                            
                            @SuppressWarnings("unchecked")
                            List<Address> defaultAddresses = defaultCriteria.list();
                            
                            for (Address defaultAddr : defaultAddresses) {
                                if (defaultAddr.getId() != addressId) { // Don't update the current address yet
                                    defaultAddr.setIsDefault(false);
                                    s.update(defaultAddr);
                                }
                            }
                        }
                        
                        // Set address properties
                        address.setLineOne(lineOne);
                        address.setLineTwo(lineTwo);
                        address.setPostalCode(postalCode);
                        address.setCity(city);
                        address.setLabel(label);
                        address.setIsDefault(isDefault);
                        
                        // Save or update the address
                        s.saveOrUpdate(address);
                        
                        s.getTransaction().commit();
                        
                        responseObject.addProperty("status", true);
                        if (isUpdate) {
                            responseObject.addProperty("message", "Address updated successfully!");
                        } else {
                            responseObject.addProperty("message", "Address added successfully!");
                        }
                        responseObject.addProperty("addressId", address.getId());
                    }
                    
                } catch (Exception e) {
                    s.getTransaction().rollback();
                    responseObject.addProperty("message", "Error saving address: " + e.getMessage());
                } finally {
                    s.close();
                }
            }
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        // Get address ID from request parameter
        String addressIdParam = request.getParameter("addressId");
        
        if (addressIdParam == null || addressIdParam.isEmpty()) {
            responseObject.addProperty("message", "Address ID is required");
        } else {
            
            try {
                int addressId = Integer.parseInt(addressIdParam);
                
                HttpSession ses = request.getSession(false);
                
                if (ses == null || ses.getAttribute("user") == null) {
                    responseObject.addProperty("message", "Please sign in to continue");
                } else {
                    
                    User user = (User) ses.getAttribute("user");
                    
                    SessionFactory sf = HibernateUtil.getSessionFactory();
                    Session s = sf.openSession();
                    
                    try {
                        s.beginTransaction();
                        
                        Address address = (Address) s.get(Address.class, addressId);
                        
                        if (address == null) {
                            responseObject.addProperty("message", "Address not found");
                        } else if (address.getUser().getId() != user.getId()) {
                            responseObject.addProperty("message", "Access denied");
                        } else {
                            s.delete(address);
                            s.getTransaction().commit();
                            
                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Address deleted successfully!");
                        }
                        
                    } catch (Exception e) {
                        s.getTransaction().rollback();
                        responseObject.addProperty("message", "Error deleting address: " + e.getMessage());
                    } finally {
                        s.close();
                    }
                }
                
            } catch (NumberFormatException e) {
                responseObject.addProperty("message", "Invalid address ID format");
            }
        }
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
