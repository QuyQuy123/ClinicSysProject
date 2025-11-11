package com.clinicSys.service.impl;

import com.clinicSys.dto.response.DashboardStatsDTO;
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
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfNext7Days = LocalDateTime.now().plusDays(7);
        BigDecimal todayRevenue = billRepository.getTotalRevenueByDateRange(startOfToday, endOfToday);
        if (todayRevenue == null) {
            todayRevenue = BigDecimal.ZERO;
        }
        Long patientsToday = patientRepository.countDistinctPatientsByDateRange(startOfToday, endOfToday);
        if (patientsToday == null) {
            patientsToday = 0L;
        }
        Long newPatientsThisMonth = patientRepository.countNewPatientsByDateRange(startOfMonth, endOfToday);
        if (newPatientsThisMonth == null) {
            newPatientsThisMonth = 0L;
        }
        Long appointmentsBooked = appointmentRepository.countByDateRange(LocalDateTime.now(), endOfNext7Days);
        if (appointmentsBooked == null) {
            appointmentsBooked = 0L;
        }
        Long totalStaff = userRepository.count();
        Long totalDoctors = userRepository.countByRole(2);
        Long totalReceptionists = userRepository.countByRole(3);
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

