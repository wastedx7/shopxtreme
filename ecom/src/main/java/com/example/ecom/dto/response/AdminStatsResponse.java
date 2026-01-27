package com.example.ecom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalSellers;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalProducts;
}
