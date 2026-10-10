package com.apex.gstsuite.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Service
public class PasswordService {

    private final SecureRandom random = new SecureRandom();

    public String generateSalt() {
        byte[] saltBytes = new byte[16];
        random.nextBytes(saltBytes);
        return HexFormat.of().formatHex(saltBytes);
    }

    public String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public boolean matches(String rawPassword, String salt, String expectedHash) {
        String calculated = hashPassword(rawPassword, salt);
        return MessageDigest.isEqual(
                calculated.getBytes(StandardCharsets.UTF_8),
                expectedHash.getBytes(StandardCharsets.UTF_8)
        );
    }
}
