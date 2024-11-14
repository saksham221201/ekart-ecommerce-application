package com.saksham.orderservice.payload;

import com.saksham.orderservice.entity.Product;
import com.saksham.orderservice.entity.User;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDetailsResponse {
    private Long orderId;
    private int quantity;
    private double totalPrice;
    private String orderStatus;
    private LocalDateTime timestamp;
    private List<Product> products;
    private User user;

    // Default Constructor
    public OrderDetailsResponse(){
        super();
    }

    // Parameterized Constructor
    public OrderDetailsResponse(Long orderId, int quantity, double totalPrice, String orderStatus, LocalDateTime timestamp, List<Product> products, User user) {
        this.orderId = orderId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.timestamp = timestamp;
        this.products = products;
        this.user = user;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
