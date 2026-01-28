package com.example.ecom.config;

import com.example.ecom.entities.*;
import com.example.ecom.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
    
    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            logger.info("Loading initial data...");
            
            // Create Admin
            Admin admin = new Admin();
            admin.setEmail("admin@ecom.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setPhone("+1234567890");
            Set<String> adminRoles = new HashSet<>();
            adminRoles.add("ROLE_ADMIN");
            admin.setRoles(adminRoles);
            adminRepository.save(admin);
            logger.info("Admin user created: admin@ecom.com");
            
            // Create Customers
            Customer customer1 = new Customer();
            customer1.setEmail("customer1@example.com");
            customer1.setPassword(passwordEncoder.encode("password123"));
            customer1.setFirstName("John");
            customer1.setLastName("Doe");
            customer1.setPhone("+1111111111");
            customer1.setShippingAddress("123 Main St, City, State 12345");
            customer1.setBillingAddress("123 Main St, City, State 12345");
            Set<String> customerRoles = new HashSet<>();
            customerRoles.add("ROLE_CUSTOMER");
            customer1.setRoles(customerRoles);
            Cart cart1 = new Cart();
            cart1.setCustomer(customer1);
            customer1.setCart(cart1);
            customerRepository.save(customer1);
            
            Customer customer2 = new Customer();
            customer2.setEmail("customer2@example.com");
            customer2.setPassword(passwordEncoder.encode("password123"));
            customer2.setFirstName("Jane");
            customer2.setLastName("Smith");
            customer2.setPhone("+2222222222");
            customer2.setShippingAddress("456 Oak Ave, Town, State 67890");
            customer2.setBillingAddress("456 Oak Ave, Town, State 67890");
            customer2.setRoles(new HashSet<>(customerRoles));
            Cart cart2 = new Cart();
            cart2.setCustomer(customer2);
            customer2.setCart(cart2);
            customerRepository.save(customer2);
            logger.info("2 Customers created");
            
            // Create Sellers
            Seller seller1 = new Seller();
            seller1.setEmail("seller1@example.com");
            seller1.setPassword(passwordEncoder.encode("password123"));
            seller1.setFirstName("Robert");
            seller1.setLastName("Brown");
            seller1.setPhone("+3333333333");
            seller1.setShopName("Tech Haven");
            seller1.setShopDescription("Your one-stop shop for electronics");
            seller1.setBankAccount("{\"bank\": \"Bank of America\", \"account\": \"****1234\"}");
            seller1.setVerified(true);
            Set<String> sellerRoles = new HashSet<>();
            sellerRoles.add("ROLE_SELLER");
            seller1.setRoles(sellerRoles);
            sellerRepository.save(seller1);
            
            Seller seller2 = new Seller();
            seller2.setEmail("seller2@example.com");
            seller2.setPassword(passwordEncoder.encode("password123"));
            seller2.setFirstName("Emily");
            seller2.setLastName("Johnson");
            seller2.setPhone("+4444444444");
            seller2.setShopName("Fashion Forward");
            seller2.setShopDescription("Trendy fashion for everyone");
            seller2.setBankAccount("{\"bank\": \"Chase\", \"account\": \"****5678\"}");
            seller2.setVerified(true);
            seller2.setRoles(new HashSet<>(sellerRoles));
            sellerRepository.save(seller2);
            
            Seller seller3 = new Seller();
            seller3.setEmail("seller3@example.com");
            seller3.setPassword(passwordEncoder.encode("password123"));
            seller3.setFirstName("Michael");
            seller3.setLastName("Davis");
            seller3.setPhone("+5555555555");
            seller3.setShopName("Home Essentials");
            seller3.setShopDescription("Everything you need for your home");
            seller3.setBankAccount("{\"bank\": \"Wells Fargo\", \"account\": \"****9012\"}");
            seller3.setVerified(false);
            seller3.setRoles(new HashSet<>(sellerRoles));
            sellerRepository.save(seller3);
            logger.info("3 Sellers created (2 verified, 1 pending)");
            
            // Create Categories
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and accessories");
            electronics.setIsActive(true);
            categoryRepository.save(electronics);
            
            Category laptops = new Category();
            laptops.setName("Laptops");
            laptops.setDescription("Laptop computers");
            laptops.setParentCategory(electronics);
            laptops.setIsActive(true);
            categoryRepository.save(laptops);
            
            Category fashion = new Category();
            fashion.setName("Fashion");
            fashion.setDescription("Clothing and accessories");
            fashion.setIsActive(true);
            categoryRepository.save(fashion);
            
            Category home = new Category();
            home.setName("Home & Garden");
            home.setDescription("Home improvement and garden supplies");
            home.setIsActive(true);
            categoryRepository.save(home);
            logger.info("Categories created");
            
            // Create Products
            Product product1 = new Product();
            product1.setSeller(seller1);
            product1.setName("Premium Laptop Pro");
            product1.setDescription("High-performance laptop with 16GB RAM and 512GB SSD");
            product1.setPrice(new BigDecimal("129999.99"));
            product1.setStock(50);
            product1.setSku("LAPTOP-001");
            product1.setCategory(laptops);
            product1.setIsActive(true);
            List<String> images1 = new ArrayList<>();
            images1.add("/uploads/laptop1.jpg");
            product1.setImages(images1);
            productRepository.save(product1);
            
            Product product2 = new Product();
            product2.setSeller(seller1);
            product2.setName("Wireless Mouse");
            product2.setDescription("Ergonomic wireless mouse with precision tracking");
            product2.setPrice(new BigDecimal("299.99"));
            product2.setStock(200);
            product2.setSku("MOUSE-001");
            product2.setCategory(electronics);
            product2.setIsActive(true);
            productRepository.save(product2);
            
            Product product3 = new Product();
            product3.setSeller(seller1);
            product3.setName("USB-C Hub");
            product3.setDescription("7-in-1 USB-C hub with HDMI, USB ports, and SD card reader");
            product3.setPrice(new BigDecimal("499.99"));
            product3.setStock(150);
            product3.setSku("HUB-001");
            product3.setCategory(electronics);
            product3.setIsActive(true);
            productRepository.save(product3);
            
            Product product4 = new Product();
            product4.setSeller(seller2);
            product4.setName("Designer T-Shirt");
            product4.setDescription("Premium cotton t-shirt with modern design");
            product4.setPrice(new BigDecimal("399.99"));
            product4.setStock(100);
            product4.setSku("TSHIRT-001");
            product4.setCategory(fashion);
            product4.setIsActive(true);
            productRepository.save(product4);
            
            Product product5 = new Product();
            product5.setSeller(seller2);
            product5.setName("Denim Jeans");
            product5.setDescription("Comfortable stretch denim jeans");
            product5.setPrice(new BigDecimal("799.99"));
            product5.setStock(80);
            product5.setSku("JEANS-001");
            product5.setCategory(fashion);
            product5.setIsActive(true);
            productRepository.save(product5);
            
            Product product6 = new Product();
            product6.setSeller(seller3);
            product6.setName("Garden Tools Set");
            product6.setDescription("Complete 10-piece garden tools set");
            product6.setPrice(new BigDecimal("599.99"));
            product6.setStock(40);
            product6.setSku("GARDEN-001");
            product6.setCategory(home);
            product6.setIsActive(false); // Inactive because seller3 is not verified
            productRepository.save(product6);
            
            logger.info("6 Products created");
            logger.info("Initial data loading complete!");
        } else {
            logger.info("Data already exists, skipping initialization");
        }
    }
}
