package com.clinicSys.service;

import com.clinicSys.dto.request.CreatePatientDTO;
import com.clinicSys.dto.response.PatientDTO;

public interface IPatientService {
    PatientDTO createPatient(CreatePatientDTO createPatientDTO);
}

