package com.example.ecom.controller;

import com.example.ecom.dto.request.CategoryRequest;
import com.example.ecom.dto.request.UpdateOrderStatusRequest;
import com.example.ecom.dto.response.*;
import com.example.ecom.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    private final CategoryService categoryService;
    private final SellerService sellerService;
    private final OrderService orderService;
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        AdminStatsResponse stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
    
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<UserResponse> updateUserRoles(@PathVariable UUID id,
                                                        @RequestBody Set<String> roles) {
        UserResponse user = adminService.updateUserRoles(id, roles);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/sellers/pending")
    public ResponseEntity<List<SellerResponse>> getPendingSellers() {
        List<SellerResponse> sellers = sellerService.getPendingSellers();
        return ResponseEntity.ok(sellers);
    }
    
    @PutMapping("/sellers/{id}/verify")
    public ResponseEntity<SellerResponse> verifySeller(@PathVariable UUID id) {
        SellerResponse seller = sellerService.verifySeller(id);
        return ResponseEntity.ok(seller);
    }
    
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.createCategory(request);
        return ResponseEntity.ok(category);
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable UUID id,
                                                           @Valid @RequestBody CategoryRequest request) {
        CategoryResponse category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(category);
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable UUID id,
                                                           @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(order);
    }
}
