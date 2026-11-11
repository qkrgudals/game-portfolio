
package com.gameportfolio.backend.service;

import com.gameportfolio.backend.entity.GameRecord;
import com.gameportfolio.backend.repository.GameRecordRepository;
import org.springframework.stereotype.Service;
import com.gameportfolio.backend.dto.RankingResponse;
import com.gameportfolio.backend.entity.User;
import com.gameportfolio.backend.repository.UserRepository;

import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
@Service
public class GameRecordService {

    private final GameRecordRepository gameRecordRepository;
    private final UserRepository userRepository;

    public GameRecordService(
            GameRecordRepository gameRecordRepository,
            UserRepository userRepository
    ) {
        this.gameRecordRepository = gameRecordRepository;
        this.userRepository = userRepository;
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

    // 전체 랭킹 조회 (사용자별 최고 기록 1개)
    public List<RankingResponse> getRanking() {

        List<GameRecord> records =
                gameRecordRepository.findAllByOrderByStageDescClearTimeAsc();

        Set<Long> addedUserIds = new HashSet<>();

        List<RankingResponse> ranking = new ArrayList<>();

        for (GameRecord record : records) {

            Long userId = record.getUserId();

            // 이미 랭킹에 등록된 사용자라면 건너뛰기
            if (addedUserIds.contains(userId)) {
                continue;
            }

            // 사용자 정보 조회
            User user = userRepository.findById(userId).orElse(null);

            // 탈퇴한 회원 등 사용자 정보가 없으면 제외
            if (user == null) {
                continue;
            }

            // 랭킹 응답 데이터 생성
            RankingResponse response = new RankingResponse(
                    ranking.size() + 1,
                    user.getUsername(),
                    record.getStage(),
                    record.getClearTime()
            );

            ranking.add(response);
            addedUserIds.add(userId);
        }

        return ranking;
    }
}
