import { Badge } from "@/components/ui/badge";
import type { PublicPortfolio } from "@shared/schema";
import {
    Github,
    Linkedin,
    Twitter,
    Mail,
    MapPin,
    Briefcase,
    GraduationCap,
    Code,
} from "lucide-react";

interface CompactTemplateProps {
    portfolio: PublicPortfolio;
    getInitials: (name: string) => string;
    copied: boolean;
    onCopyUrl: () => void;
}

export function CompactTemplate({ portfolio, getInitials }: CompactTemplateProps) {
    const projects = portfolio.projects || [];
    const achievements = portfolio.experience || [];
    const education = portfolio.education || [];
    const skills = portfolio.skills || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="sticky top-0 h-screen w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gradient-to-b from-teal-50 to-cyan-50 p-8">
                    {/* Profile */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-4xl font-bold text-white shadow-lg">
                            {(portfolio as any).profilePicture ? (
                                <img
                                    src={(portfolio as any).profilePicture}
                                    alt={portfolio.user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getInitials(portfolio.user.name)
                            )}
                        </div>
                        <h1 className="mb-2 text-2xl font-bold text-gray-900">{portfolio.user.name}</h1>
                        <p className="text-sm font-medium text-teal-600">{portfolio.title || "Professional"}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-8 space-y-3">
                        {portfolio.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-teal-600" />
                                <span>{portfolio.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    {(portfolio.github || portfolio.linkedin || portfolio.twitter) && (
                        <div className="mb-8">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Connect</h3>
                            <div className="flex gap-2">
                                {portfolio.github && (
                                    <a
                                        href={portfolio.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow transition-all hover:scale-110 hover:shadow-md"
                                    >
                                        <Github className="h-5 w-5 text-gray-700" />
                                    </a>
                                )}
                                {portfolio.linkedin && (
                                    <a
                                        href={portfolio.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow transition-all hover:scale-110 hover:shadow-md"
                                    >
                                        <Linkedin className="h-5 w-5 text-gray-700" />
                                    </a>
                                )}
                                {portfolio.twitter && (
                                    <a
                                        href={portfolio.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow transition-all hover:scale-110 hover:shadow-md"
                                    >
                                        <Twitter className="h-5 w-5 text-gray-700" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <Code className="h-4 w-4" />
                                Skills
                            </h3>
                            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)]">
                                <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll">
                                    {[...skills, ...skills, ...skills].map((skill, index) => (
                                        <span
                                            key={index}
                                            className="whitespace-nowrap rounded-md bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll" aria-hidden="true">
                                    {[...skills, ...skills, ...skills].map((skill, index) => (
                                        <span
                                            key={`dup-${index}`}
                                            className="whitespace-nowrap rounded-md bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-12">
                    <div className="mx-auto max-w-4xl">
                        {/* About */}
                        {portfolio.bio && (
                            <section className="mb-12">
                                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Briefcase className="h-6 w-6 text-teal-600" />
                                    About
                                </h2>
                                <div className="rounded-xl bg-white p-6 shadow-sm">
                                    <p className="leading-relaxed text-gray-700">{portfolio.bio}</p>
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {achievements.length > 0 && (
                            <section className="mb-12">
                                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Briefcase className="h-6 w-6 text-teal-600" />
                                    Experience
                                </h2>
                                <div className="space-y-4">
                                    {achievements.map((exp) => (
                                        <div key={exp.id} className="rounded-xl bg-white p-6 shadow-sm">
                                            <div className="mb-2 flex items-baseline justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                                </span>
                                            </div>
                                            <p className="mb-2 font-medium text-teal-600">{exp.company}</p>
                                            {exp.description && (
                                                <p className="text-sm text-gray-600">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects.length > 0 && (
                            <section className="mb-12">
                                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <Code className="h-6 w-6 text-teal-600" />
                                    Projects
                                </h2>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {projects.map((project) => (
                                        <div key={project.id} className="rounded-xl bg-white p-6 shadow-sm">
                                            <h3 className="mb-2 text-lg font-bold text-gray-900">{project.title}</h3>
                                            <p className="mb-3 text-sm text-gray-600">{project.description}</p>
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="mb-3 flex flex-wrap gap-1">
                                                    {project.technologies.map((tech, techIdx) => (
                                                        <span
                                                            key={techIdx}
                                                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                                                        >
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
                                                    className="text-sm font-medium text-teal-600 hover:underline"
                                                >
                                                    View Project →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className="mb-12">
                                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <GraduationCap className="h-6 w-6 text-teal-600" />
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="rounded-xl bg-white p-6 shadow-sm">
                                            <div className="mb-2 flex items-baseline justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Footer */}
                        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
                            <p className="text-sm text-gray-500">
                                Built with{" "}
                                <a href="/" className="font-medium text-teal-600 hover:underline">
                                    PortfolioHub
                                </a>
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
