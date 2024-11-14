package com.saksham.cartservice.service;

import com.saksham.cartservice.entity.Cart;
import com.saksham.cartservice.payload.CartDetailsByUserIdResponse;

import java.util.List;

public interface CartService {
    Cart createCart(Long userId);
    Cart updateCart(Long cartId, Cart cart);
    Cart removeProduct(Long cartId, Cart cart);
    Cart emptyCart(Long userId);
    List<Cart> getAllCarts();
    CartDetailsByUserIdResponse getCartByUserId(Long userId);
}
