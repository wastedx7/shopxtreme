package com.example.ecom.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewResponse {
    private UUID id;
    private UUID productId;
    private UUID customerId;
    private String customerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
