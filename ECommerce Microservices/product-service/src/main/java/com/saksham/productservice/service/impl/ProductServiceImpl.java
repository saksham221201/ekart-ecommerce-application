package com.saksham.productservice.service.impl;

import com.saksham.productservice.constant.Constant;
import com.saksham.productservice.dao.ProductDao;
import com.saksham.productservice.entity.Product;
import com.saksham.productservice.exception.EmptyInputException;
import com.saksham.productservice.exception.ResourceNotFoundException;
import com.saksham.productservice.payload.PageInfo;
import com.saksham.productservice.payload.ProductPageInfo;
import com.saksham.productservice.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = {"products"})
public class ProductServiceImpl implements ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);
    private final ProductDao productDao;

    public ProductServiceImpl(ProductDao productDao){
        this.productDao = productDao;
    }

    @Override
    public Product addProduct(Product product) {
        // Checking if any of the inputs is null
        if(product.getProductName().isBlank() || product.getProductCategory().isBlank() || product.getProductPrice() <= Constant.ZERO || product.getProductRating() <= Constant.ZERO){
            throw new EmptyInputException("Input cannot be null!!", HttpStatus.BAD_REQUEST.value());
        }

        // Checking whether the Product already exists in the database or not, updating the quantity if it exists
        if(productDao.findByProductName(product.getProductName()).isPresent()){
            Product existingProduct = productDao.findByProductName(product.getProductName()).get();
            existingProduct.setQuantity(existingProduct.getQuantity() + product.getQuantity());
        }

        // Saving the Product
        return productDao.save(product);
    }

    @Override
    @Cacheable(value = "products", key = "#productId")
    public Product getProductByProductId(Long productId) {
        Optional<Product> existingProduct = productDao.findById(productId);
        if(existingProduct.isPresent()){
            log.info("Called");
            return existingProduct.get();
        }
        throw new ResourceNotFoundException("Product not found with id: " + productId, HttpStatus.NOT_FOUND.value());
    }

    @Override
    public List<Product> getProductsById(List<Long> productIds) {
        List<Product> products = productDao.findByProductIdIn(productIds);

        // Checking if all the productIds were present in the database
        List<Long> foundProductIds = products.stream()
                .map(Product::getProductId)
                .toList();
        List<Long> notFoundProductIds = productIds.stream()
                .filter(id -> !foundProductIds.contains(id))
                .toList();
        if(!notFoundProductIds.isEmpty()){
            throw new ResourceNotFoundException("Products with the following Ids not found: " + notFoundProductIds, HttpStatus.NOT_FOUND.value());
        }
        return products;
    }

    @Override
    @CachePut(value="products", key="#productId")
    public Product updateProductDetails(Long productId, Product product) {
        // Checking if any of the inputs is null
        if(product.getProductName().isBlank() || product.getProductCategory().isBlank() || product.getProductPrice() <= 0){
            throw new EmptyInputException("Input cannot be null", HttpStatus.BAD_REQUEST.value());
        }

        Optional<Product> existingProduct = productDao.findById(productId);
        if(existingProduct.isEmpty()){
            throw new ResourceNotFoundException("Product not found with id: " + productId, HttpStatus.NOT_FOUND.value());
        }

        Product updateProduct = existingProduct.get();
        updateProduct.setProductCategory(product.getProductCategory());
        updateProduct.setProductName(product.getProductName());
        updateProduct.setProductBrand(product.getProductBrand());
        updateProduct.setDescription(product.getDescription());
        updateProduct.setProductPrice(product.getProductPrice());
        updateProduct.setProductRating(product.getProductRating());
        updateProduct.setQuantity(product.getQuantity());
        updateProduct.setImageUrl(product.getImageUrl());
        updateProduct.setBannerImageUrl(product.getBannerImageUrl());
        updateProduct.setVideoUrl(product.getVideoUrl());
        return productDao.save(updateProduct);
    }

    @Override
    public List<Product> getAllProducts() {
        return productDao.findAll();
    }

    @Override
    public ProductPageInfo getAllProductsWithPage(int pageNumber, int pageSize) {
        Pageable p = PageRequest.of(pageNumber, pageSize);
        Page<Product> pageProduct = this.productDao.findAll(p);

        PageInfo pageInfo = new PageInfo(pageProduct.hasNext(), pageProduct.hasPrevious(), (int) pageProduct.getTotalElements());
        return new ProductPageInfo(pageProduct.getContent(), pageInfo);
    }

    @Override
    public List<String> getAllCategories() {
        return productDao.findAll().stream()
                .map(Product::getProductCategory)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllBrands() {
        return productDao.findAll().stream()
                .map(Product::getProductBrand)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        List<String> categories = getAllCategories();
        if(categories.stream().anyMatch((category::equals))){
            return productDao.findByProductCategory(category);
        }
        throw new ResourceNotFoundException("Category " + category + " not found!", HttpStatus.NOT_FOUND.value());
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return getAllBrands().stream()
                .filter(brand::equals)
                .findFirst()
                .map(productDao::findByProductBrand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand " + brand + " not found!", HttpStatus.NOT_FOUND.value()));
    }

    @Override
    @CacheEvict(value="products", key="#productId")
    public void deleteProduct(Long productId) {
        Optional<Product> existingProduct = productDao.findById(productId);
        if(existingProduct.isEmpty()){
            throw new ResourceNotFoundException("Product not found with id: " + productId, HttpStatus.NOT_FOUND.value());
        }
        productDao.deleteById(productId);
    }
}
