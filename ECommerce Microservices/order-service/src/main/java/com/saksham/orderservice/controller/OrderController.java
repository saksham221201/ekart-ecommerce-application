package com.saksham.orderservice.controller;

import com.saksham.orderservice.entity.Order;
import com.saksham.orderservice.payload.OrderDetailsResponse;
import com.saksham.orderservice.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrderDetailsResponse> placeOrder(@RequestBody Order order){
        OrderDetailsResponse createdOrder = orderService.placeOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/cancel/{orderId}")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId){
        Order order = orderService.cancelOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<OrderDetailsResponse>> getAllOrders(){
        List<OrderDetailsResponse> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailsResponse> getOrderDetailsByOrderId(@PathVariable Long orderId){
        OrderDetailsResponse orderDetailsResponse = orderService.getOrderDetails(orderId);
        return new ResponseEntity<>(orderDetailsResponse, HttpStatus.OK);
    }

}
