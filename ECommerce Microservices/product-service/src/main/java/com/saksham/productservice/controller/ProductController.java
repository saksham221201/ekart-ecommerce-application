package com.saksham.productservice.controller;

import com.saksham.productservice.entity.Product;
import com.saksham.productservice.payload.ProductPageInfo;
import com.saksham.productservice.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        Product addedProduct = productService.addProduct(product);
        return new ResponseEntity<>(addedProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/pagination")
    public ResponseEntity<ProductPageInfo> getAllProductsWithPage(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber, @RequestParam(value = "pageSize", defaultValue = "6", required = false) int pageSize){
        ProductPageInfo products = productService.getAllProductsWithPage(pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId){
        Product product = productService.getProductByProductId(productId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProductDetails(@PathVariable Long productId, @RequestBody Product product){
        Product updatedProduct = productService.updateProductDetails(productId, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProductById(@PathVariable Long productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/search")
    public List<Product> getProductsByIds(@RequestBody List<Long> productIds){
        List<Product> products = productService.getProductsById(productIds);
        return new ResponseEntity<>(products, HttpStatus.OK).getBody();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories(){
        List<String> categories = productService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands(){
        List<String> brands = productService.getAllBrands();
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category){
        List<Product> products = productService.getProductsByCategory(category);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<Product>> getProductsByBrand(@PathVariable String brand){
        List<Product> products = productService.getProductsByBrand(brand);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
