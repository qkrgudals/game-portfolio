
package com.gameportfolio.backend.service;

import com.gameportfolio.backend.entity.Project;
import com.gameportfolio.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // 프로젝트 등록
    public Project createProject(Project project) {
        project.setId(null);
        return projectRepository.save(project);
    }

    // 프로젝트 전체 조회
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // 프로젝트 상세 조회
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "프로젝트를 찾을 수 없습니다. ID: " + id
                        )
                );
    }
}
