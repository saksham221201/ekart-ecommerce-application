package com.saksham.productservice.payload;

public record PageInfo(boolean hasNextPage, boolean hasPreviousPage, int total) {
}
