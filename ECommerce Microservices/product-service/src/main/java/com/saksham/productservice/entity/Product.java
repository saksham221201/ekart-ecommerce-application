package com.saksham.productservice.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String productName;
    private String productCategory;
    private String productBrand;
    @Column(columnDefinition = "TEXT", length = 1000)
    private String description;
    private double productPrice;
    private float productRating;
    @ElementCollection
    @CollectionTable(name = "product_image_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrl;
    @ElementCollection
    @CollectionTable(name = "banner_image_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> bannerImageUrl;
    private String videoUrl;

    // Default Constructor
    public Product(){
        super();
    }

    // Parameterized Constructor
    public Product(Long productId, String productName, String productCategory, String productBrand, String description, double productPrice, float productRating, List<String> imageUrl, List<String> bannerImageUrl, String videoUrl) {
        this.productId = productId;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productBrand = productBrand;
        this.description = description;
        this.productPrice = productPrice;
        this.productRating = productRating;
        this.imageUrl = imageUrl;
        this.bannerImageUrl = bannerImageUrl;
        this.videoUrl = videoUrl;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public void setProductBrand(String productBrand) {
        this.productBrand = productBrand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
    }

    public float getProductRating() {
        return productRating;
    }

    public void setProductRating(float productRating) {
        this.productRating = productRating;
    }

    public List<String> getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(List<String> imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(List<String> bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}