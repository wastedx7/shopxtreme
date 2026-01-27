package com.example.ecom.controller;

import com.example.ecom.dto.request.AddToCartRequest;
import com.example.ecom.dto.request.UpdateCartItemRequest;
import com.example.ecom.dto.response.CartResponse;
import com.example.ecom.dto.response.OrderResponse;
import com.example.ecom.dto.EntityMapper;
import com.example.ecom.entities.Order;
import com.example.ecom.security.CustomUserDetails;
import com.example.ecom.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    private final EntityMapper entityMapper;
    
    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        CartResponse cart = cartService.getCart(customerId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        CartResponse cart = cartService.addToCart(customerId, request);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(@PathVariable UUID itemId,
                                                       @Valid @RequestBody UpdateCartItemRequest request,
                                                       @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        CartResponse cart = cartService.updateCartItem(customerId, itemId, request);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable UUID itemId,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        cartService.removeCartItem(customerId, itemId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID customerId = userDetails.getUser().getId();
        Order order = cartService.checkout(customerId);
        return ResponseEntity.ok(entityMapper.toOrderResponse(order));
    }
}
