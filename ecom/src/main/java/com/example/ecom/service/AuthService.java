package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.CustomerRegistrationRequest;
import com.example.ecom.dto.request.LoginRequest;
import com.example.ecom.dto.request.SellerRegistrationRequest;
import com.example.ecom.dto.response.CustomerResponse;
import com.example.ecom.dto.response.SellerResponse;
import com.example.ecom.dto.response.UserResponse;
import com.example.ecom.entities.Cart;
import com.example.ecom.entities.Customer;
import com.example.ecom.entities.Seller;
import com.example.ecom.entities.User;
import com.example.ecom.exception.BadRequestException;
import com.example.ecom.repository.CustomerRepository;
import com.example.ecom.repository.SellerRepository;
import com.example.ecom.repository.UserRepository;
import com.example.ecom.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper entityMapper;
    
    @Transactional
    public UserResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        logger.info("Login attempt for user: {}", request.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);
        
        HttpSession session = httpRequest.getSession(true);
        session.setMaxInactiveInterval(30 * 60); // 30 minutes
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        
        logger.info("User logged in successfully: {}", user.getEmail());
        return entityMapper.toUserResponse(user);
    }
    
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            logger.info("Logging out user");
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }
    
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return entityMapper.toUserResponse(userDetails.getUser());
    }
    
    @Transactional
    public CustomerResponse registerCustomer(CustomerRegistrationRequest request) {
        logger.info("Registering new customer: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        Customer customer = new Customer();
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setShippingAddress(request.getShippingAddress());
        customer.setBillingAddress(request.getBillingAddress());
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_CUSTOMER");
        customer.setRoles(roles);
        
        // Create cart for customer
        Cart cart = new Cart();
        cart.setCustomer(customer);
        customer.setCart(cart);
        
        Customer savedCustomer = customerRepository.save(customer);
        logger.info("Customer registered successfully: {}", savedCustomer.getEmail());
        
        return entityMapper.toCustomerResponse(savedCustomer);
    }
    
    @Transactional
    public SellerResponse registerSeller(SellerRegistrationRequest request) {
        logger.info("Registering new seller: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        Seller seller = new Seller();
        seller.setEmail(request.getEmail());
        seller.setPassword(passwordEncoder.encode(request.getPassword()));
        seller.setFirstName(request.getFirstName());
        seller.setLastName(request.getLastName());
        seller.setPhone(request.getPhone());
        seller.setShopName(request.getShopName());
        seller.setShopDescription(request.getShopDescription());
        seller.setBankAccount(request.getBankAccount());
        seller.setVerified(false);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_SELLER");
        seller.setRoles(roles);
        
        Seller savedSeller = sellerRepository.save(seller);
        logger.info("Seller registered successfully (pending verification): {}", savedSeller.getEmail());
        
        return entityMapper.toSellerResponse(savedSeller);
    }
}
