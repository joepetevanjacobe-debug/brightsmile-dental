package com.brightsmile.service;

import com.brightsmile.model.dto.AuthResponse;
import com.brightsmile.model.dto.LoginRequest;
import com.brightsmile.model.dto.RegisterRequest;
import com.brightsmile.model.entity.User;
import com.brightsmile.repository.UserRepository;
import com.brightsmile.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository         userRepository;
    @Mock PasswordEncoder        passwordEncoder;
    @Mock JwtUtil                jwtUtil;
    @Mock AuthenticationManager  authenticationManager;
    @Mock UserDetailsService     userDetailsService;
    @Mock EmailService           emailService;

    @InjectMocks AuthService authService;

    private User patientUser;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        patientUser = User.builder()
                .id(1L)
                .name("Jane Doe")
                .email("jane@test.com")
                .passwordHash("$2a$12$hashed")
                .role(User.Role.PATIENT)
                .verified(false)
                .build();

        userDetails = new org.springframework.security.core.userdetails.User(
                "jane@test.com", "$2a$12$hashed",
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PATIENT"))
        );
    }

    @Test
    void register_savesUserAndSendsVerificationEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Jane Doe");
        req.setEmail("jane@test.com");
        req.setPassword("password123");
        req.setPhone("5551234567");

        when(userRepository.existsByEmail("jane@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$12$hashed");
        when(userRepository.save(any())).thenReturn(patientUser);

        authService.register(req);

        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail(eq("jane@test.com"), eq("Jane Doe"), anyString());
    }

    @Test
    void register_throwsWhenEmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Jane Doe");
        req.setEmail("jane@test.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("jane@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_returnsAuthResponseWithToken() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jane@test.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("jane@test.com")).thenReturn(Optional.of(patientUser));
        when(userDetailsService.loadUserByUsername("jane@test.com")).thenReturn(userDetails);
        when(jwtUtil.generateAccessToken(userDetails)).thenReturn("access-token-xyz");

        AuthResponse resp = authService.login(req);

        assertThat(resp.getAccessToken()).isEqualTo("access-token-xyz");
        assertThat(resp.getEmail()).isEqualTo("jane@test.com");
        assertThat(resp.getRole()).isEqualTo("PATIENT");
    }

    @Test
    void login_throwsBadCredentialsOnWrongPassword() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jane@test.com");
        req.setPassword("wrong");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void verifyEmail_setsVerifiedAndClearsToken() {
        patientUser.setVerificationToken("token-abc");
        when(userRepository.findByVerificationToken("token-abc"))
                .thenReturn(Optional.of(patientUser));
        when(userRepository.save(any())).thenReturn(patientUser);

        authService.verifyEmail("token-abc");

        assertThat(patientUser.isVerified()).isTrue();
        assertThat(patientUser.getVerificationToken()).isNull();
    }

    @Test
    void verifyEmail_throwsOnInvalidToken() {
        when(userRepository.findByVerificationToken("bad-token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.verifyEmail("bad-token"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid verification token");
    }
}
