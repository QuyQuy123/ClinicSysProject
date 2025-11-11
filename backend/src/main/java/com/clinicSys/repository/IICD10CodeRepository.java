package com.clinicSys.repository;

import com.clinicSys.domain.ICD10Code;
import java.util.List;
import java.util.Optional;

public interface IICD10CodeRepository {
    Optional<ICD10Code> findById(int id);
    List<ICD10Code> searchByCodeOrDescription(String searchTerm);
}

