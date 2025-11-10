package com.clinicSys.service;


import com.clinicSys.dto.LoginRequestDTO;
import com.clinicSys.dto.LoginResponseDTO;

public interface IAuthService {
    LoginResponseDTO login(LoginRequestDTO request);
}