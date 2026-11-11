package com.gameportfolio.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_downloads")
public class GameDownload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    private Long userId;

    @Column(nullable = false)
    private LocalDateTime downloadedAt;

    protected GameDownload() {
    }

    public GameDownload(Long projectId, Long userId) {
        this.projectId = projectId;
        this.userId = userId;
        this.downloadedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDateTime getDownloadedAt() {
        return downloadedAt;
    }
}