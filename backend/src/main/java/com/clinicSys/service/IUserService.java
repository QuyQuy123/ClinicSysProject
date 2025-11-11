package com.clinicSys.service;

import com.clinicSys.dto.request.CreateUserDTO;
import com.clinicSys.dto.request.UpdateUserDTO;
import com.clinicSys.dto.request.UpdateUserStatusDTO;
import com.clinicSys.dto.response.UserDTO;
import java.util.List;

public interface IUserService {
    List<UserDTO> getAllStaff();
    UserDTO getStaffById(int userId);
    UserDTO createStaff(CreateUserDTO userDTO);
    UserDTO updateStaff(int userId, UpdateUserDTO updateDTO);
    UserDTO updateStaffStatus(int userId, UpdateUserStatusDTO updateDTO);
    void resetPassword(int userId);

}