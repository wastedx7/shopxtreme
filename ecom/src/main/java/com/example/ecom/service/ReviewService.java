package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.ReviewRequest;
import com.example.ecom.dto.response.ReviewResponse;
import com.example.ecom.entities.*;
import com.example.ecom.exception.BadRequestException;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final EntityMapper entityMapper;
    
    public Page<ReviewResponse> getProductReviews(UUID productId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        return reviews.map(entityMapper::toReviewResponse);
    }
    
    @Transactional
    public ReviewResponse createReview(UUID productId, UUID customerId, ReviewRequest request) {
        logger.info("Creating review for product {} by customer {}", productId, customerId);
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        // Check if customer has purchased this product
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        boolean hasPurchased = orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
            .flatMap(order -> order.getItems().stream())
            .anyMatch(item -> item.getProduct().getId().equals(productId));
        
        if (!hasPurchased) {
            throw new BadRequestException("You can only review products you have purchased");
        }
        
        // Check if customer has already reviewed this product
        if (reviewRepository.existsByProductIdAndCustomerId(productId, customerId)) {
            throw new BadRequestException("You have already reviewed this product");
        }
        
        Review review = new Review();
        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review savedReview = reviewRepository.save(review);
        
        // Update product rating
        updateProductRating(product);
        
        logger.info("Review created successfully");
        return entityMapper.toReviewResponse(savedReview);
    }
    
    private void updateProductRating(Product product) {
        Page<Review> reviews = reviewRepository.findByProductId(product.getId(), Pageable.unpaged());
        
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            
            product.setAvgRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
            product.setReviewsCount((int) reviews.getTotalElements());
            productRepository.save(product);
        }
    }
}
