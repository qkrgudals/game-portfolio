
package com.gameportfolio.backend.controller;

import com.gameportfolio.backend.entity.Project;
import com.gameportfolio.backend.service.ProjectService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // 프로젝트 등록
    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project) {

        Project savedProject =
                projectService.createProject(project);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProject);
    }

    // 프로젝트 전체 조회
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // 프로젝트 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id) {

        try {
            Project project =
                    projectService.getProjectById(id);

            return ResponseEntity.ok(project);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
