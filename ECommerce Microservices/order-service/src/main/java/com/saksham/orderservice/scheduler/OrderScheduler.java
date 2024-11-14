package com.saksham.orderservice.scheduler;

import com.saksham.orderservice.constant.Constant;
import com.saksham.orderservice.payload.OrderDetailsResponse;
import com.saksham.orderservice.service.OrderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class OrderScheduler {
    private final OrderService orderService;

    public OrderScheduler(OrderService orderService){
        this.orderService = orderService;
    }

    @Scheduled(cron = "0 */1 * * * *") // It is scheduled to run every 1 minute but for 10 minutes its ("0 */10 * * * *")
    // Completing the Order after 24 Hours but checking the difference of NOW and OrderTimestamp
    public void completeOrder(){
        List<OrderDetailsResponse> orders = orderService.getAllOrders();
        orders.forEach(order -> {
            LocalDateTime time = LocalDateTime.now();
            long difference = order.getTimestamp().until(time, ChronoUnit.HOURS);
            System.out.println("Difference: " + difference);
            float fraction = (float) difference / 24;
            System.out.println("Percentage: " + fraction * 100);
            if (difference >= Constant.ONE_DAY_IN_HOURS && !Constant.CANCELLED.equals(order.getOrderStatus())) {
                orderService.updateOrderStatus(order.getOrderId());
            }
        });
    }

    @Scheduled(cron = "0 */30 * * * *") // It is scheduled to run every 1 minute but for 20 minutes its ("0 */20 * * * *")
    // Deleting the Order after 48 Hours but checking the difference of NOW and OrderTimestamp
    public void deleteOrder(){
        List<OrderDetailsResponse> orders = orderService.getAllOrders();
        orders.forEach(order -> {
            LocalDateTime time = LocalDateTime.now();
            long difference = order.getTimestamp().until(time, ChronoUnit.HOURS);
            if (difference >= Constant.TWO_DAYS_IN_HOURS && Constant.CANCELLED.equals(order.getOrderStatus())) {
                orderService.deleteOrder(order.getOrderId());
            }
        });
    }
}
