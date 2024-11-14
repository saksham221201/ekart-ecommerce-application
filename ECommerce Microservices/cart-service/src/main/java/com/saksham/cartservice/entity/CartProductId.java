package com.saksham.cartservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_product_ids")
public class CartProductId {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartProductId;
    @Column(name = "cart_id")
    private Long cartId;
    @Column(name = "product_id")
    private Long productId;

    // Default Constructor
    public CartProductId(){
        super();
    }

    // Parametrized Constructor
    public CartProductId(Long cartProductId, Long cartId, Long productId) {
        this.cartProductId = cartProductId;
        this.cartId = cartId;
        this.productId = productId;
    }

    // Getters and Setters
    public Long getCartProductId() {
        return cartProductId;
    }

    public void setCartProductId(Long cartProductId) {
        this.cartProductId = cartProductId;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
