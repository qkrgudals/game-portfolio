
package com.gameportfolio.backend.repository;

import com.gameportfolio.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {

}
