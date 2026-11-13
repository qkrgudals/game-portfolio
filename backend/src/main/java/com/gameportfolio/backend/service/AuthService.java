
package com.gameportfolio.backend.service;

import com.gameportfolio.backend.dto.LoginRequest;
import com.gameportfolio.backend.dto.SignupRequest;
import com.gameportfolio.backend.entity.User;
import com.gameportfolio.backend.exception.AuthenticationFailedException;
import com.gameportfolio.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 회원가입
    public void signup(SignupRequest request) {

        // 입력값 확인
        if (request == null
                || request.getUsername() == null
                || request.getUsername().isBlank()
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8) {

            throw new IllegalArgumentException(
                    "이름과 이메일을 입력하고 비밀번호는 8자 이상으로 설정하세요."
            );
        }

        String email = request.getEmail().trim();

        // 이메일 중복 검사
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException(
                    "이미 가입된 이메일입니다."
            );
        }

        // 비밀번호 암호화
        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        // 회원 객체 생성
        User user = new User(
                request.getUsername().trim(),
                email,
                encodedPassword
        );

        // MySQL 저장
        userRepository.save(user);
    }

    // 로그인
    public User login(LoginRequest request) {

        // 입력값 확인
        if (request == null
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "이메일과 비밀번호를 입력해주세요."
            );
        }

        // 이메일로 회원 조회
        Optional<User> optionalUser =
                userRepository.findByEmail(
                        request.getEmail().trim()
                );

        if (optionalUser.isEmpty()) {
            throw new AuthenticationFailedException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        User user = optionalUser.get();

        // BCrypt 비밀번호 비교
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new AuthenticationFailedException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        return user;
    }
}
