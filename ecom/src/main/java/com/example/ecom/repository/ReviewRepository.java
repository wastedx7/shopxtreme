package com.example.ecom.repository;

import com.example.ecom.entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    Page<Review> findByProductId(UUID productId, Pageable pageable);
    
    Optional<Review> findByProductIdAndCustomerId(UUID productId, UUID customerId);
    
    boolean existsByProductIdAndCustomerId(UUID productId, UUID customerId);
}
