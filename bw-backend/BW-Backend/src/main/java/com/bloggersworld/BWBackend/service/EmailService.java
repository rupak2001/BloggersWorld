package com.bloggersworld.BWBackend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender sender;

    public EmailService(JavaMailSender sender) {
        this.sender = sender;
    }
    public void sendEmail(String receiver,String url){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("BloggersWorld User Verification");
        message.setFrom("noreply@bloggersworld.com");
        message.setTo(receiver);
        message.setText("Click on this link to verify your profile\n"+url+"\n This link will be valid for 10 minutes");
        sender.send(message);
    }
}
