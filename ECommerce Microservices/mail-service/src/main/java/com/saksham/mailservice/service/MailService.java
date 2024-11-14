package com.saksham.mailservice.service;

import com.saksham.mailservice.model.Mail;

public interface MailService {
    void sendMail(String recipientMail, Mail mail);
}
