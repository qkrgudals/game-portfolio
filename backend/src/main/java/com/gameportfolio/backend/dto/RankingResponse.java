package com.gameportfolio.backend.dto;

public record RankingResponse(
        int rank,
        String username,
        Integer stage,
        Float clearTime
) {
}