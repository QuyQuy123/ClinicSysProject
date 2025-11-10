package com.clinicSys.dto;

// Dùng record cho ngắn gọn, hoặc tạo class POJO bình thường
public record LoginRequestDTO(String username, String password) {}