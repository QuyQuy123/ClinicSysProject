package com.clinicSys.service;

import com.clinicSys.dto.request.CreateServiceDTO;
import com.clinicSys.dto.response.ServiceDTO;
import com.clinicSys.dto.response.ServiceTypeDTO;
import com.clinicSys.dto.request.UpdateServiceDTO;
import java.util.List;

public interface IServiceService {
    List<ServiceDTO> getAllServices();
    ServiceDTO getServiceById(int serviceId);
    List<ServiceTypeDTO> getAllServiceTypes();
    ServiceDTO createService(CreateServiceDTO createDTO);
    ServiceDTO updateService(int serviceId, UpdateServiceDTO updateDTO);
    ServiceDTO updateServiceStatus(int serviceId, String status);
}

