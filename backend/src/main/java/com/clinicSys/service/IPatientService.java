package com.clinicSys.service;

import com.clinicSys.dto.request.CreatePatientDTO;
import com.clinicSys.dto.request.UpdatePatientDTO;
import com.clinicSys.dto.response.PatientDTO;

import java.util.List;

public interface IPatientService {
    PatientDTO createPatient(CreatePatientDTO createPatientDTO);
    List<PatientDTO> getAllPatients();
    PatientDTO getPatientById(int patientId);
    List<PatientDTO> searchPatients(String searchTerm);
    PatientDTO updatePatient(int patientId, UpdatePatientDTO updatePatientDTO);
}

