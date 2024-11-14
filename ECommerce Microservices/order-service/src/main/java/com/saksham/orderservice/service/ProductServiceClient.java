package com.saksham.orderservice.service;

import com.saksham.orderservice.entity.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductServiceClient {

    @PostMapping("/v1/api/products/search")
    List<Product> getProductsByIds(@RequestBody List<Long> productIds);
}
