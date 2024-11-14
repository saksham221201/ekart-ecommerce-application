package com.saksham.reviewservice.payload;

import com.saksham.reviewservice.entity.Product;
import com.saksham.reviewservice.entity.User;

import java.time.LocalDateTime;

public class ReviewDetailsResponse {
    private Long reviewId;
    private String review;
    private float rating;
    private LocalDateTime timestamp;
    private Product product;
    private User user;

    // Default Constructor
    public ReviewDetailsResponse(){
        super();
    }

    // Parameterized Constructor
    public ReviewDetailsResponse(Long reviewId, String review, float rating, LocalDateTime timestamp, Product product, User user) {
        this.reviewId = reviewId;
        this.review = review;
        this.rating = rating;
        this.timestamp = timestamp;
        this.product = product;
        this.user = user;
    }

    // Getters and Setters

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
