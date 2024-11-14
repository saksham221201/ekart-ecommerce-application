package com.saksham.cartservice.payload;

import com.saksham.cartservice.entity.Product;
import com.saksham.cartservice.entity.User;

import java.util.List;

public class CartDetailsByUserIdResponse {
    private Long cartId;
    private User user;
    private List<Product> products;

    // Default Constructor
    public CartDetailsByUserIdResponse(){
        super();
    }

    // Parametrized Constructor
    public CartDetailsByUserIdResponse(Long cartId, User user, List<Product> products) {
        this.cartId = cartId;
        this.user = user;
        this.products = products;
    }

    // Getters and Setters
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
