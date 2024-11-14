package com.saksham.orderservice.dao;

import com.saksham.orderservice.entity.OrderProductId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductIdDao extends JpaRepository<OrderProductId, Long> {
    OrderProductId findByOrderId(Long orderId);
}
