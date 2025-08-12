package controller.admin;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Status;
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
import org.hibernate.Transaction;

@WebServlet(name = "ApproveProduct", urlPatterns = {"/admin/ApproveProduct"})
public class ApproveProduct extends HttpServlet {

    private static final int ACTIVE_STATUS_ID = 8; // used elsewhere

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject res = new JsonObject();
        res.addProperty("status", false);

        // Only Admins allowed
        HttpSession httpSession = request.getSession(false);
        if (httpSession == null || httpSession.getAttribute("user") == null ||
                !"Admin".equals(((User) httpSession.getAttribute("user")).getVerification())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            res.addProperty("message", "Forbidden: Admins only");
            writeJson(response, gson, res);
            return;
        }

        String productId = request.getParameter("productId");
        if (!Util.isInteger(productId)) {
            res.addProperty("message", "Invalid product id");
            writeJson(response, gson, res);
            return;
        }

        Session s = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = null;
        try {
            int pid = Integer.parseInt(productId);
            Product p = (Product) s.get(Product.class, pid);
            if (p == null) {
                res.addProperty("message", "Product not found");
            } else {
                Status active = (Status) s.get(Status.class, ACTIVE_STATUS_ID);
                tx = s.beginTransaction();
                p.setStatus(active);
                s.update(p);
                tx.commit();
                res.addProperty("status", true);
                res.addProperty("message", "Product approved");
            }
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            res.addProperty("message", "Failed to approve product");
        } finally {
            s.close();
        }

        writeJson(response, gson, res);
    }

    private void writeJson(HttpServletResponse response, Gson gson, JsonObject obj) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(obj));
    }
}
