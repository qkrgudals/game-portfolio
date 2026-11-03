
package com.gameportfolio.backend.controller;

import com.gameportfolio.backend.dto.LoginRequest;
import com.gameportfolio.backend.dto.SignupRequest;
import com.gameportfolio.backend.entity.User;
import com.gameportfolio.backend.service.AuthService;
import com.gameportfolio.backend.config.CsrfFilter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(
            @RequestBody SignupRequest request
    ) {
        try {
            authService.signup(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "회원가입 성공!"
                    ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        // 입력값 누락 확인
        if (request == null
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", "이메일과 비밀번호를 입력해주세요."
                    ));
        }

        try {
            User user = authService.login(request);

            // 기존 세션 제거
            HttpSession oldSession =
                    httpRequest.getSession(false);

            if (oldSession != null) {
                oldSession.invalidate();
            }

            // 새로운 로그인 세션 생성
            HttpSession session =
                    httpRequest.getSession(true);

            session.setAttribute(
                    "LOGIN_USER_ID",
                    user.getId()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "로그인 성공!",
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
            ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "이메일 또는 비밀번호가 올바르지 않습니다."
                    ));
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletRequest request
    ) {
        HttpSession session =
                request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(Map.of(
                "message", "로그아웃 성공!"
        ));
    }

    // CSRF 토큰 발급
    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> getCsrfToken(
            HttpSession session
    ) {
        String token =
                CsrfFilter.getOrCreateToken(session);

        return ResponseEntity.ok(Map.of(
                "csrfToken", token
        ));
    }
}
