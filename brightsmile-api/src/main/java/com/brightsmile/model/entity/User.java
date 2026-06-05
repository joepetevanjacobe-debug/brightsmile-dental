package com.brightsmile.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Constructors ──────────────────────────────────────────────────────────

    public User() {}

    public User(Long id, String name, String email, String passwordHash, String phone,
                Role role, boolean verified, String verificationToken, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.role = role;
        this.verified = verified;
        this.verificationToken = verificationToken;
        this.createdAt = createdAt;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public String getEmail()             { return email; }
    public String getPasswordHash()      { return passwordHash; }
    public String getPhone()             { return phone; }
    public Role getRole()                { return role; }
    public boolean isVerified()          { return verified; }
    public String getVerificationToken() { return verificationToken; }
    public LocalDateTime getCreatedAt()  { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setId(Long id)                              { this.id = id; }
    public void setName(String name)                        { this.name = name; }
    public void setEmail(String email)                      { this.email = email; }
    public void setPasswordHash(String passwordHash)        { this.passwordHash = passwordHash; }
    public void setPhone(String phone)                      { this.phone = phone; }
    public void setRole(Role role)                          { this.role = role; }
    public void setVerified(boolean verified)               { this.verified = verified; }
    public void setVerificationToken(String token)          { this.verificationToken = token; }

    // ── Builder ───────────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String passwordHash;
        private String phone;
        private Role role;
        private boolean verified = false;
        private String verificationToken;
        private LocalDateTime createdAt;

        public Builder id(Long id)                         { this.id = id; return this; }
        public Builder name(String name)                   { this.name = name; return this; }
        public Builder email(String email)                 { this.email = email; return this; }
        public Builder passwordHash(String h)              { this.passwordHash = h; return this; }
        public Builder phone(String phone)                 { this.phone = phone; return this; }
        public Builder role(Role role)                     { this.role = role; return this; }
        public Builder verified(boolean verified)          { this.verified = verified; return this; }
        public Builder verificationToken(String token)     { this.verificationToken = token; return this; }

        public User build() {
            return new User(id, name, email, passwordHash, phone,
                            role, verified, verificationToken, createdAt);
        }
    }

    // ── equals / hashCode / toString ─────────────────────────────────────────

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() { return Objects.hashCode(id); }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "', role=" + role + "}";
    }

    // ── Role enum ─────────────────────────────────────────────────────────────

    public enum Role {
        ADMIN, RECEPTIONIST, DOCTOR, PATIENT
    }
}
