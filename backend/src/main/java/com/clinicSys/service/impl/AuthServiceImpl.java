package com.clinicSys.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.clinicSys.config.JwtUtil;
import com.clinicSys.domain.User;
import com.clinicSys.dto.request.LoginRequestDTO;
import com.clinicSys.dto.response.LoginResponseDTO;
import com.clinicSys.service.IAuthService;

@Service
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        User userDetails = (User) authentication.getPrincipal();

        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponseDTO(token, userDetails.getUsername(), userDetails.getRoleString());
    }
}