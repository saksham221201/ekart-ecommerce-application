package com.saksham.reviewservice.service;

import com.saksham.reviewservice.entity.Review;
import com.saksham.reviewservice.payload.ReviewDetailsResponse;

import java.util.List;

public interface ReviewService {
    ReviewDetailsResponse addReview(Review review);
    List<ReviewDetailsResponse> getAllReviews();
    List<ReviewDetailsResponse> getByProductId(Long productId);
    ReviewDetailsResponse updateReview(Long reviewId, Review review);
}
