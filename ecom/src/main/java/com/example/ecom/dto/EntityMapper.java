package com.example.ecom.dto;

import com.example.ecom.dto.request.CategoryRequest;
import com.example.ecom.dto.request.ProductRequest;
import com.example.ecom.dto.response.*;
import com.example.ecom.entities.*;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityMapper {
    
    // User mappings
    UserResponse toUserResponse(User user);
    
    @Mapping(source = "shippingAddress", target = "shippingAddress")
    @Mapping(source = "billingAddress", target = "billingAddress")
    CustomerResponse toCustomerResponse(Customer customer);
    
    @Mapping(source = "shopName", target = "shopName")
    @Mapping(source = "shopDescription", target = "shopDescription")
    @Mapping(source = "verified", target = "verified")
    SellerResponse toSellerResponse(Seller seller);
    
    List<UserResponse> toUserResponseList(List<User> users);
    List<SellerResponse> toSellerResponseList(List<Seller> sellers);
    
    // Product mappings
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "seller.id", target = "sellerId")
    @Mapping(source = "seller.shopName", target = "sellerShopName")
    ProductResponse toProductResponse(Product product);
    
    List<ProductResponse> toProductResponseList(List<Product> products);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "avgRating", ignore = true)
    @Mapping(target = "reviewsCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ProductRequest request);
    
    // Category mappings
    @Mapping(source = "parentCategory.id", target = "parentCategoryId")
    CategoryResponse toCategoryResponse(Category category);
    
    List<CategoryResponse> toCategoryResponseList(List<Category> categories);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "subcategories", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toCategory(CategoryRequest request);
    
    // Cart mappings
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(target = "totalAmount", expression = "java(calculateCartTotal(cart))")
    CartResponse toCartResponse(Cart cart);
    
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "productPrice")
    @Mapping(target = "subtotal", expression = "java(calculateItemSubtotal(cartItem))")
    CartItemResponse toCartItemResponse(CartItem cartItem);
    
    List<CartItemResponse> toCartItemResponseList(List<CartItem> items);
    
    // Order mappings
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.firstName", target = "customerName", 
             qualifiedByName = "fullName")
    OrderResponse toOrderResponse(Order order);
    
    List<OrderResponse> toOrderResponseList(List<Order> orders);
    
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
    
    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> items);
    
    // Review mappings
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.firstName", target = "customerName",
             qualifiedByName = "fullName")
    ReviewResponse toReviewResponse(Review review);
    
    List<ReviewResponse> toReviewResponseList(List<Review> reviews);
    
    // Helper methods
    default BigDecimal calculateCartTotal(Cart cart) {
        return cart.getItems().stream()
            .map(this::calculateItemSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    default BigDecimal calculateItemSubtotal(CartItem item) {
        return item.getProduct().getPrice()
            .multiply(BigDecimal.valueOf(item.getQuantity()));
    }
    
    @Named("fullName")
    default String getFullName(String firstName) {
        // This will be called with firstName only due to MapStruct limitation
        // The full implementation is in the service layer
        return firstName;
    }
}
