package com.example.ecom.repository;

import com.example.ecom.entities.Product;
import com.example.ecom.entities.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    Page<Product> findByCategoryIdAndIsActiveTrue(UUID categoryId, Pageable pageable);
    
    Page<Product> findBySellerIdAndIsActiveTrue(UUID sellerId, Pageable pageable);
    
    List<Product> findBySellerId(UUID sellerId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProductsByCategory(@Param("categoryId") UUID categoryId, 
                                            @Param("search") String search, 
                                            Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.seller.id = :sellerId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProductsBySeller(@Param("sellerId") UUID sellerId, 
                                          @Param("search") String search, 
                                          Pageable pageable);
}
