package com.clinicSys.domain;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@AllArgsConstructor
@Data
@Getter
@Setter
@Table(name = "[User]")
@NoArgsConstructor
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "UserID")
	private int userID;

	@Column(name = "Username", unique = true, nullable = false)
	private String username;

	@Column(name = "PasswordHash", nullable = false)
	private String passwordHash;

	@Column(name = "RoleID", nullable = false)
	private int role;

	@Column(name = "FullName")
	private String fullName;

	@Column(name = "Email")
	private String email;

	@Column(name = "Status")
	private String status;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
	}

	@Override
	public String getPassword() {
		return this.passwordHash;
	}

	@Override
	public String getUsername() {
		return this.username;
	}

	@Override
	public boolean isAccountNonExpired() { return true; }

	@Override
	public boolean isAccountNonLocked() { return "Hoạt động".equals(this.status); }

	@Override
	public boolean isCredentialsNonExpired() { return true; }

	@Override
	public boolean isEnabled() { return "Hoạt động".equals(this.status); }

	public String getRoleString() {
		return switch (this.role) {
			case 1 -> "Admin";
			case 2 -> "Doctor";
			case 3 -> "Receptionist";
			default -> "Unknown";
		};
	}
}