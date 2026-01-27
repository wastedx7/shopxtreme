package com.example.ecom.service;

import com.example.ecom.dto.EntityMapper;
import com.example.ecom.dto.request.AddToCartRequest;
import com.example.ecom.dto.request.UpdateCartItemRequest;
import com.example.ecom.dto.response.CartResponse;
import com.example.ecom.entities.*;
import com.example.ecom.exception.BadRequestException;
import com.example.ecom.exception.ResourceNotFoundException;
import com.example.ecom.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final EntityMapper entityMapper;
    
    public CartResponse getCart(UUID customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Cart cart = cartRepository.findByCustomerId(customerId)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setCustomer(customer);
                return cartRepository.save(newCart);
            });
        
        return entityMapper.toCartResponse(cart);
    }
    
    @Transactional
    public CartResponse addToCart(UUID customerId, AddToCartRequest request) {
        logger.info("Adding product {} to cart for customer {}", request.getProductId(), customerId);
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.getIsActive()) {
            throw new BadRequestException("Product is not available");
        }
        
        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }
        
        Cart cart = cartRepository.findByCustomerId(customerId)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setCustomer(customer);
                return cartRepository.save(newCart);
            });
        
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
            .orElse(null);
        
        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Insufficient stock");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }
        
        logger.info("Product added to cart successfully");
        return entityMapper.toCartResponse(cart);
    }
    
    @Transactional
    public CartResponse updateCartItem(UUID customerId, UUID itemId, UpdateCartItemRequest request) {
        logger.info("Updating cart item {} for customer {}", itemId, customerId);
        
        CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getCart().getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Cart item does not belong to this customer");
        }
        
        if (cartItem.getProduct().getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }
        
        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        
        Cart cart = cartItem.getCart();
        logger.info("Cart item updated successfully");
        return entityMapper.toCartResponse(cart);
    }
    
    @Transactional
    public void removeCartItem(UUID customerId, UUID itemId) {
        logger.info("Removing cart item {} for customer {}", itemId, customerId);
        
        CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getCart().getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Cart item does not belong to this customer");
        }
        
        cartItemRepository.delete(cartItem);
        logger.info("Cart item removed successfully");
    }
    
    @Transactional
    public Order checkout(UUID customerId) {
        logger.info("Processing checkout for customer {}", customerId);
        
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        
        Cart cart = cartRepository.findByCustomerId(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        
        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }
        }
        
        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(customer.getShippingAddress());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            
            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(orderItem.getTotalPrice());
            
            // Decrement stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);
        
        logger.info("Checkout completed successfully. Order ID: {}", savedOrder.getId());
        logger.info("Simulated email notification: Order confirmation sent to {}", customer.getEmail());
        
        return savedOrder;
    }
}
