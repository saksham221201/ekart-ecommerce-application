package com.saksham.productservice.dao;

import com.saksham.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDao extends JpaRepository<Product, Long> {
    Optional<Product> findByProductName(String productName);
    List<Product> findByProductIdIn(List<Long> productIds);
    List<Product> findByProductCategory(String category);
    List<Product> findByProductBrand(String brand);
}
