package com.example.ecom.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sellers")
@Getter
@Setter
public class Seller extends User {
    
    @Column(nullable = false)
    private String shopName;
    
    @Column(length = 2000)
    private String shopDescription;
    
    @Column(length = 1000)
    private String bankAccount;
    
    @Column(nullable = false)
    private Boolean verified = false;
}
