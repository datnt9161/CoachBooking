package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create Admin user only
        if (!userRepository.existsByEmail("admin@coachbooking.com")) {
            User admin = User.builder()
                    .fullName("Administrator")
                    .email("admin@coachbooking.com")
                    .phone("0900000000")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin@coachbooking.com / admin123");
        }

        // Create sample Customer
        if (!userRepository.existsByEmail("test@example.com")) {
            User user = User.builder()
                    .fullName("Test User")
                    .email("test@example.com")
                    .phone("0123456789")
                    .password(passwordEncoder.encode("123456"))
                    .role(User.Role.CUSTOMER)
                    .build();
            userRepository.save(user);
            System.out.println("Test user created: test@example.com / 123456");
        }

        System.out.println("Initialization completed!");
    }
}
