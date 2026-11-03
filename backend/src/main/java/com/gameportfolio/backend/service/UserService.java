
package com.gameportfolio.backend.service;

import com.gameportfolio.backend.dto.UserResponse;
import com.gameportfolio.backend.entity.User;
import com.gameportfolio.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 로그인한 회원정보 조회
    public UserResponse getMyInfo(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "회원을 찾을 수 없습니다."
                        )
                );

        return new UserResponse(user);
    }

    // 회원탈퇴
    @Transactional
    public void deleteMyAccount(Long userId, String password) {

        // 비밀번호 입력 확인
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "비밀번호를 입력해주세요."
            );
        }

        // 로그인한 회원정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "회원을 찾을 수 없습니다."
                        )
                );

        // 입력한 비밀번호와 DB의 암호화된 비밀번호 비교
        boolean passwordMatches = passwordEncoder.matches(
                password,
                user.getPassword()
        );

        // 비밀번호가 일치하지 않는 경우
        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "비밀번호가 올바르지 않습니다."
            );
        }

        // 회원정보 삭제
        userRepository.delete(user);
    }
}
