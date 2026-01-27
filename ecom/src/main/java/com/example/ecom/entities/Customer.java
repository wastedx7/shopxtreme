package com.example.ecom.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
public class Customer extends User {
    
    @Column(length = 1000)
    private String shippingAddress;
    
    @Column(length = 1000)
    private String billingAddress;
    
    @ManyToMany
    @JoinTable(
        name = "customer_wishlist",
        joinColumns = @JoinColumn(name = "customer_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> wishlist = new ArrayList<>();
    
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
}
