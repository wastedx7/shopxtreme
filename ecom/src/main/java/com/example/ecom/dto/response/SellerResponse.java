package com.example.ecom.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SellerResponse extends UserResponse {
    private String shopName;
    private String shopDescription;
    private Boolean verified;
}
