package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.dto.response.SellerResponse;
import com.example.ecom.dto.response.SellerStatsResponse;
import com.example.ecom.entities.Order;
import com.example.ecom.entities.Product;
import com.example.ecom.entities.Seller;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.OrderRepository;
import com.example.ecom.repository.ProductRepository;
import com.example.ecom.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellerService {
    
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final EntityMapper entityMapper;
    
    public SellerResponse getSellerById(UUID id) {
        Seller seller = sellerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        return entityMapper.toSellerResponse(seller);
    }
    
    public List<ProductResponse> getSellerProducts(UUID sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        return entityMapper.toProductResponseList(products);
    }
    
    public SellerStatsResponse getSellerStats(UUID sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
            .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        
        List<Product> products = productRepository.findBySellerId(sellerId);
        long totalProducts = products.size();
        
        List<Order> orders = orderRepository.findAll().stream()
            .filter(order -> order.getItems().stream()
                .anyMatch(item -> item.getProduct().getSeller().getId().equals(sellerId)))
            .toList();
        
        long totalOrders = orders.size();
        
        BigDecimal totalRevenue = orders.stream()
            .flatMap(order -> order.getItems().stream())
            .filter(item -> item.getProduct().getSeller().getId().equals(sellerId))
            .map(item -> item.getTotalPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new SellerStatsResponse(totalProducts, totalOrders, totalRevenue);
    }
    
    @Transactional
    public SellerResponse verifySeller(UUID sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
            .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        
        seller.setVerified(true);
        Seller verifiedSeller = sellerRepository.save(seller);
        return entityMapper.toSellerResponse(verifiedSeller);
    }
    
    public List<SellerResponse> getPendingSellers() {
        List<Seller> sellers = sellerRepository.findByVerifiedFalse();
        return entityMapper.toSellerResponseList(sellers);
    }
}
