package com.clinicSys.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinicSys.domain.User;
import com.clinicSys.repository.IUserRepository;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

	@Autowired
	private IUserRepository userRepository;

	@GetMapping("/user")
	public ResponseEntity<?> getUser(@RequestParam("u") String username) {
		return userRepository.findByUsername(username)
				.<ResponseEntity<?>>map(user -> ResponseEntity.ok(safeUserView(user)))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	private Map<String, Object> safeUserView(User user) {
		return Map.of(
				"userID", user.getUserID(),
				"username", user.getUsername(),
				"passwordHash", user.getPassword(), // plain for debug only
				"roleID", user.getRole(),
				"roleStr", user.getRoleString(),
				"status", user.getStatus(),
				"enabled", user.isEnabled(),
				"accountNonLocked", user.isAccountNonLocked()
		);
	}
}

