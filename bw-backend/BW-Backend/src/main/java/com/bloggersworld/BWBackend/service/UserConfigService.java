package com.bloggersworld.BWBackend.service;

import com.bloggersworld.BWBackend.config.UserDetailsConfig;
import com.bloggersworld.BWBackend.entity.UserTable;
import com.bloggersworld.BWBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserConfigService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    public UserConfigService() {
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserTable> userTable = Optional.ofNullable(userRepository.findByEmail(email));
        return  userTable.map(UserDetailsConfig::new)
                .orElseThrow(()->new UsernameNotFoundException("User Not Found"));
    }
}
