package com.saksham.mailservice.model;

public class Mail {
    private String subject;
    private String message;

    //Default Constructor
    public Mail(){
        super();
    }

    // Parametrized Constructor
    public Mail(String subject, String message) {
        this.subject = subject;
        this.message = message;
    }

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
