package com.bloggersworld.BWBackend.utils;

import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.entity.VerificationToken;
import com.bloggersworld.BWBackend.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthUtils {
    private final EmailService emailService;

    public AuthUtils(EmailService emailService) {
        this.emailService = emailService;
    }

    public void resendVerificationTokenMail(UserTable userTable, String applicationUrl, VerificationToken verificationToken){
        String url = applicationUrl + "/auth/verifyRegistration?token="+verificationToken.getToken();
        emailService.sendEmail(userTable.getEmail(),url);
    }

    public String passwordResetTokenMail(UserTable userTable,String applicationUrl,String token){
        String url = applicationUrl + "/auth/savePassword?token="+token;
        //sendverification email (dummy)
        log.info("Click the link to reset your password: {}",url);

        return url;
    }

    public String applicationUrl(HttpServletRequest request){
        return "http://"+
                request.getServerName()+
                ":"+request.getServerPort()+
                request.getContextPath();
    }
}
