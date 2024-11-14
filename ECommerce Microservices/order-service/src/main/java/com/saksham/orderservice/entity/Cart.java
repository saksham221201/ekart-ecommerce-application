package com.saksham.orderservice.entity;

import java.util.List;

public class Cart {

    private Long cartId;
    private Long userId;
    private List<Long> productId;

    // Default Constructor
    public Cart(){
        super();
    }

    public Cart(Long userId, List<Long> productId){
        this.userId = userId;
        this.productId = productId;
    }

    // Parametrized Constructor
    public Cart(Long cartId, Long userId, List<Long> productId) {
        this.cartId = cartId;
        this.userId = userId;
        this.productId = productId;
    }

    // Getters and Setters
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getProductId() {
        return productId;
    }

    public void setProductId(List<Long> productId) {
        this.productId = productId;
    }
}
