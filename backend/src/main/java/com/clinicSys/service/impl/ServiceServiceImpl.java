package com.clinicSys.service.impl;

import com.clinicSys.domain.Service;
import com.clinicSys.domain.ServiceType;
import com.clinicSys.dto.request.CreateServiceDTO;
import com.clinicSys.dto.response.ServiceDTO;
import com.clinicSys.dto.response.ServiceTypeDTO;
import com.clinicSys.dto.request.UpdateServiceDTO;
import com.clinicSys.repository.IServiceRepository;
import com.clinicSys.repository.IServiceTypeRepository;
import com.clinicSys.service.IServiceService;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service

public class ServiceServiceImpl implements IServiceService {

    @Autowired
    private IServiceRepository serviceRepository;

    @Autowired
    private IServiceTypeRepository serviceTypeRepository;

    @Override
    public List<ServiceDTO> getAllServices() {
        try {
            List<Service> services = serviceRepository.findAll();
            return services.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching services: " + e.getMessage(), e);
        }
    }

    @Override
    public ServiceDTO getServiceById(int serviceId) {
        Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }
        return convertToDTO(serviceOpt.get());
    }

    @Override
    public List<ServiceTypeDTO> getAllServiceTypes() {
        return serviceTypeRepository.findByStatus("Active").stream()
                .map(st -> new ServiceTypeDTO(st.getServiceTypeID(), st.getTypeName(), st.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDTO createService(CreateServiceDTO createDTO) {
        Optional<Service> existingService = serviceRepository.findByServiceCode(createDTO.serviceCode());
        if (existingService.isPresent()) {
            throw new RuntimeException("Service code already exists: " + createDTO.serviceCode());
        }
        Optional<ServiceType> serviceTypeOpt = serviceTypeRepository.findById(createDTO.serviceTypeID());
        if (serviceTypeOpt.isEmpty()) {
            throw new RuntimeException("ServiceType not found with ID: " + createDTO.serviceTypeID());
        }

        Service newService = new Service();
        newService.setServiceCode(createDTO.serviceCode());
        newService.setServiceTypeID(createDTO.serviceTypeID());
        newService.setName(createDTO.serviceName());
        newService.setPrice(createDTO.price());
        newService.setStatus(createDTO.status());

        Service savedService = serviceRepository.save(newService);
        return convertToDTO(savedService);
    }

    @Override
    public ServiceDTO updateService(int serviceId, UpdateServiceDTO updateDTO) {
        Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        Service service = serviceOpt.get();

        if (updateDTO.serviceName() != null && !updateDTO.serviceName().isEmpty()) {
            service.setName(updateDTO.serviceName());
        }
        if (updateDTO.serviceTypeID() != null) {
            Optional<ServiceType> serviceTypeOpt = serviceTypeRepository.findById(updateDTO.serviceTypeID());
            if (serviceTypeOpt.isEmpty()) {
                throw new RuntimeException("ServiceType not found with ID: " + updateDTO.serviceTypeID());
            }
            service.setServiceTypeID(updateDTO.serviceTypeID());
        }
        if (updateDTO.price() != null) {
            service.setPrice(updateDTO.price());
        }

        if (updateDTO.status() != null && !updateDTO.status().isEmpty()) {
            service.setStatus(updateDTO.status());
        }
        Service updatedService = serviceRepository.save(service);
        return convertToDTO(updatedService);
    }

    @Override
    public ServiceDTO updateServiceStatus(int serviceId, String status) {
        Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }

        Service service = serviceOpt.get();
        service.setStatus(status);
        Service updatedService = serviceRepository.save(service);
        return convertToDTO(updatedService);
    }

    private ServiceDTO convertToDTO(Service service) {
        String serviceTypeName = "Unknown";
        Optional<ServiceType> serviceTypeOpt = serviceTypeRepository.findById(service.getServiceTypeID());
        if (serviceTypeOpt.isPresent()) {
            serviceTypeName = serviceTypeOpt.get().getTypeName();
        }

        return new ServiceDTO(
            service.getServiceID(),
            service.getServiceCode(),
            service.getName(),
            serviceTypeName,
            service.getServiceTypeID(),
            service.getPrice(),
            service.getStatus()
        );
    }
}

