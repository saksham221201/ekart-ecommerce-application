package com.saksham.productservice.payload;

import com.saksham.productservice.entity.Product;

import java.util.List;

public class ProductPageInfo {
    private List<Product> products;
    private PageInfo pageInfo;

    public ProductPageInfo(List<Product> products, PageInfo pageInfo) {
        this.products = products;
        this.pageInfo = pageInfo;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public PageInfo getPageInfo() {
        return pageInfo;
    }

    public void setPageInfo(PageInfo pageInfo) {
        this.pageInfo = pageInfo;
    }
}
