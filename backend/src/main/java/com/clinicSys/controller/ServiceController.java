package com.clinicSys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicSys.dto.CreateServiceDTO;
import com.clinicSys.dto.ServiceDTO;
import com.clinicSys.dto.ServiceTypeDTO;
import com.clinicSys.dto.UpdateServiceDTO;
import com.clinicSys.dto.UpdateUserStatusDTO;
import com.clinicSys.service.IServiceService;

@RestController
@RequestMapping("/api/admin/services")
public class ServiceController {

    @Autowired
    private IServiceService serviceService;

    // API để lấy danh sách tất cả services
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        try {
            List<ServiceDTO> services = serviceService.getAllServices();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    // API để lấy thông tin một service theo ID
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable int serviceId) {
        ServiceDTO service = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(service);
    }

    // API để lấy danh sách service types
    @GetMapping("/types")
    public ResponseEntity<List<ServiceTypeDTO>> getAllServiceTypes() {
        List<ServiceTypeDTO> types = serviceService.getAllServiceTypes();
        return ResponseEntity.ok(types);
    }

    // API để tạo service mới
    @PostMapping
    public ResponseEntity<ServiceDTO> createService(@RequestBody CreateServiceDTO createDTO) {
        ServiceDTO newService = serviceService.createService(createDTO);
        return ResponseEntity.ok(newService);
    }

    // API để cập nhật service
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceDTO> updateService(
            @PathVariable int serviceId,
            @RequestBody UpdateServiceDTO updateDTO) {
        ServiceDTO updatedService = serviceService.updateService(serviceId, updateDTO);
        return ResponseEntity.ok(updatedService);
    }

    // API để cập nhật status của service
    @PutMapping("/{serviceId}/status")
    public ResponseEntity<ServiceDTO> updateServiceStatus(
            @PathVariable int serviceId,
            @RequestBody UpdateUserStatusDTO statusDTO) {
        ServiceDTO updatedService = serviceService.updateServiceStatus(serviceId, statusDTO.status());
        return ResponseEntity.ok(updatedService);
    }
}

