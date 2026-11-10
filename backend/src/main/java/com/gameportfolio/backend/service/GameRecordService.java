
package com.gameportfolio.backend.service;

import com.gameportfolio.backend.entity.GameRecord;
import com.gameportfolio.backend.repository.GameRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameRecordService {

    private final GameRecordRepository gameRecordRepository;

    public GameRecordService(GameRecordRepository gameRecordRepository) {
        this.gameRecordRepository = gameRecordRepository;
    }

    // 게임 기록 저장
    public GameRecord saveRecord(Long userId, Integer stage, Float clearTime) {

        if (userId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        if (stage == null || stage < 1 || stage > 4) {
            throw new IllegalArgumentException("올바르지 않은 스테이지입니다.");
        }

        if (clearTime == null ||
                !Float.isFinite(clearTime) ||
                clearTime <= 0) {
            throw new IllegalArgumentException("올바르지 않은 클리어 시간입니다.");
        }

        GameRecord record = new GameRecord();

        record.setUserId(userId);
        record.setStage(stage);
        record.setClearTime(clearTime);

        return gameRecordRepository.save(record);
    }

    // 로그인한 사용자의 기록 조회 (최신순)
    public List<GameRecord> getMyRecords(Long userId) {

        if (userId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return gameRecordRepository.findByUserIdOrderByClearedAtDesc(userId);
    }

    // 특정 스테이지의 기록 조회 (클리어 시간 빠른 순)
    public List<GameRecord> getStageRecords(Integer stage) {

        if (stage == null || stage < 1 || stage > 4) {
            throw new IllegalArgumentException("올바르지 않은 스테이지입니다.");
        }

        return gameRecordRepository.findByStageOrderByClearTimeAsc(stage);
    }
}
