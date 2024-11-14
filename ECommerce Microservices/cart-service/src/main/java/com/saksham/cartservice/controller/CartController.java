package com.saksham.cartservice.controller;

import com.saksham.cartservice.entity.Cart;
import com.saksham.cartservice.payload.CartDetailsByUserIdResponse;
import com.saksham.cartservice.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/carts")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<Cart> createCart(@PathVariable Long userId){
        Cart createdCart = cartService.createCart(userId);
        return new ResponseEntity<>(createdCart, HttpStatus.CREATED);
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long cartId, @RequestBody Cart cart){
        Cart updatedCart = cartService.updateCart(cartId, cart);
        return new ResponseEntity<>(updatedCart, HttpStatus.OK);
    }

    @PutMapping("/remove/{cartId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long cartId, @RequestBody Cart cart){
        Cart removeProduct = cartService.removeProduct(cartId, cart);
        return new ResponseEntity<>(removeProduct, HttpStatus.OK);
    }

    @PutMapping("/empty/{userId}")
    public ResponseEntity<Cart> emptyCart(@PathVariable Long userId){
        Cart cart = cartService.emptyCart(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Cart>> getAllCarts(){
        List<Cart> carts = cartService.getAllCarts();
        return new ResponseEntity<>(carts, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartDetailsByUserIdResponse> getCartByUserId(@PathVariable Long userId){
        CartDetailsByUserIdResponse cart = cartService.getCartByUserId(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }
}
