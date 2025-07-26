package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.Condition;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Storage;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;

@WebServlet(name = "LoadProductData", urlPatterns = {"/LoadProductData"})
public class LoadProductData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject resObject = new JsonObject();

        resObject.addProperty("status", false);

        Session s = HibernateUtil.getSessionFactory().openSession();

        //get Brands
        Criteria c1 = s.createCriteria(Brand.class);
        List<Brand> brandList = c1.list();

        //get Models
        Criteria c2 = s.createCriteria(Model.class);
        List<Model> modelList = c2.list();

        //get Colors
        Criteria c3 = s.createCriteria(Color.class);
        List<Color> colorList = c3.list();

        //get Qualities
        Criteria c4 = s.createCriteria(Condition.class);
        List<Condition> qualityList = c4.list();

        //get Storage
        Criteria c5 = s.createCriteria(Storage.class);
        List<Storage> storageList = c5.list();

        s.close();

        resObject.add("brandList", gson.toJsonTree(brandList));
        resObject.add("modelList", gson.toJsonTree(modelList));
        resObject.add("colorList", gson.toJsonTree(colorList));
        resObject.add("qualityList", gson.toJsonTree(qualityList));
        resObject.add("storageList", gson.toJsonTree(storageList));

        resObject.addProperty("status", true);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(resObject));

    }

}
