package com.saksham.productservice.service;

import com.saksham.productservice.entity.Product;
import com.saksham.productservice.payload.ProductPageInfo;

import java.util.List;

public interface ProductService {
    Product addProduct(Product product);
    Product getProductByProductId(Long productId);
    List<Product> getProductsById(List<Long> productIds);
    Product updateProductDetails(Long productId, Product product);
    List<Product> getAllProducts();
    ProductPageInfo getAllProductsWithPage(int pageNumber, int pageSize);
    List<String> getAllCategories();
    List<String> getAllBrands();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    void deleteProduct(Long productId);
}
