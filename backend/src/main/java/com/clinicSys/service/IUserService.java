package com.clinicSys.service;

import com.clinicSys.dto.CreateUserDTO;
import com.clinicSys.dto.UpdateUserDTO;
import com.clinicSys.dto.UpdateUserStatusDTO;
import com.clinicSys.dto.UserDTO;
import java.util.List;

public interface IUserService {
    List<UserDTO> getAllStaff();
    UserDTO getStaffById(int userId);
    UserDTO createStaff(CreateUserDTO userDTO);
    UserDTO updateStaff(int userId, UpdateUserDTO updateDTO);
    UserDTO updateStaffStatus(int userId, UpdateUserStatusDTO updateDTO);
    void resetPassword(int userId);
    // (Chúng ta sẽ làm Delete sau)
}