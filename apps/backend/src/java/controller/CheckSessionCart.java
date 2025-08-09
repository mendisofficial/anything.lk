package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "CheckSessionCart", urlPatterns = {"/CheckSessionCart"})
public class CheckSessionCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        User user = (User) request.getSession().getAttribute("user");

        if (user != null) { //check if the is not null

            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart"); // get the session cart from session and set that to the arrayList object

            if (sessionCarts != null) { //if session is not null

                SessionFactory sf = HibernateUtil.getSessionFactory();

                Session s = sf.openSession();

                Transaction tr = s.beginTransaction();

                //criteria search to the cart table
                Criteria c1 = s.createCriteria(Cart.class);

                //check if the user in session is equal to teh user in cart
                c1.add(Restrictions.eq("user", user));

                for (Cart sessionCart : sessionCarts) {

                    Product product = (Product) s.get(Product.class, sessionCart.getProduct().getId());

                    // check if the products is  equal to the product is session product
                    c1.add(Restrictions.eq("product", sessionCart.getProduct()));

                    if (c1.list().isEmpty()) {//no product available in same product id

                        sessionCart.setUser(user); //http session user set the user to the session cart
                        s.save(sessionCart);//save the data to teh session cart
                        tr.commit();

                    } else {//if product available

                        Cart dbCart = (Cart) c1.uniqueResult();

                        int newQty = sessionCart.getQty() + dbCart.getQty();

                        if (newQty <= product.getQty()) {

                            dbCart.setQty(newQty);
                            dbCart.setUser(user);

                            s.update(dbCart);
                            tr.commit();

                        }

                    }

                }

            }
        }

    }

}
