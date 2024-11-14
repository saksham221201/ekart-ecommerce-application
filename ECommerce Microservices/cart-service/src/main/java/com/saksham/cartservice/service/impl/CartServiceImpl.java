package com.saksham.cartservice.service.impl;

import com.saksham.cartservice.dao.CartDao;
import com.saksham.cartservice.entity.Cart;
import com.saksham.cartservice.entity.Product;
import com.saksham.cartservice.entity.User;
import com.saksham.cartservice.exception.BadRequestException;
import com.saksham.cartservice.exception.DuplicateEntryException;
import com.saksham.cartservice.exception.ResourceNotFoundException;
import com.saksham.cartservice.payload.CartDetailsByUserIdResponse;
import com.saksham.cartservice.service.CartService;
import com.saksham.cartservice.service.ProductServiceClient;
import com.saksham.cartservice.service.UserServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartDao cartDao;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;

    public CartServiceImpl(CartDao cartDao, ProductServiceClient productServiceClient, UserServiceClient userServiceClient){
        this.cartDao = cartDao;
        this.productServiceClient = productServiceClient;
        this.userServiceClient = userServiceClient;
    }

    @Override
    public Cart createCart(Long userId) {
        Optional<Cart> optionalCart = cartDao.findByUserId(userId);
        if(optionalCart.isPresent()){
            throw new DuplicateEntryException("Cart already exists!", HttpStatus.BAD_REQUEST.value());
        }
        // Checking if the userId is valid or not
        User user = userServiceClient.getUserById(userId);

        Cart cart = new Cart(userId, new ArrayList<>());
        return cartDao.save(cart);
    }

    @Override
    public Cart updateCart(Long cartId, Cart cart) {
        Optional<Cart> existingCart = cartDao.findById(cartId);
        if(existingCart.isEmpty()){
            throw new ResourceNotFoundException("Cart not found with id: " + cartId, HttpStatus.NOT_FOUND.value());
        }
        Cart updateCart = existingCart.get();

        List<Long> existingProductId = updateCart.getProductId();
        List<Long> newProductId = cart.getProductId();

        // Checking if any new ProductId is already present in the Cart
        for (Long productId : newProductId) {
            if(existingProductId.contains(productId)){
                throw new BadRequestException("Product with Id: " + productId + " already exists in the Cart", HttpStatus.BAD_REQUEST.value());
            }
        }
        existingProductId.addAll(newProductId);

        updateCart.setProductId(existingProductId);
        return cartDao.save(updateCart);
    }

    @Override
    public Cart removeProduct(Long cartId, Cart cart) {
        Optional<Cart> existingCart = cartDao.findById(cartId);
        if(existingCart.isEmpty()){
            throw new ResourceNotFoundException("Cart not found with id: " + cartId, HttpStatus.NOT_FOUND.value());
        }
        Cart removeFromCart = existingCart.get();
        List<Long> existingProductId = removeFromCart.getProductId();
        List<Long> newProductId = cart.getProductId();

        // Checking if any new ProductId is already present in the Cart
        for (Long productId : newProductId) {
            if(!existingProductId.contains(productId)){
                throw new BadRequestException("Product with Id: " + productId + " not found in the Cart", HttpStatus.BAD_REQUEST.value());
            }
        }
        existingProductId.removeAll(newProductId);
        return cartDao.save(removeFromCart);
    }

    @Override
    public Cart emptyCart(Long userId) {
        Optional<Cart> existingCart = cartDao.findByUserId(userId);
        if(existingCart.isEmpty()){
            throw new ResourceNotFoundException("Cart not found with userId: " + userId, HttpStatus.NOT_FOUND.value());
        }
        Cart cart = existingCart.get();
        cart.setProductId(new ArrayList<>());
        return cartDao.save(cart);
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartDao.findAll();
    }

    @Override
    @CircuitBreaker(name = "cartDetailsBreaker", fallbackMethod = "cartDetailsBreakerFallback")
    public CartDetailsByUserIdResponse getCartByUserId(Long userId) {
        Optional<Cart> existingCart = cartDao.findByUserId(userId);
        if(existingCart.isEmpty()){
            throw new ResourceNotFoundException("Cart not found with userId: " + userId, HttpStatus.NOT_FOUND.value());
        }
        Cart cart = existingCart.get();
        List<Long> productIds = cart.getProductId();
        List<Product> products = productServiceClient.getProductsByIds(productIds);
        User user = userServiceClient.getUserById(userId);
        return new CartDetailsByUserIdResponse(cart.getCartId(), user, products);
    }

    public CartDetailsByUserIdResponse cartDetailsBreakerFallback(Long userId, Throwable throwable){
        Long carId = 0L;
        User user = new User(0L, "dummyuser@gmail.com", "Dummy", "User", "dummy22");
        List<Product> products = List.of(new Product(0L, "Dummy Product", "Dummy Category", "Dummy Brand", "Dummy Description", 0.0, 0.0f, List.of("Dummy URL"), List.of("Dummy URL"), "Dummy URL"));
        return new CartDetailsByUserIdResponse(carId, user, products);
    }
}
