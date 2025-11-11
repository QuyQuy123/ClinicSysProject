package com.clinicSys.service;

import com.clinicSys.dto.request.CreateMedicineDTO;
import com.clinicSys.dto.response.MedicineDTO;
import com.clinicSys.dto.response.MedicineGroupDTO;
import com.clinicSys.dto.request.UpdateMedicineDTO;
import java.util.List;

public interface IMedicineService {
    List<MedicineDTO> getAllMedicines();
    MedicineDTO getMedicineById(int medicineId);
    List<MedicineGroupDTO> getAllMedicineGroups();
    MedicineDTO createMedicine(CreateMedicineDTO createDTO);
    MedicineDTO updateMedicine(int medicineId, UpdateMedicineDTO updateDTO);
    MedicineDTO updateMedicineStatus(int medicineId, String status);
}

