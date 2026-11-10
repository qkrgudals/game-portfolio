package com.gameportfolio.backend.repository;

import com.gameportfolio.backend.entity.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRecordRepository
        extends JpaRepository<GameRecord, Long> {

    // 특정 사용자의 게임 기록 조회 (최신순)
    List<GameRecord> findByUserIdOrderByClearedAtDesc(Long userId);

    // 특정 스테이지의 게임 기록 조회 (클리어 시간 빠른 순)
    List<GameRecord> findByStageOrderByClearTimeAsc(Integer stage);
}
