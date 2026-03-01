package com.clinicSys.service.impl;

import com.clinicSys.domain.Appointment;
import com.clinicSys.domain.Diagnosis;
import com.clinicSys.domain.ICD10Code;
import com.clinicSys.domain.MedicalRecord;
import com.clinicSys.domain.Patient;
import com.clinicSys.domain.Prescription;
import com.clinicSys.domain.PrescriptionMedicine;
import com.clinicSys.domain.Medicine;
import com.clinicSys.domain.User;
import com.clinicSys.domain.Bill;
import com.clinicSys.dto.request.CreateAppointmentDTO;
import com.clinicSys.dto.response.AppointmentDetailsDTO;
import com.clinicSys.dto.response.AppointmentWithDoctorDTO;
import com.clinicSys.dto.response.BillingDetailsDTO;
import com.clinicSys.dto.response.BillingPrescriptionItemDTO;
import com.clinicSys.dto.response.PaidBillDetailDTO;
import com.clinicSys.dto.response.PaidBillSummaryDTO;
import com.clinicSys.dto.response.PatientDTO;
import com.clinicSys.dto.response.ReceptionistDashboardDTO;
import com.clinicSys.dto.response.ServiceDTO;
import com.clinicSys.dto.response.UserDTO;
import com.clinicSys.repository.IAppointmentRepository;
import com.clinicSys.repository.IBillRepository;
import com.clinicSys.repository.IDiagnosisRepository;
import com.clinicSys.repository.IICD10CodeRepository;
import com.clinicSys.repository.IMedicalRecordRepository;
import com.clinicSys.repository.IMedicineRepository;
import com.clinicSys.repository.IPatientRepository;
import com.clinicSys.repository.IPrescriptionMedicineRepository;
import com.clinicSys.repository.IPrescriptionRepository;
import com.clinicSys.repository.IUserRepository;
import com.clinicSys.service.IReceptionistService;
import com.clinicSys.service.IServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReceptionistServiceImpl implements IReceptionistService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IBillRepository billRepository;

    @Autowired
    private IServiceService serviceService;

    @Autowired
    private IMedicalRecordRepository medicalRecordRepository;

    @Autowired
    private IDiagnosisRepository diagnosisRepository;

    @Autowired
    private IICD10CodeRepository icd10CodeRepository;

    @Autowired
    private IPrescriptionRepository prescriptionRepository;

    @Autowired
    private IPrescriptionMedicineRepository prescriptionMedicineRepository;

    @Autowired
    private IMedicineRepository medicineRepository;

    @Override
    public ReceptionistDashboardDTO getDashboard() {
        // Get today's date range
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Get all today's appointments
        List<Appointment> allTodayAppointments = appointmentRepository.findAllByDateTimeBetween(
            startOfToday, endOfToday);

        // Filter today's appointments: Scheduled, Checked-in, In Consultation, Completed, Paid
        List<Appointment> todayAppointments = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Scheduled".equalsIgnoreCase(status) ||
                       "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status) ||
                       "Paid".equalsIgnoreCase(status) ||
                       "paid".equalsIgnoreCase(status);
            })
            .collect(Collectors.toList());

        // Calculate statistics
        long appointmentsToday = todayAppointments.size();
        
        // Total slots today - assuming 30 slots per day (can be configured)
        long totalSlotsToday = 30L;
        
        // Count patients checked in
        long patientsCheckedIn = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status);
            })
            .count();
        
        // Count patients waiting (Checked-in, In Consultation, Completed)
        long patientsWaiting = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status);
            })
            .count();

        // Calculate estimated revenue from today's appointments
        // This can be based on completed appointments or all appointments
        BigDecimal estimatedRevenue = billRepository.getTotalRevenueByDateRange(startOfToday, endOfToday);
        if (estimatedRevenue == null) {
            estimatedRevenue = BigDecimal.ZERO;
        }

        // Convert today's appointments to DTOs
        List<AppointmentWithDoctorDTO> todayAppointmentDTOs = todayAppointments.stream()
            .map(this::convertToAppointmentWithDoctorDTO)
            .collect(Collectors.toList());

        // Create live queue: Checked-in → Waiting, In Consultation → In Consultation, Completed → Ready for Billing, Paid → Paid
        List<AppointmentWithDoctorDTO> liveQueue = allTodayAppointments.stream()
            .filter(a -> {
                String status = a.getStatus();
                return "Checked-in".equalsIgnoreCase(status) ||
                       "check-in".equalsIgnoreCase(status) ||
                       "In Consultation".equalsIgnoreCase(status) ||
                       "in consultation".equalsIgnoreCase(status) ||
                       "Completed".equalsIgnoreCase(status) ||
                       "completed".equalsIgnoreCase(status) ||
                       "Paid".equalsIgnoreCase(status) ||
                       "paid".equalsIgnoreCase(status);
            })
            .map(this::convertToAppointmentWithDoctorDTOForQueue)
            .collect(Collectors.toList());

        return new ReceptionistDashboardDTO(
            appointmentsToday,
            totalSlotsToday,
            patientsCheckedIn,
            patientsWaiting,
            estimatedRevenue,
            todayAppointmentDTOs,
            liveQueue
        );
    }

    private boolean isPaidStatus(String status) {
        return status != null && status.trim().equalsIgnoreCase("Paid");
    }

    private boolean isBillPaid(Optional<Bill> billOpt) {
        if (billOpt.isEmpty()) return false;
        String ps = billOpt.get().getPaymentStatus();
        return ps != null && ps.trim().equalsIgnoreCase("Paid");
    }

    private AppointmentWithDoctorDTO convertToAppointmentWithDoctorDTO(Appointment appointment) {
        try {
            Patient patient = patientRepository.findById(appointment.getPatientID())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
            
            User doctor = userRepository.findById(appointment.getDoctorID())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

            String patientName = patient.getFullName() != null ? patient.getFullName() : "Unknown";
            String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername();

            String status = appointment.getStatus();
            Optional<Bill> billOpt = billRepository.findByAppointmentID(appointment.getAppointmentID());
            if (isPaidStatus(status) || isBillPaid(billOpt)) {
                status = "Paid";
            }

            return new AppointmentWithDoctorDTO(
                appointment.getAppointmentID(),
                appointment.getDateTime(),
                status,
                appointment.getPatientID(),
                patientName,
                appointment.getDoctorID(),
                doctorName
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi appointment ID " + appointment.getAppointmentID() + ": " + e.getMessage(), e);
        }
    }

    private AppointmentWithDoctorDTO convertToAppointmentWithDoctorDTOForQueue(Appointment appointment) {
        try {
            Patient patient = patientRepository.findById(appointment.getPatientID())
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
            
            User doctor = userRepository.findById(appointment.getDoctorID())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

            String patientName = patient.getFullName() != null ? patient.getFullName() : "Unknown";
            String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername();

            // Map status for queue display
            String queueStatus = mapStatusForQueue(appointment.getStatus());
            Optional<Bill> billOpt = billRepository.findByAppointmentID(appointment.getAppointmentID());
            if (isPaidStatus(appointment.getStatus()) || isBillPaid(billOpt)) {
                queueStatus = "Paid";
            }

            return new AppointmentWithDoctorDTO(
                appointment.getAppointmentID(),
                appointment.getDateTime(),
                queueStatus, // Mapped status for queue
                appointment.getPatientID(),
                patientName,
                appointment.getDoctorID(),
                doctorName
            );
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi appointment ID " + appointment.getAppointmentID() + ": " + e.getMessage(), e);
        }
    }

    private String mapStatusForQueue(String originalStatus) {
        if (originalStatus == null) {
            return "Waiting";
        }
        
        String status = originalStatus.trim();
        
        // Checked-in → Waiting
        if ("Checked-in".equalsIgnoreCase(status) || "check-in".equalsIgnoreCase(status)) {
            return "Waiting";
        }
        
        // In Consultation → In Consultation
        if ("In Consultation".equalsIgnoreCase(status) || "in consultation".equalsIgnoreCase(status)) {
            return "In Consultation";
        }
        
        // Completed → Ready for Billing
        if ("Completed".equalsIgnoreCase(status) || "completed".equalsIgnoreCase(status)) {
            return "Ready for Billing";
        }

        // Paid → Paid
        if ("Paid".equalsIgnoreCase(status) || "paid".equalsIgnoreCase(status)) {
            return "Paid";
        }
        
        // Default
        return "Waiting";
    }

    @Override
    public List<AppointmentWithDoctorDTO> getAppointmentsByWeek(LocalDate weekStart) {
        // Calculate week start (Monday) and end (Sunday)
        LocalDate monday = weekStart.with(DayOfWeek.MONDAY);
        LocalDate sunday = monday.plusDays(6);
        
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);
        
        List<Appointment> appointments = appointmentRepository.findAllByDateTimeBetween(startOfWeek, endOfWeek);
        
        return appointments.stream()
            .map(this::convertToAppointmentWithDoctorDTO)
            .collect(Collectors.toList());
    }

    @Override
    public AppointmentDetailsDTO getAppointmentById(int appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        Patient patient = patientRepository.findById(appointment.getPatientID())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));
        
        User doctor = userRepository.findById(appointment.getDoctorID())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));
        
        return new AppointmentDetailsDTO(
            appointment.getAppointmentID(),
            appointment.getDateTime(),
            appointment.getStatus(),
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getAddress(),
            patient.getPhone(),
            patient.getEmail(),
            appointment.getDoctorID(),
            doctor.getFullName() != null && !doctor.getFullName().isEmpty()
                ? doctor.getFullName()
                : doctor.getUsername(),
            appointment.getReceptionistID()
        );
    }

    @Override
    public AppointmentDetailsDTO updateAppointmentStatus(int appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        
        appointment.setStatus(newStatus);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        // Return updated appointment details
        return getAppointmentById(updatedAppointment.getAppointmentID());
    }

    @Override
    public List<PatientDTO> searchPatientsByName(String name) {
        List<Patient> patients = patientRepository.searchPatientsByName(name);
        return patients.stream()
            .map(this::convertPatientToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(2); // Role 2 = Doctor
        return doctors.stream()
            .map(this::convertUserToDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDTO> getAllServices() {
        return serviceService.getAllServices();
    }

    @Override
    public AppointmentWithDoctorDTO createAppointment(CreateAppointmentDTO createAppointmentDTO) {
        // Get current authenticated receptionist
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Không tìm thấy thông tin xác thực. Vui lòng đăng nhập lại.");
        }
        
        User currentUser = (User) authentication.getPrincipal();
        int receptionistID = currentUser.getUserID();

        // Validate patient exists
        if (!patientRepository.findById(createAppointmentDTO.patientID()).isPresent()) {
            throw new RuntimeException("Patient not found with ID: " + createAppointmentDTO.patientID());
        }

        // Validate doctor exists
        if (!userRepository.findById(createAppointmentDTO.doctorID()).isPresent()) {
            throw new RuntimeException("Doctor not found with ID: " + createAppointmentDTO.doctorID());
        }

        // Create new appointment
        Appointment appointment = new Appointment();
        appointment.setPatientID(createAppointmentDTO.patientID());
        appointment.setDoctorID(createAppointmentDTO.doctorID());
        appointment.setReceptionistID(receptionistID);
        appointment.setDateTime(createAppointmentDTO.dateTime());
        appointment.setStatus("Scheduled");

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Convert to DTO
        return convertToAppointmentWithDoctorDTO(savedAppointment);
    }

    @Override
    public BillingDetailsDTO getBillingDetails(int appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        Patient patient = patientRepository.findById(appointment.getPatientID())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));

        User doctor = userRepository.findById(appointment.getDoctorID())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

        String patientName = patient.getFullName() != null ? patient.getFullName() : "Unknown";
        String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
            ? doctor.getFullName()
            : doctor.getUsername();

        String symptoms = null;
        String consultationNotes = null;
        String diagnosisCode = null;
        String diagnosisDescription = null;

        List<BillingPrescriptionItemDTO> itemDTOs = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        String paymentStatus = "Unpaid";
        String invoiceCode = null;

        Optional<MedicalRecord> medicalRecordOpt = medicalRecordRepository.findByAppointmentID(appointmentId);
        if (medicalRecordOpt.isPresent()) {
            MedicalRecord record = medicalRecordOpt.get();
            symptoms = record.getSymptoms();
            consultationNotes = record.getNotes();

            List<Diagnosis> diagnoses = diagnosisRepository.findByRecordID(record.getRecordID());
            if (!diagnoses.isEmpty()) {
                Diagnosis primary = diagnoses.get(0);
                Optional<ICD10Code> icd10 = icd10CodeRepository.findById(primary.getIcd10CodeID());
                if (icd10.isPresent()) {
                    diagnosisCode = icd10.get().getCode();
                    diagnosisDescription = icd10.get().getDescription();
                }
            }

            Optional<Prescription> prescriptionOpt = prescriptionRepository.findByRecordID(record.getRecordID());
            if (prescriptionOpt.isPresent()) {
                Prescription prescription = prescriptionOpt.get();
                List<PrescriptionMedicine> items = prescriptionMedicineRepository.findByPrescriptionID(prescription.getPrescriptionID());

                for (PrescriptionMedicine pm : items) {
                    Medicine med = medicineRepository.findById(pm.getMedicineID())
                        .orElseThrow(() -> new RuntimeException("Medicine not found: " + pm.getMedicineID()));

                    BigDecimal unitPrice = med.getPrice() != null ? med.getPrice() : BigDecimal.ZERO;
                    BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(pm.getQuantity()))
                        .setScale(0, RoundingMode.HALF_UP);

                    totalAmount = totalAmount.add(lineTotal);

                    itemDTOs.add(new BillingPrescriptionItemDTO(
                        med.getMedicineID(),
                        med.getName(),
                        med.getMedicineCode(),
                        med.getStrength(),
                        med.getUnit(),
                        unitPrice,
                        pm.getQuantity(),
                        lineTotal,
                        pm.getNote()
                    ));
                }
            }
        }

        Optional<Bill> billOpt = billRepository.findByAppointmentID(appointmentId);
        if (billOpt.isPresent()) {
            Bill bill = billOpt.get();
            paymentStatus = bill.getPaymentStatus() != null ? bill.getPaymentStatus().trim() : paymentStatus;
            invoiceCode = bill.getInvoiceCode();
        } else if (isPaidStatus(appointment.getStatus())) {
            paymentStatus = "Paid";
        }

        return new BillingDetailsDTO(
            appointmentId,
            paymentStatus,
            invoiceCode,
            patient.getPatientID(),
            patientName,
            doctor.getUserID(),
            doctorName,
            diagnosisCode,
            diagnosisDescription,
            symptoms,
            consultationNotes,
            itemDTOs,
            totalAmount
        );
    }

    @Override
    public BillingDetailsDTO confirmPayment(int appointmentId) {
        BillingDetailsDTO details = getBillingDetails(appointmentId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));

        Optional<Bill> existingBill = billRepository.findByAppointmentID(appointmentId);
        Bill bill;
        if (existingBill.isPresent()) {
            bill = existingBill.get();
            bill.setTotalAmount(details.totalAmount() != null ? details.totalAmount() : BigDecimal.ZERO);
            bill.setPaymentStatus("Paid");
            bill.setDatePaid(LocalDateTime.now());
            if (bill.getDateIssued() == null) {
                bill.setDateIssued(LocalDateTime.now());
            }
        } else {
            bill = new Bill();
            bill.setInvoiceCode("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            bill.setTotalAmount(details.totalAmount() != null ? details.totalAmount() : BigDecimal.ZERO);
            bill.setPaymentStatus("Paid");
            bill.setAppointmentID(appointmentId);
            bill.setPaymentMethodID(null);
            bill.setDateIssued(LocalDateTime.now());
            bill.setDatePaid(LocalDateTime.now());
        }
        billRepository.save(bill);

        appointment.setStatus("Paid");
        appointmentRepository.save(appointment);

        return new BillingDetailsDTO(
            details.appointmentID(),
            "Paid",
            bill.getInvoiceCode(),
            details.patientID(),
            details.patientName(),
            details.doctorID(),
            details.doctorName(),
            details.diagnosisCode(),
            details.diagnosisDescription(),
            details.symptoms(),
            details.consultationNotes(),
            details.items(),
            details.totalAmount()
        );
    }

    private PatientDTO convertPatientToDTO(Patient patient) {
        return new PatientDTO(
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getAddress(),
            patient.getPhone(),
            patient.getEmail()
        );
    }

    private UserDTO convertUserToDTO(User user) {
        String roleName = switch (user.getRole()) {
            case 1 -> "Admin";
            case 2 -> "Doctor";
            case 3 -> "Receptionist";
            default -> "Unknown";
        };
        
        return new UserDTO(
            user.getUserID(),
            user.getFullName() != null ? user.getFullName() : user.getUsername(),
            user.getEmail() != null ? user.getEmail() : "",
            roleName,
            user.getStatus() != null ? user.getStatus() : "Active"
        );
    }

    @Override
    public List<PaidBillSummaryDTO> getPaidBills() {
        List<Bill> bills = billRepository.findPaidBills();
        List<PaidBillSummaryDTO> results = new ArrayList<>();

        for (Bill bill : bills) {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(bill.getAppointmentID());
            if (appointmentOpt.isEmpty()) continue;

            Appointment appointment = appointmentOpt.get();
            Optional<Patient> patientOpt = patientRepository.findById(appointment.getPatientID());
            if (patientOpt.isEmpty()) continue;

            Patient patient = patientOpt.get();
            results.add(new PaidBillSummaryDTO(
                bill.getBillID(),
                bill.getInvoiceCode(),
                bill.getAppointmentID(),
                bill.getDateIssued(),
                bill.getDatePaid(),
                bill.getTotalAmount(),
                patient.getPatientID(),
                patient.getPatientCode(),
                patient.getFullName()
            ));
        }

        return results;
    }

    @Override
    public PaidBillDetailDTO getPaidBillDetails(int billId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new RuntimeException("Bill not found with ID: " + billId));

        Appointment appointment = appointmentRepository.findById(bill.getAppointmentID())
            .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + bill.getAppointmentID()));

        Patient patient = patientRepository.findById(appointment.getPatientID())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + appointment.getPatientID()));

        User doctor = userRepository.findById(appointment.getDoctorID())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + appointment.getDoctorID()));

        String doctorName = doctor.getFullName() != null && !doctor.getFullName().isEmpty()
            ? doctor.getFullName()
            : doctor.getUsername();

        String paymentStatus = bill.getPaymentStatus() != null ? bill.getPaymentStatus().trim() : "Paid";

        return new PaidBillDetailDTO(
            bill.getBillID(),
            bill.getInvoiceCode(),
            paymentStatus,
            bill.getPaymentMethodID(),
            bill.getDateIssued(),
            bill.getDatePaid(),
            bill.getTotalAmount(),
            appointment.getAppointmentID(),
            appointment.getDateTime(),
            doctorName,
            patient.getPatientID(),
            patient.getPatientCode(),
            patient.getFullName(),
            patient.getDateOfBirth(),
            patient.getGender(),
            patient.getAddress(),
            patient.getPhone(),
            patient.getEmail()
        );
    }
}

