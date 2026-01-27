package com.example.ecom.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CartResponse {
    private UUID id;
    private UUID customerId;
    private List<CartItemResponse> items = new ArrayList<>();
    private BigDecimal totalAmount;
}
