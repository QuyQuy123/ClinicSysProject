package com.clinicSys.service;


import com.clinicSys.dto.request.LoginRequestDTO;
import com.clinicSys.dto.response.LoginResponseDTO;

public interface IAuthService {
    LoginResponseDTO login(LoginRequestDTO request);
}