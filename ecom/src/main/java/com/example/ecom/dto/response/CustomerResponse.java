package com.example.ecom.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerResponse extends UserResponse {
    private String shippingAddress;
    private String billingAddress;
}
