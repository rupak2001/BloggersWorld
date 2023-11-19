package com.bloggersworld.BWBackend.event;

import com.bloggersworld.BWBackend.entity.UserTable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;


@Getter
@Setter
public class RegistrationEvent extends ApplicationEvent {
    private UserTable user;
    private String applicationUrl;

    public RegistrationEvent(UserTable user,String applicationUrl){
        super(user);
        this.user = user;
        this.applicationUrl = applicationUrl;
    }
}