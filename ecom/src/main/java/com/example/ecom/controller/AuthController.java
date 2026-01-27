package com.example.ecom.controller;

import com.example.ecom.dto.request.CustomerRegistrationRequest;
import com.example.ecom.dto.request.LoginRequest;
import com.example.ecom.dto.request.SellerRegistrationRequest;
import com.example.ecom.dto.response.CustomerResponse;
import com.example.ecom.dto.response.SellerResponse;
import com.example.ecom.dto.response.UserResponse;
import com.example.ecom.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletRequest httpRequest) {
        UserResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/customer")
    public ResponseEntity<CustomerResponse> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest request) {
        CustomerResponse response = authService.registerCustomer(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/seller")
    public ResponseEntity<SellerResponse> registerSeller(@Valid @RequestBody SellerRegistrationRequest request) {
        SellerResponse response = authService.registerSeller(request);
        return ResponseEntity.ok(response);
    }
}
