package com.saksham.orderservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_product_ids")
public class OrderProductId {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderProductId;
    @Column(name = "order_id")
    private Long orderId;
    @Column(name = "product_id")
    private Long productId;

    public OrderProductId(){
        super();
    }

    public OrderProductId(Long orderProductId, Long orderId, Long productId) {
        this.orderProductId = orderProductId;
        this.orderId = orderId;
        this.productId = productId;
    }

    public Long getOrderProductId() {
        return orderProductId;
    }

    public void setOrderProductId(Long orderProductId) {
        this.orderProductId = orderProductId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
