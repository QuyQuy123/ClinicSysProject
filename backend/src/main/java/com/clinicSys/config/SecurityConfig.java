package com.clinicSys.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.clinicSys.service.impl.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // ===== TẮT MÃ HÓA ĐỂ TEST - DÙNG MẬT KHẨU THƯỜNG (PLAIN TEXT) =====
        // CHÚ Ý: CHỈ DÙNG CHO TEST, KHI ĐI PRODUCTION PHẢI BẬT LẠI BCRYPT!
        @SuppressWarnings("deprecation")
        PasswordEncoder encoder = NoOpPasswordEncoder.getInstance();
        return encoder;
        
        // ===== KHI ĐI PRODUCTION, BẬT LẠI DÒNG DƯỚI VÀ XÓA DÒNG TRÊN =====
        // return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        // Cấu hình AuthenticationManager
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF vì dùng JWT
                .cors(cors -> cors.configure(http)) // Kích hoạt CORS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không tạo session
                .authorizeHttpRequests(authz -> authz
                        // Cho phép các đường dẫn này mà không cần xác thực
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/debug/**").permitAll() // Debug endpoint (CHỈ CHO TEST)
                        // Tất cả các request khác đều phải xác thực
                        .anyRequest().authenticated()
                );

        // (Chúng ta sẽ thêm JwtAuthFilter vào đây ở bước sau)

        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Cấu hình CORS (thay thế cho WebConfig.java cũ)
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Cho phép /api/
                        .allowedOrigins("http://localhost:5173") // React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}