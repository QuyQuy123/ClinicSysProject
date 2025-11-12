package com.clinicSys.config;

import com.clinicSys.service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.clinicSys.config.filter.JwtAuthFilter;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // === THÊM DÒNG NÀY ===
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // (Bean passwordEncoder() và authenticationManager() giữ nguyên như cũ)
    @Bean
    public PasswordEncoder passwordEncoder() {
        // !!! LƯU Ý: Vẫn đang dùng NoOpPasswordEncoder (mật khẩu text)
        // Bạn nên đổi sang BCryptPasswordEncoder() khi chạy production
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    // === SỬA LẠI BEAN NÀY ===
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Cho phép Login
                        .requestMatchers("/api/debug/**").permitAll() // Cho phép Debug

                        // --- PHÂN QUYỀN ADMIN ---
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // --- PHÂN QUYỀN DOCTOR ---
                        .requestMatchers("/api/doctor/**").hasRole("DOCTOR")
                        
                        // --- PHÂN QUYỀN RECEPTIONIST ---
                        .requestMatchers("/api/receptionist/**").hasRole("RECEPTIONIST")

                        .anyRequest().authenticated() // Tất cả API còn lại phải xác thực
                )
                // Thêm bộ lọc JWT vào trước bộ lọc UsernamePassword
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // (Bean corsConfigurationSource() giữ nguyên như cũ)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // ... (Giữ nguyên code của bạn)
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Hoặc "http://localhost:5173"
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
