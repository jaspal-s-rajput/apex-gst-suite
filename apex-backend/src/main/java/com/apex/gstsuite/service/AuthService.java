package com.apex.gstsuite.service;

import com.apex.gstsuite.dto.AuthResponseDto;
import com.apex.gstsuite.dto.LoginRequestDto;
import com.apex.gstsuite.dto.RegisterRequestDto;
import com.apex.gstsuite.model.entity.Company;
import com.apex.gstsuite.model.entity.User;
import com.apex.gstsuite.repository.CompanyRepository;
import com.apex.gstsuite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordService passwordService;
    private final GstinValidatorService gstinValidatorService;

    public AuthService(UserRepository userRepository,
                       CompanyRepository companyRepository,
                       PasswordService passwordService,
                       GstinValidatorService gstinValidatorService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordService = passwordService;
        this.gstinValidatorService = gstinValidatorService;
    }

    @Transactional
    public AuthResponseDto login(LoginRequestDto request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        boolean matches = passwordService.matches(request.getPassword(), user.getSalt(), user.getPasswordHash());
        if (!matches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = "apex-token-" + UUID.randomUUID();

        return AuthResponseDto.builder()
                .token(token)
                .user(user)
                .store(user.getCompany())
                .message("Login successful")
                .build();
    }

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String stateCode = request.getStateCode() != null ? request.getStateCode() : "27";
        String stateName = gstinValidatorService.getStateName(stateCode);

        // Auto-generate invoice prefix from store name
        String prefix = request.getStoreName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        if (prefix.length() > 4) prefix = prefix.substring(0, 4);
        if (prefix.isBlank()) prefix = "INV";
        prefix = prefix + "/26-27";

        // Create Store (Company)
        Company store = Company.builder()
                .legalName(request.getStoreName() + " Pvt Ltd")
                .tradeName(request.getStoreName())
                .gstin(request.getGstin() != null && !request.getGstin().isBlank() ? request.getGstin().trim().toUpperCase() : null)
                .stateCode(stateCode)
                .stateName(stateName)
                .addressLine1(request.getAddress() != null && !request.getAddress().isBlank() ? request.getAddress() : "Main Market, Station Road")
                .city("Mumbai")
                .pincode("400001")
                .phone(request.getPhone())
                .email(cleanEmail)
                .invoicePrefix(prefix)
                .nextInvoiceSequence(101L)
                .build();

        Company savedStore = companyRepository.save(store);

        // Hash password
        String salt = passwordService.generateSalt();
        String hash = passwordService.hashPassword(request.getPassword(), salt);

        // Create User
        User user = User.builder()
                .company(savedStore)
                .email(cleanEmail)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .passwordHash(hash)
                .salt(salt)
                .role("ADMIN")
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        String token = "apex-token-" + UUID.randomUUID();

        return AuthResponseDto.builder()
                .token(token)
                .user(savedUser)
                .store(savedStore)
                .message("Store account created successfully")
                .build();
    }
}
