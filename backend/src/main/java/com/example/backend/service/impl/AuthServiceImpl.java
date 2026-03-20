package com.example.backend.service.impl;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.AppUser;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        AppUser user = AppUser.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        AppUser savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new User(savedUser.getEmail(), savedUser.getPassword(), List.of()));
        return buildAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        AppUser user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtService.generateToken(new User(user.getEmail(), user.getPassword(), List.of()));
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(AppUser user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
