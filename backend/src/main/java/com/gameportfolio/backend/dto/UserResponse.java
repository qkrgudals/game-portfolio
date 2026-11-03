
package com.gameportfolio.backend.dto;

import com.gameportfolio.backend.entity.User;

public class UserResponse {

    private final Long userId;
    private final String username;
    private final String email;

    public UserResponse(User user) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
