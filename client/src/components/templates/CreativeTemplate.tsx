import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPortfolio } from "@shared/schema";
import {
    Github,
    Linkedin,
    Twitter,
    ExternalLink,
    Sparkles,
} from "lucide-react";

interface CreativeTemplateProps {
    portfolio: PublicPortfolio;
    getInitials: (name: string) => string;
    copied: boolean;
    onCopyUrl: () => void;
}

export function CreativeTemplate({ portfolio, getInitials }: CreativeTemplateProps) {
    const projects = portfolio.projects || [];
    const achievements = portfolio.experience || [];
    const skills = portfolio.skills || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Hero Section - Bold & Asymmetric */}
            <section className="relative min-h-screen overflow-hidden px-6 py-20">
                {/* Decorative Shapes */}
                <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />

                <div className="container relative mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Left Column - Text */}
                        <div className="flex flex-col justify-center space-y-8">
                            <div>
                                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    Creative Portfolio
                                </Badge>
                                <h1 className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-6xl font-black leading-tight text-transparent md:text-8xl">
                                    {portfolio.user.name}
                                </h1>
                                <p className="text-2xl font-medium text-gray-700">
                                    {portfolio.title || "Creative Professional"}
                                </p>
                            </div>

                            {portfolio.bio && (
                                <p className="text-lg leading-relaxed text-gray-600">
                                    {portfolio.bio}
                                </p>
                            )}
                        </div>

                        {/* Right Column - Profile Image */}
                        <div className="flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 blur-2xl" />
                                <div className="relative h-96 w-80 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl">
                                    {(portfolio as any).profilePicture ? (
                                        <img
                                            src={(portfolio as any).profilePicture}
                                            alt={portfolio.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-7xl font-bold text-white">
                                            {getInitials(portfolio.user.name)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section - Bento Box Style */}
            {skills.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="mb-12 text-5xl font-black">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Skills & Expertise
                            </span>
                        </h2>
                        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                            <div className="flex items-center justify-center md:justify-start [&_div]:mx-2 animate-scroll">
                                {[...skills, ...skills].map((skill, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl min-w-[200px]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                                        <p className="relative text-lg font-semibold text-gray-800 whitespace-nowrap text-center">{skill}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center md:justify-start [&_div]:mx-2 animate-scroll" aria-hidden="true">
                                {[...skills, ...skills].map((skill, index) => (
                                    <div
                                        key={`dup-${index}`}
                                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl min-w-[200px]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                                        <p className="relative text-lg font-semibold text-gray-800 whitespace-nowrap text-center">{skill}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section - Creative Grid */}
            {projects.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="mb-12 text-5xl font-black">
                            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                Featured Work
                            </span>
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all hover:scale-[1.02] ${index % 3 === 0 ? "md:col-span-2" : ""
                                        }`}
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                                    <div className="relative">
                                        <div className="mb-4 flex items-start justify-between">
                                            <h3 className="text-3xl font-bold text-gray-900">{project.title}</h3>
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0 text-purple-600 transition-transform hover:scale-110"
                                                >
                                                    <ExternalLink className="h-6 w-6" />
                                                </a>
                                            )}
                                        </div>

                                        <p className="mb-6 text-lg text-gray-600">{project.description}</p>

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map((tech, techIdx) => (
                                                    <Badge
                                                        key={techIdx}
                                                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section - Timeline */}
            {achievements.length > 0 && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="mb-12 text-5xl font-black">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Experience
                            </span>
                        </h2>
                        <div className="space-y-8">
                            {achievements.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
                                >
                                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500" />
                                    <div className="pl-6">
                                        <div className="mb-2 flex items-baseline justify-between">
                                            <h3 className="text-2xl font-bold text-gray-900">{exp.position}</h3>
                                            <span className="text-sm font-medium text-gray-500">
                                                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                            </span>
                                        </div>
                                        <p className="mb-3 text-lg font-medium text-purple-600">{exp.company}</p>
                                        {exp.description && (
                                            <p className="text-gray-600">{exp.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Connect with Me Section */}
            {(portfolio.github || portfolio.linkedin || portfolio.twitter) && (
                <section className="px-6 py-20">
                    <div className="container mx-auto max-w-7xl">
                        <h2 className="mb-12 text-5xl font-black">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Let's Connect
                            </span>
                        </h2>
                        <div className="flex gap-6">
                            {portfolio.github && (
                                <a
                                    href={portfolio.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg transition-all hover:scale-110 hover:shadow-2xl"
                                >
                                    <Github className="h-10 w-10 text-gray-700 transition-colors group-hover:text-purple-600" />
                                </a>
                            )}
                            {portfolio.linkedin && (
                                <a
                                    href={portfolio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg transition-all hover:scale-110 hover:shadow-2xl"
                                >
                                    <Linkedin className="h-10 w-10 text-gray-700 transition-colors group-hover:text-purple-600" />
                                </a>
                            )}
                            {portfolio.twitter && (
                                <a
                                    href={portfolio.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg transition-all hover:scale-110 hover:shadow-2xl"
                                >
                                    <Twitter className="h-10 w-10 text-gray-700 transition-colors group-hover:text-purple-600" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-purple-200 bg-white/50 py-8 backdrop-blur">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-600">
                        Built with{" "}
                        <a href="/" className="font-semibold text-purple-600 hover:underline">
                            PortfolioHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
