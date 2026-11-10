package com.gameportfolio.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_records")
public class GameRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer stage;

    @Column(nullable = false)
    private Float clearTime;

    @Column(nullable = false)
    private LocalDateTime clearedAt;

    @PrePersist
    protected void onCreate() {
        clearedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getStage() {
        return stage;
    }

    public void setStage(Integer stage) {
        this.stage = stage;
    }

    public Float getClearTime() {
        return clearTime;
    }

    public void setClearTime(Float clearTime) {
        this.clearTime = clearTime;
    }

    public LocalDateTime getClearedAt() {
        return clearedAt;
    }
}
