package com.saksham.reviewservice.service.impl;

import com.saksham.reviewservice.constant.Constant;
import com.saksham.reviewservice.dao.ReviewDao;
import com.saksham.reviewservice.entity.Product;
import com.saksham.reviewservice.entity.Review;
import com.saksham.reviewservice.entity.User;
import com.saksham.reviewservice.exception.BadRequestException;
import com.saksham.reviewservice.exception.EmptyInputException;
import com.saksham.reviewservice.exception.ResourceNotFoundException;
import com.saksham.reviewservice.payload.ReviewDetailsResponse;
import com.saksham.reviewservice.service.ProductServiceClient;
import com.saksham.reviewservice.service.ReviewService;
import com.saksham.reviewservice.service.UserServiceClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewDao reviewDao;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;

    public ReviewServiceImpl(ReviewDao reviewDao, ProductServiceClient productServiceClient, UserServiceClient userServiceClient){
        this.reviewDao = reviewDao;
        this.productServiceClient = productServiceClient;
        this.userServiceClient = userServiceClient;
    }

    @Override
    public ReviewDetailsResponse addReview(Review review) {
        // Checking if any of the inputs is null
        if(review.getReview().isBlank() || review.getProductId() <= Constant.ZERO || review.getUserId() <= Constant.ZERO){
            throw new EmptyInputException("Input cannot be null!!", HttpStatus.BAD_REQUEST.value());
        }

        Product product = productServiceClient.getProductByProductId(review.getProductId());
        User user = userServiceClient.getUserById(review.getUserId());
        review.setTimestamp(LocalDateTime.now());

        reviewDao.save(review);
        return new ReviewDetailsResponse(review.getReviewId(), review.getReview(), review.getRating(), review.getTimestamp(), product, user);
    }

    @Override
    public List<ReviewDetailsResponse> getAllReviews() {
        List<ReviewDetailsResponse> reviewDetailsResponseList = new ArrayList<>();
        List<Review> reviews = reviewDao.findAll();
        for (Review review : reviews){
            Product product = productServiceClient.getProductByProductId(review.getProductId());
            User user = userServiceClient.getUserById(review.getUserId());
            ReviewDetailsResponse reviewDetailsResponse = new ReviewDetailsResponse(review.getReviewId(), review.getReview(), review.getRating(), LocalDateTime.now(), product, user);
            reviewDetailsResponseList.add(reviewDetailsResponse);
        }
        return reviewDetailsResponseList;
    }

    @Override
    @CircuitBreaker(name = "productUserBreaker", fallbackMethod = "productUserBreakerFallback")
    public List<ReviewDetailsResponse> getByProductId(Long productId) {
        List<ReviewDetailsResponse> reviewDetailsResponseList = new ArrayList<>();
        List<Review> reviews = reviewDao.findByProductId(productId);
        for (Review review : reviews){
            Product product = productServiceClient.getProductByProductId(review.getProductId());
            User user = userServiceClient.getUserById(review.getUserId());
            ReviewDetailsResponse reviewDetailsResponse = new ReviewDetailsResponse(review.getReviewId(), review.getReview(), review.getRating(), LocalDateTime.now(), product, user);
            reviewDetailsResponseList.add(reviewDetailsResponse);
        }
        return reviewDetailsResponseList;
    }

    @Override
    public ReviewDetailsResponse updateReview(Long reviewId, Review review) {
        // Checking if any of the inputs is null
        if(review.getReview().isBlank() || review.getProductId() <= Constant.ZERO || review.getUserId() <= Constant.ZERO){
            throw new EmptyInputException("Input cannot be null!!", HttpStatus.BAD_REQUEST.value());
        }

        Optional<Review> existingReview = reviewDao.findById(reviewId);
        if(existingReview.isEmpty()){
            throw new ResourceNotFoundException("Review not found with id: " + reviewId, HttpStatus.NOT_FOUND.value());
        }
        Review updatedReview = existingReview.get();
        if(!updatedReview.getUserId().equals(review.getUserId())) throw new BadRequestException("You cannot modify other's review. UserId are not matching!", HttpStatus.BAD_REQUEST.value());

        updatedReview.setReview(review.getReview());
        updatedReview.setRating(review.getRating());
        updatedReview.setTimestamp(LocalDateTime.now());

        if(!review.getProductId().equals(updatedReview.getProductId()) || !review.getUserId().equals(updatedReview.getUserId())){
            throw new BadRequestException("You cannot modify the userId or the productId", HttpStatus.BAD_REQUEST.value());
        }

        Product product = productServiceClient.getProductByProductId(review.getProductId());
        User user = userServiceClient.getUserById(review.getUserId());
        reviewDao.save(updatedReview);
        return new ReviewDetailsResponse(updatedReview.getReviewId(), updatedReview.getReview(), updatedReview.getRating(), updatedReview.getTimestamp(),product, user);
    }

    public List<ReviewDetailsResponse> productUserBreakerFallback(Long productId, Throwable throwable){
        User user = new User(0L, "dummyuser@gmail.com", "Dummy", "User", "dummy22");
        Product product = new Product(0L, "Dummy Product", "Dummy Category", "Dummy Brand", "Dummy Description", 0.0, 0.0f, List.of("Dummy URL"), List.of("Dummy URL"), "Dummy URL");
        Review review = new Review(0L, "Dummy Review", 0.0f, LocalDateTime.now(), 0L, 0L);
        ReviewDetailsResponse reviewDetailsResponse = new ReviewDetailsResponse(review.getReviewId(), review.getReview(), review.getRating(), review.getTimestamp(), product, user);
        return List.of(reviewDetailsResponse);
    }
}
