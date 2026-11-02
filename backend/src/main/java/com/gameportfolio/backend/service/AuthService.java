
package com.gameportfolio.backend.service;
import com.gameportfolio.backend.dto.LoginRequest;
import java.util.Optional;
import com.gameportfolio.backend.dto.SignupRequest;
import com.gameportfolio.backend.entity.User;
import com.gameportfolio.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new IllegalArgumentException(
                    "이미 가입된 이메일입니다."
            );
        }

        // 비밀번호 해싱
        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        // 회원 객체 생성
        User user = new User(
                request.getUsername().trim(),
                email,
                encodedPassword
        );

        // MySQL에 저장
        userRepository.save(user);
    }


    public User login(LoginRequest request) {

        // 1. 입력값 확인
        if (request == null
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "이메일과 비밀번호를 입력해주세요."
            );
        }

        // 2. 이메일로 회원 조회
        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail().trim());

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        User user = optionalUser.get();

        // 3. BCrypt 비밀번호 비교
        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        // 4. 로그인 검증 성공
        return user;
    }

}
