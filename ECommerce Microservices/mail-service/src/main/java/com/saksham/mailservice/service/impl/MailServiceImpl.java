package com.saksham.mailservice.service.impl;

import com.saksham.mailservice.exception.EmptyInputException;
import com.saksham.mailservice.exception.MailException;
import com.saksham.mailservice.model.Mail;
import com.saksham.mailservice.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {
    private final JavaMailSender javaMailSender;

    public MailServiceImpl(JavaMailSender javaMailSender){
        this.javaMailSender = javaMailSender;
    }

    @Value("${spring.mail.username}")
    private String fromMail;

    @Override
    public void sendMail(String recipientMail, Mail mail) {
        // Checking if any of the fields is Empty or not
        if(mail.getSubject().isBlank() || mail.getMessage().isBlank() || recipientMail.isBlank()){
            throw new EmptyInputException("Input cannot be null!!", HttpStatus.BAD_REQUEST.value());
        }
        MimeMessage message = javaMailSender.createMimeMessage();

        try{
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, "utf-8");
            mimeMessageHelper.setFrom(fromMail);
            mimeMessageHelper.setSubject(mail.getSubject());
            mimeMessageHelper.setText(mail.getMessage(), true);
            mimeMessageHelper.setTo(recipientMail);

            javaMailSender.send(message);
        } catch (MessagingException e){
            throw new MailException("Error in sending Mail", HttpStatus.BAD_REQUEST.value());
        }
    }
}
