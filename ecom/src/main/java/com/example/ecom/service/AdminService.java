package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.response.AdminStatsResponse;
import com.example.ecom.dto.response.UserResponse;
import com.example.ecom.entities.User;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final EntityMapper entityMapper;
    
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return entityMapper.toUserResponseList(users);
    }
    
    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = customerRepository.count();
        long totalSellers = sellerRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        
        BigDecimal totalRevenue = orderRepository.findAll().stream()
            .map(order -> order.getTotalAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new AdminStatsResponse(totalUsers, totalCustomers, totalSellers,
            totalOrders, totalRevenue, totalProducts);
    }
    
    @Transactional
    public UserResponse updateUserRoles(UUID userId, Set<String> roles) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setRoles(roles);
        User updatedUser = userRepository.save(user);
        return entityMapper.toUserResponse(updatedUser);
    }
}
