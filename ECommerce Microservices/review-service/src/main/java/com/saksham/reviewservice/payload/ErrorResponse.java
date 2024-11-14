package com.saksham.reviewservice.payload;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String error;
    private int code;
    private LocalDateTime timestamp;

    // Default Constructor
    public ErrorResponse(){
        super();
    }

    // Parameterized Constructor
    public ErrorResponse(String error, int code, LocalDateTime timestamp) {
        this.error = error;
        this.code = code;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
