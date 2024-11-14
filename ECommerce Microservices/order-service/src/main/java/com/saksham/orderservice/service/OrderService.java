package com.saksham.orderservice.service;

import com.saksham.orderservice.entity.Order;
import com.saksham.orderservice.payload.OrderDetailsResponse;

import java.util.List;

public interface OrderService {
    OrderDetailsResponse placeOrder(Order order);
    Order cancelOrder(Long orderId);
    void updateOrderStatus(Long orderId);
    OrderDetailsResponse getOrderDetails(Long orderId);
    List<OrderDetailsResponse> getAllOrders();
    void deleteOrder(Long orderId);
}
