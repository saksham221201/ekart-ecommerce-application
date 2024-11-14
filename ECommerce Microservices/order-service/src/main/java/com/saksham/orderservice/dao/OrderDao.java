package com.saksham.orderservice.dao;

import com.saksham.orderservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderDao extends JpaRepository<Order, Long> {
    Optional<Order> findByUserId(Long userId);
}
