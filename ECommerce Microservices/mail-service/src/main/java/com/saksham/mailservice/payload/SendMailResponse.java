package com.saksham.mailservice.payload;

import java.time.LocalDateTime;

public class SendMailResponse {
    private String message;
    private int code;
    private LocalDateTime timestamp;

    // Default Constructor
    public SendMailResponse(){
        super();
    }

    // Parametrized Constructor
    public SendMailResponse(String message, int code, LocalDateTime timestamp) {
        this.message = message;
        this.code = code;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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
