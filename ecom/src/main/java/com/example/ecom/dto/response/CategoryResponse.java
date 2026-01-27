package com.example.ecom.dto.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class CategoryResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID parentCategoryId;
    private List<CategoryResponse> subcategories = new ArrayList<>();
    private Boolean isActive;
}
