
import { useEffect, useState } from "react";

function ProjectList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("프로젝트 목록을 불러오지 못했습니다.");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p>프로젝트 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="project-section">
      <h2>My Projects</h2>
      <p>제가 제작한 게임과 웹 프로젝트입니다.</p>

      {projects.length === 0 ? (
        <p>등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="project-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <p className="project-tech">
                  {project.techStack}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectList;
