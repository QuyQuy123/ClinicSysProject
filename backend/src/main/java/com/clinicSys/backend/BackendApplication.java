package com.clinicSys.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan; // <<< THÊM IMPORT NÀY
import org.springframework.data.jpa.repository.config.EnableJpaRepositories; // <<< THÊM IMPORT NÀY

// Sửa 3 dòng @ annotation này
@SpringBootApplication(scanBasePackages = "com.clinicSys") // 1. Cái này cho @Service, @Controller, @Config
@EnableJpaRepositories(basePackages = "com.clinicSys.repository") // 2. Chỉ cho JPA biết repo ở đâu
@EntityScan(basePackages = "com.clinicSys.domain") // 3. Chỉ cho JPA biết @Entity (User.java) ở đâu
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
