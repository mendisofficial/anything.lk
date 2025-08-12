package hibernate;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "address")
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "line1", nullable = false)
    private String lineOne;

    @Column(name = "line2", nullable = false)
    private String lineTwo;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "postal_code", length = 5, nullable = false)
    private String postalCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "label", length = 50)
    private String label;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "first_name", length = 45)
    private String firstName;

    @Column(name = "last_name", length = 45)
    private String lastName;

    public Address() {
    }

    // ID
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    // Address Lines
    public String getLineOne() {
        return lineOne;
    }
    public void setLineOne(String lineOne) {
        this.lineOne = lineOne;
    }

    public String getLineTwo() {
        return lineTwo;
    }
    public void setLineTwo(String lineTwo) {
        this.lineTwo = lineTwo;
    }

    // City
    public City getCity() {
        return city;
    }
    public void setCity(City city) {
        this.city = city;
    }

    // Postal Code
    public String getPostalCode() {
        return postalCode;
    }
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    // User
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    // Label
    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }

    // Default Address Flag
    public boolean isDefault() {
        return isDefault;
    }
    public void setIsDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    // Mobile
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    // First Name
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    // Last Name
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
