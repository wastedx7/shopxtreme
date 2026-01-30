package com.example.ecom.controller;

import com.example.ecom.dto.request.ProductRequest;
import com.example.ecom.dto.request.ReviewRequest;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.dto.response.ReviewResponse;
import com.example.ecom.security.CustomUserDetails;
import com.example.ecom.service.ProductService;
import com.example.ecom.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    private final ReviewService reviewService;
    
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID sellerId,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<ProductResponse> products = productService.getAllProducts(categoryId, sellerId, search, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    // @PostMapping
    // public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
    //     ProductResponse product = productService.createProduct(request);
    //     return ResponseEntity.ok(product);
    // }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable UUID id,
                                                         @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> createReview(@PathVariable UUID id,
                                                       @Valid @RequestBody ReviewRequest request,
                                                       @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        ReviewResponse review = reviewService.createReview(id, customerId, request);
        return ResponseEntity.ok(review);
    }
    
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(@PathVariable UUID id, Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getProductReviews(id, pageable);
        return ResponseEntity.ok(reviews);
    }

    // temp
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
    System.out.println(">>> createProduct endpoint hit");
    ProductResponse product = productService.createProduct(request);
    return ResponseEntity.ok(product);
    }

}
