
package com.gameportfolio.backend.controller;

import com.gameportfolio.backend.entity.GameRecord;
import com.gameportfolio.backend.service.GameRecordService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gameportfolio.backend.dto.RankingResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
public class GameRecordController {

    private final GameRecordService gameRecordService;

    public GameRecordController(GameRecordService gameRecordService) {
        this.gameRecordService = gameRecordService;
    }

    // Unity에서 전송하는 게임 기록 데이터
    public record GameRecordRequest(
            Integer stage,
            Float clearTime
    ) {}

    // 게임 기록 저장
    @PostMapping
    public ResponseEntity<?> saveRecord(
            @RequestBody GameRecordRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("LOGIN_USER_ID");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        try {
            GameRecord record = gameRecordService.saveRecord(
                    userId,
                    request.stage(),
                    request.clearTime()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(record);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 로그인한 사용자의 게임 기록 조회
    @GetMapping("/me")
    public ResponseEntity<?> getMyRecords(HttpSession session) {

        Long userId = (Long) session.getAttribute("LOGIN_USER_ID");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        List<GameRecord> records =
                gameRecordService.getMyRecords(userId);

        return ResponseEntity.ok(records);
    }

    // 특정 스테이지 기록 조회
    @GetMapping("/stage/{stage}")
    public ResponseEntity<?> getStageRecords(
            @PathVariable Integer stage
    ) {
        try {
            List<GameRecord> records =
                    gameRecordService.getStageRecords(stage);

            return ResponseEntity.ok(records);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 전체 사용자 랭킹 조회
    @GetMapping("/ranking")
    public ResponseEntity<List<RankingResponse>> getRanking() {

        List<RankingResponse> ranking = gameRecordService.getRanking();

        return ResponseEntity.ok(ranking);
    }
}
