package com.brightsmile.model.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank
    private String name;

    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 8)
    private String password;

    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Invalid phone number")
    private String phone;

    public RegisterRequest() {}

    public String getName()              { return name; }
    public void   setName(String name)   { this.name = name; }

    public String getEmail()             { return email; }
    public void   setEmail(String email) { this.email = email; }

    public String getPassword()                { return password; }
    public void   setPassword(String password) { this.password = password; }

    public String getPhone()             { return phone; }
    public void   setPhone(String phone) { this.phone = phone; }
}
