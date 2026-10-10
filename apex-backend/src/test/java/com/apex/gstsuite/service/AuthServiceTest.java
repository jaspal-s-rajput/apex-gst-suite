package com.apex.gstsuite.service;

import com.apex.gstsuite.dto.AuthResponseDto;
import com.apex.gstsuite.dto.LoginRequestDto;
import com.apex.gstsuite.dto.RegisterRequestDto;
import com.apex.gstsuite.repository.CompanyRepository;
import com.apex.gstsuite.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    void testRegisterAndLogin() {
        String testEmail = "teststore_" + System.currentTimeMillis() + "@gmail.com";
        RegisterRequestDto reg = new RegisterRequestDto();
        reg.setStoreName("Test Electronics Superstore");
        reg.setFullName("Test Owner");
        reg.setEmail(testEmail);
        reg.setPassword("SecretPass@123");
        reg.setPhone("+91 99999 88888");
        reg.setStateCode("27");

        AuthResponseDto regResponse = authService.register(reg);
        assertNotNull(regResponse);
        assertNotNull(regResponse.getUser());
        assertEquals(testEmail, regResponse.getUser().getEmail());
        assertEquals("Test Electronics Superstore", regResponse.getStore().getTradeName());

        // Test Login
        LoginRequestDto login = new LoginRequestDto(testEmail, "SecretPass@123");
        AuthResponseDto loginResponse = authService.login(login);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals(testEmail, loginResponse.getUser().getEmail());

        // Test Invalid Password Rejection
        LoginRequestDto wrongPass = new LoginRequestDto(testEmail, "WrongPassword");
        assertThrows(IllegalArgumentException.class, () -> authService.login(wrongPass));
    }
}
