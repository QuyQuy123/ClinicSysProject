package com.clinicSys.service.impl;

import com.clinicSys.dto.DashboardStatsDTO;
import com.clinicSys.repository.IBillRepository;
import com.clinicSys.repository.IAppointmentRepository;
import com.clinicSys.repository.IPatientRepository;
import com.clinicSys.repository.IUserRepository;
import com.clinicSys.service.IDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class DashboardServiceImpl implements IDashboardService {

    @Autowired
    private IBillRepository billRepository;

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IUserRepository userRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        // Lấy thời gian hôm nay (00:00:00 đến 23:59:59)
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Lấy thời gian đầu tháng này
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();

        // Lấy thời gian 7 ngày tới
        LocalDateTime endOfNext7Days = LocalDateTime.now().plusDays(7);

        // 1. Today's Revenue - Tổng doanh thu hôm nay (chỉ tính các bill đã thanh toán)
        BigDecimal todayRevenue = billRepository.getTotalRevenueByDateRange(startOfToday, endOfToday);
        if (todayRevenue == null) {
            todayRevenue = BigDecimal.ZERO;
        }

        // 2. Patients Today - Số bệnh nhân khám hôm nay (distinct patients)
        Long patientsToday = patientRepository.countDistinctPatientsByDateRange(startOfToday, endOfToday);
        if (patientsToday == null) {
            patientsToday = 0L;
        }

        // 3. New Patients This Month - Số bệnh nhân mới trong tháng này
        Long newPatientsThisMonth = patientRepository.countNewPatientsByDateRange(startOfMonth, endOfToday);
        if (newPatientsThisMonth == null) {
            newPatientsThisMonth = 0L;
        }

        // 4. Appointments Booked - Số lịch hẹn đã đặt trong 7 ngày tới (tất cả status trừ Completed và Cancelled)
        Long appointmentsBooked = appointmentRepository.countByDateRange(LocalDateTime.now(), endOfNext7Days);
        if (appointmentsBooked == null) {
            appointmentsBooked = 0L;
        }

        // 5. Total Staff - Tổng số nhân viên
        Long totalStaff = userRepository.count();

        // 6. Total Doctors - Tổng số bác sĩ (RoleID = 2)
        Long totalDoctors = userRepository.countByRole(2);

        // 7. Total Receptionists - Tổng số lễ tân (RoleID = 3)
        Long totalReceptionists = userRepository.countByRole(3);

        // 8. Active Staff - Số nhân viên đang hoạt động
        Long activeStaff = userRepository.countByStatus("Active");

        return new DashboardStatsDTO(
            todayRevenue,
            patientsToday,
            newPatientsThisMonth,
            appointmentsBooked,
            totalStaff,
            totalDoctors,
            totalReceptionists,
            activeStaff
        );
    }
}

