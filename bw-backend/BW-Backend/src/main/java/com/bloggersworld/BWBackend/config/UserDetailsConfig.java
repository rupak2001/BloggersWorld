package com.bloggersworld.BWBackend.config;

import com.bloggersworld.BWBackend.entity.UserTable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


public class UserDetailsConfig implements UserDetails {
    private final String email;
    private final String password;
    private final List<GrantedAuthority> authorities;
    private final boolean isEnabled;

    public UserDetailsConfig(UserTable userTable){
        this.email = userTable.getEmail();
        this.password = userTable.getPassword();
        this.authorities = Arrays.stream(userTable.getRole().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        this.isEnabled = userTable.isActivated();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.isEnabled;
    }
}
