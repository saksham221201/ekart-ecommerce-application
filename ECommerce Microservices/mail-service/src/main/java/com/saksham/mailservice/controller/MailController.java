package com.saksham.mailservice.controller;

import com.saksham.mailservice.model.Mail;
import com.saksham.mailservice.payload.SendMailResponse;
import com.saksham.mailservice.service.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/v1/api/mail")
@CrossOrigin(origins = "http://localhost:3000")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService){
        this.mailService = mailService;
    }

    @PostMapping("/{recipientMail}")
    public ResponseEntity<SendMailResponse> sendMail(@PathVariable String recipientMail, @RequestBody Mail mail){
        mailService.sendMail(recipientMail, mail);
        SendMailResponse sendMailResponse = new SendMailResponse("Mail Sent Successfully", HttpStatus.OK.value(), LocalDateTime.now());
        return new ResponseEntity<>(sendMailResponse, HttpStatus.OK);
    }
}
