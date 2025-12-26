import { Badge } from "@/components/ui/badge";
import type { PublicPortfolio } from "@shared/schema";
import {
    Github,
    Linkedin,
    Twitter,
} from "lucide-react";

interface MinimalTemplateProps {
    portfolio: PublicPortfolio;
    getInitials: (name: string) => string;
    copied: boolean;
    onCopyUrl: () => void;
}

export function MinimalTemplate({ portfolio, getInitials }: MinimalTemplateProps) {
    const projects = portfolio.projects || [];
    const achievements = portfolio.experience || [];
    const education = portfolio.education || [];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section - Minimal & Clean */}
            <section className="container mx-auto max-w-3xl px-6 py-24">
                <div className="space-y-2">
                    <p className="text-sm uppercase tracking-widest text-gray-500">Portfolio</p>
                    <h1 className="text-6xl font-light tracking-tight md:text-7xl">
                        {portfolio.user.name}
                    </h1>
                    <p className="text-xl text-gray-600 font-light">
                        {portfolio.title || "Creative Professional"}
                    </p>
                </div>
            </section>

            {/* About Section */}
            {portfolio.bio && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-8 text-sm uppercase tracking-widest text-gray-500">About</h2>
                        <p className="text-2xl font-light leading-relaxed text-gray-700">
                            {portfolio.bio}
                        </p>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {portfolio.skills && portfolio.skills.length > 0 && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-8 text-sm uppercase tracking-widest text-gray-500">Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {portfolio.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-12 text-sm uppercase tracking-widest text-gray-500">Selected Work</h2>
                        <div className="space-y-16">
                            {projects.map((project, index) => (
                                <div key={project.id} className="group">
                                    <div className="mb-3 flex items-baseline justify-between">
                                        <h3 className="text-3xl font-light">{project.title}</h3>
                                        <span className="text-sm text-gray-400">0{index + 1}</span>
                                    </div>
                                    <p className="mb-4 text-lg text-gray-600 font-light leading-relaxed">
                                        {project.description}
                                    </p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, techIdx) => (
                                                <span key={techIdx} className="text-xs text-gray-500">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-block text-sm text-emerald-600 hover:text-emerald-700"
                                        >
                                            View Project →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {achievements.length > 0 && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-12 text-sm uppercase tracking-widest text-gray-500">Experience</h2>
                        <div className="space-y-10">
                            {achievements.map((exp) => (
                                <div key={exp.id}>
                                    <div className="mb-2 flex items-baseline justify-between">
                                        <h3 className="text-xl font-light">{exp.position}</h3>
                                        <span className="text-sm text-gray-500">
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="mb-2 text-gray-600">{exp.company}</p>
                                    {exp.description && (
                                        <p className="text-gray-600 font-light">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Education Section */}
            {education.length > 0 && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-12 text-sm uppercase tracking-widest text-gray-500">Education</h2>
                        <div className="space-y-10">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="mb-2 flex items-baseline justify-between">
                                        <h3 className="text-xl font-light">{edu.institution}</h3>
                                        <span className="text-sm text-gray-500">
                                            {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Connect with Me Section */}
            {(portfolio.github || portfolio.linkedin || portfolio.twitter) && (
                <section className="border-t border-gray-200 py-20">
                    <div className="container mx-auto max-w-3xl px-6">
                        <h2 className="mb-8 text-sm uppercase tracking-widest text-gray-500">Connect</h2>
                        <div className="flex gap-4">
                            {portfolio.github && (
                                <a
                                    href={portfolio.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                                >
                                    <Github className="h-5 w-5 text-gray-700" />
                                </a>
                            )}
                            {portfolio.linkedin && (
                                <a
                                    href={portfolio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                                >
                                    <Linkedin className="h-5 w-5 text-gray-700" />
                                </a>
                            )}
                            {portfolio.twitter && (
                                <a
                                    href={portfolio.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                                >
                                    <Twitter className="h-5 w-5 text-gray-700" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8">
                <div className="container mx-auto max-w-3xl px-6 text-center">
                    <p className="text-sm text-gray-500">
                        Built with{" "}
                        <a href="/" className="text-emerald-600 hover:underline">
                            PortfolioHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
