package com.example.ecom.repository;

import com.example.ecom.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    Page<Order> findByCustomerId(UUID customerId, Pageable pageable);
    
    List<Order> findByCustomerId(UUID customerId);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi WHERE oi.product.seller.id = :sellerId")
    Page<Order> findOrdersBySellerId(@Param("sellerId") UUID sellerId, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o")
    Long countAllOrders();
}
