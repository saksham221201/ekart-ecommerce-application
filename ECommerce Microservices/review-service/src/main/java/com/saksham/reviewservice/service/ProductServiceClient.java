package com.saksham.reviewservice.service;

import com.saksham.reviewservice.entity.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductServiceClient {

    @GetMapping("/v1/api/products/{productId}")
    Product getProductByProductId(@PathVariable Long productId);
}
