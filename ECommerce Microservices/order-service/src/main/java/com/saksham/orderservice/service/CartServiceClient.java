package com.saksham.orderservice.service;

import com.saksham.orderservice.entity.Cart;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "CART-SERVICE")
public interface CartServiceClient {

    @PutMapping("/v1/api/carts/empty/{userId}")
    Cart emptyCart(@PathVariable Long userId);
}
