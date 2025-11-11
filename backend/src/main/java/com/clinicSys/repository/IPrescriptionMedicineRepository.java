package com.clinicSys.repository;

import com.clinicSys.domain.PrescriptionMedicine;
import java.util.List;

public interface IPrescriptionMedicineRepository {
    List<PrescriptionMedicine> findByPrescriptionID(int prescriptionID);
    PrescriptionMedicine save(PrescriptionMedicine prescriptionMedicine);
    void deleteById(int id);
    void deleteByPrescriptionID(int prescriptionID);
}

