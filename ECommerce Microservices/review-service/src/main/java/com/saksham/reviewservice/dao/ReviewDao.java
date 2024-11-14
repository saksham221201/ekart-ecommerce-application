package com.saksham.reviewservice.dao;

import com.saksham.reviewservice.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewDao extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
}
