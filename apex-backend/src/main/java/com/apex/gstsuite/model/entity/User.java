package com.apex.gstsuite.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String passwordHash;

    @JsonIgnore
    @Column(nullable = false)
    private String salt;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 150)
    private String fullName;

    private String phone;

    @Column(nullable = false, length = 50)
    private String role = "ADMIN";

    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public User() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final User user = new User();

        public Builder id(UUID id) { user.id = id; return this; }
        public Builder company(Company company) { user.company = company; return this; }
        public Builder email(String email) { user.email = email; return this; }
        public Builder passwordHash(String hash) { user.passwordHash = hash; return this; }
        public Builder salt(String salt) { user.salt = salt; return this; }
        public Builder fullName(String name) { user.fullName = name; return this; }
        public Builder phone(String phone) { user.phone = phone; return this; }
        public Builder role(String role) { user.role = role; return this; }
        public Builder isActive(Boolean active) { user.isActive = active; return this; }
        public User build() { return user; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getSalt() { return salt; }
    public void setSalt(String salt) { this.salt = salt; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
