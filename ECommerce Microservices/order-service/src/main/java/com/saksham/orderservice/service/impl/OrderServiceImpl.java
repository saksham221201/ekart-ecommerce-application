package com.saksham.orderservice.service.impl;

import com.saksham.orderservice.constant.Constant;
import com.saksham.orderservice.dao.OrderDao;
import com.saksham.orderservice.entity.*;
import com.saksham.orderservice.exception.BadRequestException;
import com.saksham.orderservice.exception.ResourceNotFoundException;
import com.saksham.orderservice.payload.OrderDetailsResponse;
import com.saksham.orderservice.service.CartServiceClient;
import com.saksham.orderservice.service.OrderService;
import com.saksham.orderservice.service.ProductServiceClient;
import com.saksham.orderservice.service.UserServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderDao orderDao;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;
    private final CartServiceClient cartServiceClient;

    public OrderServiceImpl(OrderDao orderDao, ProductServiceClient productServiceClient, UserServiceClient userServiceClient, CartServiceClient cartServiceClient){
        this.orderDao = orderDao;
        this.productServiceClient = productServiceClient;
        this.userServiceClient = userServiceClient;
        this.cartServiceClient = cartServiceClient;
    }

    @Override
    public OrderDetailsResponse placeOrder(Order order) {
        // Getting the Products from OpenFeign Client of all the productIds
        List<Product> products = productServiceClient.getProductsByIds(order.getProductId());

        // Checking if the userId is valid or not
        User user = userServiceClient.getUserById(order.getUserId());
        // OrderDetailsResponse existingOrder = getOrderDetails(user.getUserId());

        // Calculating total Price from all the Products
        final double total = products.stream()
                        .mapToDouble((Product::getProductPrice))
                                .sum();

        order.setTotalPrice(total);
        order.setQuantity(products.size());
        order.setOrderStatus(Constant.CREATED);
        Cart cart = cartServiceClient.emptyCart(user.getUserId());
        orderDao.save(order);
        return new OrderDetailsResponse(order.getOrderId(), order.getQuantity(), total, order.getOrderStatus(), order.getTimestamp(), products, user);
    }

    @Override
    public Order cancelOrder(Long orderId) {
        Optional<Order> optionalOrder = orderDao.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new ResourceNotFoundException("Order with orderId: " + orderId + " does not exists!", HttpStatus.NOT_FOUND.value());
        }
        Order existingOrder = optionalOrder.get();
        if(existingOrder.getOrderStatus().equalsIgnoreCase(Constant.CANCELLED)){
            throw new BadRequestException("Order is already Cancelled!", HttpStatus.BAD_REQUEST.value());
        }
        existingOrder.setOrderStatus(Constant.CANCELLED);
        return orderDao.save(existingOrder);
    }

    @Override
    public void updateOrderStatus(Long orderId) {
        Optional<Order> optionalOrder = orderDao.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new ResourceNotFoundException("Order with orderId: " + orderId + " does not exists!", HttpStatus.NOT_FOUND.value());
        }
        Order existingOrder = optionalOrder.get();
        existingOrder.setOrderStatus(Constant.COMPLETED);
        orderDao.save(existingOrder);
    }

    @Override
    @CircuitBreaker(name = "productUserBreaker", fallbackMethod = "productUserBreakerFallback")
    public OrderDetailsResponse getOrderDetails(Long orderId) {
        Optional<Order> optionalOrder = orderDao.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new ResourceNotFoundException("Order with orderId: " + orderId + " does not exists!", HttpStatus.NOT_FOUND.value());
        }
        Order order = optionalOrder.get();
        int quantity = order.getQuantity();
        double totalPrice = order.getTotalPrice();
        String orderStatus = order.getOrderStatus();
        LocalDateTime timestamp = order.getTimestamp();
        User user = userServiceClient.getUserById(order.getUserId());
        List<Product> products = productServiceClient.getProductsByIds(order.getProductId());
        return new OrderDetailsResponse(orderId, quantity, totalPrice, orderStatus, timestamp, products, user);
    }
    @Override
    @Transactional
    public List<OrderDetailsResponse> getAllOrders() {
        List<Order> orders = orderDao.findAll();
        List<OrderDetailsResponse> orderDetailsResponseList = new ArrayList<>();
        for (Order order : orders){
            Long orderId = order.getOrderId();
            int quantity = order.getQuantity();
            double totalPrice = order.getTotalPrice();
            String orderStatus = order.getOrderStatus();
            LocalDateTime timestamp = order.getTimestamp();
            User user = userServiceClient.getUserById(order.getUserId());
            List<Product> products = productServiceClient.getProductsByIds(order.getProductId());
            OrderDetailsResponse orderDetailsResponse = new OrderDetailsResponse(orderId, quantity, totalPrice, orderStatus, timestamp, products, user);
            orderDetailsResponseList.add(orderDetailsResponse);
        }
        return orderDetailsResponseList;
    }

    @Override
    public void deleteOrder(Long orderId) {
        Optional<Order> optionalOrder = orderDao.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new ResourceNotFoundException("Order with orderId: " + orderId + " does not exists!", HttpStatus.NOT_FOUND.value());
        }
        Order order = optionalOrder.get();
        orderDao.delete(order);
    }

    public OrderDetailsResponse productUserBreakerFallback(Long orderId, Throwable throwable){
        User user = new User(0L, "dummyuser@gmail.com", "Dummy", "User", "dummy22");
        Product product = new Product(0L, "Dummy Product", "Dummy Category", "Dummy Brand", "Dummy Description", 0.0, 0.0f, List.of("Dummy URL"), List.of("Dummy URL"), "Dummy URL");
        List<Long> productIds = List.of(0L);
        Order order = new Order(0L, productIds, 0L, 0, 0.0, "UNKNOWN");
        orderId = order.getOrderId();
        int quantity = order.getQuantity();
        double totalPrice = order.getTotalPrice();
        String orderStatus = order.getOrderStatus();
        LocalDateTime timestamp = order.getTimestamp();
        return new OrderDetailsResponse(orderId, quantity, totalPrice, orderStatus, timestamp, Collections.singletonList(product), user);
    }

}
