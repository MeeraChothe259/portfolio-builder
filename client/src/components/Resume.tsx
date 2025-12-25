import { forwardRef } from "react";
import type { Portfolio } from "@shared/schema";

interface ResumeProps {
  portfolio: Portfolio;
  userName: string;
}

export const Resume = forwardRef<HTMLDivElement, ResumeProps>(
  ({ portfolio, userName }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-black p-12 max-w-4xl mx-auto"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "11pt",
          lineHeight: "1.5",
        }}
      >
        {/* Header Section */}
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
            {userName}
          </h1>
          {portfolio.title && (
            <p className="text-xl text-gray-700 mb-3">{portfolio.title}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {portfolio.location && (
              <span>📍 {portfolio.location}</span>
            )}
            {portfolio.website && (
              <span>🌐 {portfolio.website}</span>
            )}
            {portfolio.github && (
              <span>💻 {portfolio.github}</span>
            )}
            {portfolio.linkedin && (
              <span>🔗 {portfolio.linkedin}</span>
            )}
          </div>
        </div>

        {/* Summary/Bio Section */}
        {portfolio.bio && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-2 pb-1 border-b border-gray-400"
              style={{ color: "#1a1a1a" }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-800 text-justify">{portfolio.bio}</p>
          </div>
        )}

        {/* Skills Section */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-2 pb-1 border-b border-gray-400"
              style={{ color: "#1a1a1a" }}
            >
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 rounded text-sm text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b border-gray-400"
              style={{ color: "#1a1a1a" }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-4">
              {portfolio.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700 italic">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-800 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b border-gray-400"
              style={{ color: "#1a1a1a" }}
            >
              PROJECTS
            </h2>
            <div className="space-y-4">
              {portfolio.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-sm text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-800 text-sm mb-1">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Technologies:</span>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {portfolio.education && portfolio.education.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3 pb-1 border-b border-gray-400"
              style={{ color: "#1a1a1a" }}
            >
              EDUCATION
            </h2>
            <div className="space-y-4">
              {portfolio.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-gray-700 italic">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Resume.displayName = "Resume";
