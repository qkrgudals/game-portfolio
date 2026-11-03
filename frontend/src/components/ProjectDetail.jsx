
import { useEffect, useState } from "react";

function ProjectDetail({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProject = async () => {
      setLoading(true);
      setError("");
      setProject(null);

      try {
        const response = await fetch(
          `/api/projects/${projectId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("프로젝트 정보를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setProject(data);
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

    fetchProject();

    return () => controller.abort();
  }, [projectId]);

  if (loading) {
    return (
      <main className="project-detail">
        <p>프로젝트 정보를 불러오는 중...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="project-detail">
        <p>{error}</p>
        <button type="button" onClick={onBack}>
          목록으로 돌아가기
        </button>
      </main>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <main className="project-detail">
      <h2>{project.title}</h2>

      {/* 프로젝트 대표 이미지 */}
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="detail-image"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      {/* 프로젝트 설명 */}
      <div className="detail-info">
        <h3>프로젝트 소개</h3>
        <p>{project.description}</p>

        <h3>사용 기술</h3>
        <p>{project.techStack}</p>
      </div>

      {/* GitHub 링크 */}
      <div className="detail-buttons">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-button"
          >
            GitHub 보기
          </a>
        )}

        {/* Unity WebGL 게임 실행 */}
        {project.gameUrl && (
          <button
            type="button"
            disabled
            title="Unity WebGL 연결 후 활성화됩니다."
          >
            게임 플레이 (준비 중)
          </button>
        )}

        <button type="button" onClick={onBack}>
          프로젝트 목록으로
        </button>
      </div>
    </main>
  );
}

export default ProjectDetail;
