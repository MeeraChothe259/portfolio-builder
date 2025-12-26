import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPortfolio } from "@shared/schema";
import {
    Github,
    Linkedin,
    Twitter,
    ExternalLink,
    Briefcase,
    Code,
} from "lucide-react";

interface ModernTemplateProps {
    portfolio: PublicPortfolio;
    getInitials: (name: string) => string;
    copied: boolean;
    onCopyUrl: () => void;
}

export function ModernTemplate({ portfolio, getInitials }: ModernTemplateProps) {
    const projects = portfolio.projects || [];
    const achievements = portfolio.experience || [];
    const skills = portfolio.skills || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Hero Section - Glass Morphism */}
            <section className="relative min-h-screen px-6 py-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNi0yLjY4NiA2LTYtMi42ODYtNi02LTYtNiAyLjY4Ni02IDYgMi42ODYgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

                <div className="container relative mx-auto max-w-6xl">
                    <div className="flex min-h-[80vh] items-center">
                        <div className="w-full">
                            {/* Glass Card */}
                            <div className="rounded-3xl border border-white/20 bg-white/40 p-12 shadow-2xl backdrop-blur-xl">
                                <div className="mb-8 inline-block rounded-full border border-amber-200 bg-amber-100/50 px-4 py-2 backdrop-blur-sm">
                                    <span className="text-sm font-medium text-amber-800">Modern Portfolio</span>
                                </div>

                                <h1 className="mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-7xl font-bold text-transparent md:text-8xl">
                                    {portfolio.user.name}
                                </h1>

                                <p className="mb-8 text-2xl font-medium text-gray-700">
                                    {portfolio.title || "Modern Professional"}
                                </p>

                                {portfolio.bio && (
                                    <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                                        {portfolio.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section - Glass Cards Grid */}
            {skills.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-12 flex items-center gap-3">
                            <Code className="h-8 w-8 text-amber-600" />
                            <h2 className="text-4xl font-bold text-gray-900">Skills</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-lg transition-all hover:scale-105 hover:bg-white/80"
                                >
                                    <p className="text-center font-semibold text-gray-800">{skill}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section - Glass Cards */}
            {projects.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-12 flex items-center gap-3">
                            <Briefcase className="h-8 w-8 text-amber-600" />
                            <h2 className="text-4xl font-bold text-gray-900">Projects</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-lg transition-all hover:scale-[1.02] hover:bg-white/80"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 text-amber-600 transition-transform hover:scale-110"
                                            >
                                                <ExternalLink className="h-6 w-6" />
                                            </a>
                                        )}
                                    </div>

                                    <p className="mb-6 text-gray-600">{project.description}</p>

                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, techIdx) => (
                                                <span
                                                    key={techIdx}
                                                    className="rounded-full border border-amber-200 bg-amber-100/50 px-3 py-1 text-sm text-amber-800 backdrop-blur-sm"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section - Glass Timeline */}
            {achievements.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-12 text-4xl font-bold text-gray-900">Experience</h2>

                        <div className="space-y-6">
                            {achievements.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="rounded-3xl border border-white/20 bg-white/60 p-8 shadow-lg backdrop-blur-lg transition-all hover:bg-white/80"
                                >
                                    <div className="mb-3 flex items-baseline justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900">{exp.position}</h3>
                                        <span className="text-sm font-medium text-gray-500">
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="mb-3 text-lg font-medium text-amber-600">{exp.company}</p>
                                    {exp.description && (
                                        <p className="text-gray-600">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Connect with Me Section */}
            {(portfolio.github || portfolio.linkedin || portfolio.twitter) && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-12 text-4xl font-bold text-gray-900">Let's Connect</h2>

                        <div className="flex gap-4">
                            {portfolio.github && (
                                <a
                                    href={portfolio.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/60 shadow-lg backdrop-blur-lg transition-all hover:scale-110 hover:bg-white/80"
                                >
                                    <Github className="h-8 w-8 text-gray-700 transition-colors group-hover:text-amber-600" />
                                </a>
                            )}
                            {portfolio.linkedin && (
                                <a
                                    href={portfolio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/60 shadow-lg backdrop-blur-lg transition-all hover:scale-110 hover:bg-white/80"
                                >
                                    <Linkedin className="h-8 w-8 text-gray-700 transition-colors group-hover:text-amber-600" />
                                </a>
                            )}
                            {portfolio.twitter && (
                                <a
                                    href={portfolio.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/60 shadow-lg backdrop-blur-lg transition-all hover:scale-110 hover:bg-white/80"
                                >
                                    <Twitter className="h-8 w-8 text-gray-700 transition-colors group-hover:text-amber-600" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-amber-200 bg-white/50 py-8 backdrop-blur">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-600">
                        Built with{" "}
                        <a href="/" className="font-semibold text-amber-600 hover:underline">
                            PortfolioHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
