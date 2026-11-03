
package com.gameportfolio.backend.controller;

import com.gameportfolio.backend.dto.UserResponse;
import com.gameportfolio.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gameportfolio.backend.dto.DeleteAccountRequest;
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
    public ResponseEntity<UserResponse> getMyInfo(
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        // 로그인 세션이 없는 경우
        if (session == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Long userId = (Long) session.getAttribute(
                "LOGIN_USER_ID"
        );

        // 세션에 회원 ID가 없는 경우
        if (userId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        try {
            UserResponse response =
                    userService.getMyInfo(userId);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            // 세션에 기록된 회원이 DB에 없는 경우
            session.invalidate();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }


    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount(
            @RequestBody DeleteAccountRequest deleteRequest,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        // 로그인 여부 확인
        if (session == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "로그인이 필요합니다."
                    ));
        }

        Long userId = (Long) session.getAttribute(
                "LOGIN_USER_ID"
        );

        if (userId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "로그인이 필요합니다."
                    ));
        }

        if (deleteRequest == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "비밀번호를 입력해주세요.")
            );
        }

        try {
            userService.deleteMyAccount(
                    userId,
                    deleteRequest.getPassword()
            );

            // 탈퇴 성공 후 서버 세션 삭제
            session.invalidate();

            return ResponseEntity.ok(Map.of(
                    "message", "회원탈퇴가 완료되었습니다."
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }


}
