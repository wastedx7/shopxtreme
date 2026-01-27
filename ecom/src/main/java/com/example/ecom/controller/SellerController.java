package com.example.ecom.controller;

import com.example.ecom.dto.response.OrderResponse;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.dto.response.SellerResponse;
import com.example.ecom.dto.response.SellerStatsResponse;
import com.example.ecom.service.OrderService;
import com.example.ecom.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sellers")
@RequiredArgsConstructor
public class SellerController {
    
    private final SellerService sellerService;
    private final OrderService orderService;
    
    @GetMapping("/{id}")
    public ResponseEntity<SellerResponse> getSellerById(@PathVariable UUID id) {
        SellerResponse seller = sellerService.getSellerById(id);
        return ResponseEntity.ok(seller);
    }
    
    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(@PathVariable UUID id) {
        List<ProductResponse> products = sellerService.getSellerProducts(id);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}/stats")
    public ResponseEntity<SellerStatsResponse> getSellerStats(@PathVariable UUID id) {
        SellerStatsResponse stats = sellerService.getSellerStats(id);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{id}/orders")
    public ResponseEntity<Page<OrderResponse>> getSellerOrders(@PathVariable UUID id, Pageable pageable) {
        Page<OrderResponse> orders = orderService.getSellerOrders(id, pageable);
        return ResponseEntity.ok(orders);
    }
}
