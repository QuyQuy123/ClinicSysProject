package com.clinicSys.controller;

import com.clinicSys.dto.CreateUserDTO;
import com.clinicSys.dto.DashboardStatsDTO;
import com.clinicSys.dto.UpdateUserDTO;
import com.clinicSys.dto.UpdateUserStatusDTO;
import com.clinicSys.dto.UserDTO;
import com.clinicSys.service.IDashboardService;
import com.clinicSys.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private IUserService userService;

    @Autowired
    private IDashboardService dashboardService;

    // API để lấy thống kê dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // API để lấy danh sách Staff
    @GetMapping("/staff")
    public ResponseEntity<List<UserDTO>> getAllStaff() {
        List<UserDTO> staffList = userService.getAllStaff();
        return ResponseEntity.ok(staffList);
    }

    // API để lấy thông tin một Staff theo ID
    @GetMapping("/staff/{userId}")
    public ResponseEntity<UserDTO> getStaffById(@PathVariable int userId) {
        UserDTO staff = userService.getStaffById(userId);
        return ResponseEntity.ok(staff);
    }

    // API để tạo Staff mới
    @PostMapping("/staff")
    public ResponseEntity<UserDTO> createStaff(@RequestBody CreateUserDTO createUserDTO) {
        UserDTO newStaff = userService.createStaff(createUserDTO);
        return ResponseEntity.ok(newStaff);
    }

    // API để cập nhật thông tin Staff
    @PutMapping("/staff/{userId}")
    public ResponseEntity<UserDTO> updateStaff(
            @PathVariable int userId,
            @RequestBody UpdateUserDTO updateDTO) {
        UserDTO updatedStaff = userService.updateStaff(userId, updateDTO);
        return ResponseEntity.ok(updatedStaff);
    }

    // API để cập nhật status của Staff
    @PutMapping("/staff/{userId}/status")
    public ResponseEntity<UserDTO> updateStaffStatus(
            @PathVariable int userId,
            @RequestBody UpdateUserStatusDTO updateDTO) {
        UserDTO updatedStaff = userService.updateStaffStatus(userId, updateDTO);
        return ResponseEntity.ok(updatedStaff);
    }

    // API để reset password của Staff
    @PutMapping("/staff/{userId}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable int userId) {
        userService.resetPassword(userId);
        return ResponseEntity.ok().build();
    }
}