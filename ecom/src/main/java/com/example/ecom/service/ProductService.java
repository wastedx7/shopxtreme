package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.ProductRequest;
import com.example.ecom.dto.response.ProductResponse;
import com.example.ecom.entities.Category;
import com.example.ecom.entities.Product;
import com.example.ecom.entities.Seller;
import com.example.ecom.entities.User;
import com.example.ecom.exception.BadRequestException;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.exception.UnauthorizedException;
import com.example.ecom.repository.CategoryRepository;
import com.example.ecom.repository.ProductRepository;
import com.example.ecom.repository.SellerRepository;
import com.example.ecom.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerRepository sellerRepository;
    private final EntityMapper entityMapper;
    
    public Page<ProductResponse> getAllProducts(UUID categoryId, UUID sellerId, String search, Pageable pageable) {
        logger.info("Fetching products - category: {}, seller: {}, search: {}", categoryId, sellerId, search);
        
        Page<Product> products;
        
        if (search != null && !search.isBlank()) {
            if (categoryId != null) {
                products = productRepository.searchProductsByCategory(categoryId, search, pageable);
            } else if (sellerId != null) {
                products = productRepository.searchProductsBySeller(sellerId, search, pageable);
            } else {
                products = productRepository.searchProducts(search, pageable);
            }
        } else {
            if (categoryId != null) {
                products = productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
            } else if (sellerId != null) {
                products = productRepository.findBySellerIdAndIsActiveTrue(sellerId, pageable);
            } else {
                products = productRepository.findByIsActiveTrue(pageable);
            }
        }
        
        return products.map(entityMapper::toProductResponse);
    }
    
    public ProductResponse getProductById(UUID id) {
        logger.info("Fetching product by ID: {}", id);
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return entityMapper.toProductResponse(product);
    }
    
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        logger.info("Creating new product: {}", request.getName());
        
        User currentUser = getCurrentUser();
        if (!(currentUser instanceof Seller)) {
            throw new UnauthorizedException("Only sellers can create products");
        }
        
        Seller seller = (Seller) currentUser;
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        Product product = entityMapper.toProduct(request);
        product.setSeller(seller);
        product.setCategory(category);
        
        Product savedProduct = productRepository.save(product);
        logger.info("Product created successfully: {}", savedProduct.getId());
        
        return entityMapper.toProductResponse(savedProduct);
    }
    
    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        logger.info("Updating product: {}", id);
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRoles().contains("ROLE_ADMIN");
        boolean isOwner = product.getSeller().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You can only update your own products");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setSku(request.getSku());
        product.setImages(request.getImages());
        product.setCategory(category);
        
        Product updatedProduct = productRepository.save(product);
        logger.info("Product updated successfully: {}", updatedProduct.getId());
        
        return entityMapper.toProductResponse(updatedProduct);
    }
    
    @Transactional
    public void deleteProduct(UUID id) {
        logger.info("Deleting (soft delete) product: {}", id);
        
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        User currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRoles().contains("ROLE_ADMIN");
        boolean isOwner = product.getSeller().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You can only delete your own products");
        }
        
        product.setIsActive(false);
        productRepository.save(product);
        logger.info("Product soft deleted: {}", id);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }
}
