package com.clinicSys.service;

import com.clinicSys.dto.CreateMedicineDTO;
import com.clinicSys.dto.MedicineDTO;
import com.clinicSys.dto.MedicineGroupDTO;
import com.clinicSys.dto.UpdateMedicineDTO;
import java.util.List;

public interface IMedicineService {
    List<MedicineDTO> getAllMedicines();
    MedicineDTO getMedicineById(int medicineId);
    List<MedicineGroupDTO> getAllMedicineGroups();
    MedicineDTO createMedicine(CreateMedicineDTO createDTO);
    MedicineDTO updateMedicine(int medicineId, UpdateMedicineDTO updateDTO);
    MedicineDTO updateMedicineStatus(int medicineId, String status);
}

