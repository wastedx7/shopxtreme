package com.example.ecom.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private List<String> images;
    private UUID categoryId;
    private String categoryName;
    private UUID sellerId;
    private String sellerShopName;
    private Boolean isActive;
    private BigDecimal avgRating;
    private Integer reviewsCount;
    private LocalDateTime createdAt;
}
