package com.clinicSys.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.clinicSys.config.JwtUtil;
import com.clinicSys.domain.User;
import com.clinicSys.dto.LoginRequestDTO;
import com.clinicSys.dto.LoginResponseDTO;
import com.clinicSys.service.IAuthService;

@Service
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        // 1. Spring Security xác thực
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // 2. Lấy thông tin User đã được xác thực
        User userDetails = (User) authentication.getPrincipal();

        // 3. Tạo JWT Token
        String token = jwtUtil.generateToken(userDetails);

        // 4. Trả về DTO chứa token và thông tin user
        return new LoginResponseDTO(token, userDetails.getUsername(), userDetails.getRoleString());
    }
}