package com.example.ecom.controller;

import com.example.ecom.dto.response.CustomerResponse;
import com.example.ecom.dto.response.OrderResponse;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.service.CustomerService;
import com.example.ecom.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerService customerService;
    private final OrderService orderService;
    
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable UUID id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable UUID id,
                                                           @RequestBody CustomerResponse request) {
        CustomerResponse customer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(customer);
    }
    
    @GetMapping("/{id}/orders")
    public ResponseEntity<Page<OrderResponse>> getCustomerOrders(@PathVariable UUID id, Pageable pageable) {
        Page<OrderResponse> orders = orderService.getCustomerOrders(id, pageable);
        return ResponseEntity.ok(orders);
    }
    
    @PostMapping("/{id}/wishlist/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable UUID id, @PathVariable UUID productId) {
        customerService.addToWishlist(id, productId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}/wishlist")
    public ResponseEntity<List<ProductResponse>> getWishlist(@PathVariable UUID id) {
        List<ProductResponse> wishlist = customerService.getWishlist(id);
        return ResponseEntity.ok(wishlist);
    }
}
