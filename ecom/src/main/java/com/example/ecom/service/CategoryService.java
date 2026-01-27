package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.CategoryRequest;
import com.example.ecom.dto.response.CategoryResponse;
import com.example.ecom.entities.Category;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final EntityMapper entityMapper;
    
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findByParentCategoryIsNull();
        return entityMapper.toCategoryResponseList(categories);
    }
    
    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return entityMapper.toCategoryResponse(category);
    }
    
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = entityMapper.toCategory(request);
        
        if (request.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        }
        
        Category savedCategory = categoryRepository.save(category);
        return entityMapper.toCategoryResponse(savedCategory);
    }
    
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        if (request.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parent);
        }
        
        Category updatedCategory = categoryRepository.save(category);
        return entityMapper.toCategoryResponse(updatedCategory);
    }
    
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setIsActive(false);
        categoryRepository.save(category);
    }
}
