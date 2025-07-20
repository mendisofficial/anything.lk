package controller;

import com.google.gson.Gson;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import hibernate.City;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "CityData", urlPatterns = {"/CityData"})
public class CityData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        Criteria c = s.createCriteria(City.class);
        List<City> CityList = c.list();
        Gson gson = new Gson();
        String toJson = gson.toJson(CityList);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }
}
