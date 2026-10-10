package com.apex.gstsuite.dto;

import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.model.entity.User;

public class AuthResponseDto {

    private String token;
    private User user;
    private Company store;
    private String message;

    public AuthResponseDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AuthResponseDto dto = new AuthResponseDto();

        public Builder token(String token) { dto.token = token; return this; }
        public Builder user(User user) { dto.user = user; return this; }
        public Builder store(Company store) { dto.store = store; return this; }
        public Builder message(String message) { dto.message = message; return this; }
        public AuthResponseDto build() { return dto; }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Company getStore() { return store; }
    public void setStore(Company store) { this.store = store; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
