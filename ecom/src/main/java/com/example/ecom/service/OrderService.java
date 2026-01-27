package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.UpdateOrderStatusRequest;
import com.example.ecom.dto.response.OrderResponse;
import com.example.ecom.entities.*;
import com.example.ecom.exception.BadRequestException;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.exception.UnauthorizedException;
import com.example.ecom.repository.CustomerRepository;
import com.example.ecom.repository.OrderRepository;
import com.example.ecom.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final EntityMapper entityMapper;
    
    public OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRoles().contains("ROLE_ADMIN");
        boolean isCustomer = order.getCustomer().getId().equals(currentUser.getId());
        boolean isSeller = order.getItems().stream()
            .anyMatch(item -> item.getProduct().getSeller().getId().equals(currentUser.getId()));
        
        if (!isAdmin && !isCustomer && !isSeller) {
            throw new UnauthorizedException("You don't have permission to view this order");
        }
        
        return entityMapper.toOrderResponse(order);
    }
    
    public Page<OrderResponse> getCustomerOrders(UUID customerId, Pageable pageable) {
        customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Page<Order> orders = orderRepository.findByCustomerId(customerId, pageable);
        return orders.map(entityMapper::toOrderResponse);
    }
    
    public Page<OrderResponse> getSellerOrders(UUID sellerId, Pageable pageable) {
        Page<Order> orders = orderRepository.findOrdersBySellerId(sellerId, pageable);
        return orders.map(entityMapper::toOrderResponse);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        logger.info("Updating order {} status to {}", orderId, request.getStatus());
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);
        
        logger.info("Simulated email notification: Order status updated to {} for customer {}",
            request.getStatus(), order.getCustomer().getEmail());
        
        return entityMapper.toOrderResponse(updatedOrder);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }
}
