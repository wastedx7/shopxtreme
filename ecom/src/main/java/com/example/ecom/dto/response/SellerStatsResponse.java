package com.example.ecom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerStatsResponse {
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalRevenue;
}
