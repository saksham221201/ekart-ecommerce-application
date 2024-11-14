package com.saksham.reviewservice.controller;

import com.saksham.reviewservice.entity.Review;
import com.saksham.reviewservice.payload.ReviewDetailsResponse;
import com.saksham.reviewservice.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService){
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewDetailsResponse> addReview(@RequestBody Review review){
        ReviewDetailsResponse addReview = reviewService.addReview(review);
        return new ResponseEntity<>(addReview, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReviewDetailsResponse>> getAllReviews(){
        List<ReviewDetailsResponse> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewDetailsResponse>> getReviewByProductId(@PathVariable Long productId){
        List<ReviewDetailsResponse> reviews = reviewService.getByProductId(productId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDetailsResponse> updateReview(@PathVariable Long reviewId, @RequestBody Review review){
        ReviewDetailsResponse updatedReview = reviewService.updateReview(reviewId, review);
        return new ResponseEntity<>(updatedReview, HttpStatus.OK);
    }
}
