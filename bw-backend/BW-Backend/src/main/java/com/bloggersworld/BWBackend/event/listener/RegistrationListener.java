package com.bloggersworld.BWBackend.event.listener;

import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.event.RegistrationEvent;
import com.bloggersworld.BWBackend.service.EmailService;
import com.bloggersworld.BWBackend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j //logger
public class RegistrationListener implements ApplicationListener<RegistrationEvent> {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Override
    public void onApplicationEvent(RegistrationEvent event) {
        //Create the verification token for the user with link
        UserTable user = event.getUser();
        String token = UUID.randomUUID().toString();
        userService.saveVerificationTokenForUser(token,user);
        //Send mail to user
        String url = event.getApplicationUrl() + "/auth/verifyRegistration?token="+token;

        emailService.sendEmail(user.getEmail(),url);
    }

}