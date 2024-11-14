package com.saksham.orderservice.service;

import com.saksham.orderservice.entity.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserServiceClient {

    @GetMapping("/v1/api/users/{userId}")
    User getUserById(@PathVariable Long userId);
}
