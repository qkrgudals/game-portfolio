
package com.gameportfolio.backend.controller;

import com.gameportfolio.backend.dto.UserResponse;
import com.gameportfolio.backend.dto.DeleteAccountRequest;
import com.gameportfolio.backend.exception.UserNotFoundException;
import com.gameportfolio.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 로그인한 회원정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return unauthorized();
        }

        Long userId = (Long) session.getAttribute(
                "LOGIN_USER_ID"
        );

        if (userId == null) {
            return unauthorized();
        }

        try {
            UserResponse response =
                    userService.getMyInfo(userId);

            return ResponseEntity.ok(response);

        } catch (UserNotFoundException e) {
            session.invalidate();
            return unauthorized();
        }
    }

    // 회원탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount(
            @RequestBody DeleteAccountRequest deleteRequest,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return unauthorized();
        }

        Long userId = (Long) session.getAttribute(
                "LOGIN_USER_ID"
        );

        if (userId == null) {
            return unauthorized();
        }

        if (deleteRequest == null) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message", "비밀번호를 입력해주세요."
                    )
            );
        }

        try {
            userService.deleteMyAccount(
                    userId,
                    deleteRequest.getPassword()
            );

            // 회원탈퇴 성공 후 세션 삭제
            session.invalidate();

            return ResponseEntity.ok(Map.of(
                    "message", "회원탈퇴가 완료되었습니다."
            ));

        } catch (UserNotFoundException e) {
            session.invalidate();
            return unauthorized();
        }
    }

    // 공통 401 응답
    private ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "message", "로그인이 필요합니다."
                ));
    }
}
