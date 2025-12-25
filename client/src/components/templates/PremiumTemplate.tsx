import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPortfolio } from "@shared/schema";
import {
    Github,
    ChevronLeft,
    ChevronRight,
    Youtube,
} from "lucide-react";
import { useState } from "react";

interface PremiumTemplateProps {
    portfolio: PublicPortfolio;
    getInitials: (name: string) => string;
    copied: boolean;
    onCopyUrl: () => void;
}

export function PremiumTemplate({ portfolio, getInitials }: PremiumTemplateProps) {
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

    const projects = portfolio.projects || [];
    const achievements = portfolio.experience || [];

    // Calculate stats
    const monthsOfExperience = achievements.length > 0 ? achievements.length * 6 : 0;
    const internshipsCompleted = achievements.filter(exp =>
        exp.position.toLowerCase().includes('intern')
    ).length;
    const projectsCompleted = projects.length;
    const skillsCount = (portfolio.skills || []).length;

    // Categorize skills (simplified - you can enhance this logic)
    const allSkills = portfolio.skills || [];
    const technicalSkills = allSkills.slice(0, Math.ceil(allSkills.length / 2));
    const tools = allSkills.slice(Math.ceil(allSkills.length / 2));
    const softSkills = ["Time Management", "Communication", "Leadership", "Problem Solving", "Solution Orientated Approach"];

    const nextProject = () => {
        setCurrentProjectIndex((prev) => (prev + 1) % Math.max(projects.length, 1));
    };

    const prevProject = () => {
        setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % Math.max(projects.length, 1));
    };

    const nextAchievement = () => {
        setCurrentAchievementIndex((prev) => (prev + 1) % Math.max(achievements.length, 1));
    };

    const prevAchievement = () => {
        setCurrentAchievementIndex((prev) => (prev - 1 + achievements.length) % Math.max(achievements.length, 1));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
                {/* Greeting Badge */}
                <div className="mb-8 animate-fade-in">
                    <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                        Hello, I'm {portfolio.user.name.split(' ')[0]} 👋
                    </Badge>
                </div>

                {/* Main Headline */}
                <h1 className="mb-4 text-center text-5xl font-bold leading-tight md:text-7xl animate-fade-in-up">
                    Hi Everyone, I'm{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        {portfolio.user.name}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mb-8 text-center text-2xl font-semibold text-gray-300 md:text-4xl animate-fade-in-up animation-delay-200">
                    {portfolio.title || "Creating & Growing Every Day!"}
                </p>



                {/* Decorative 3D Element (Optional - using gradient orb) */}
                <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
            </section>

            {/* About Section */}
            <section id="about" className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Badge */}
                    <div className="mb-12 flex justify-center">
                        <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                            About
                        </Badge>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Profile Image */}
                        <div className="flex justify-center lg:justify-start">
                            <div className="relative h-96 w-80 overflow-hidden rounded-3xl">
                                {(portfolio as any).profilePicture ? (
                                    <img
                                        src={(portfolio as any).profilePicture}
                                        alt={portfolio.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-6xl font-bold">
                                        {getInitials(portfolio.user.name)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio and Stats */}
                        <div className="flex flex-col justify-center">
                            <h2 className="mb-4 text-3xl font-bold">
                                Hi Everyone! I'm
                                <br />
                                <span className="text-4xl">{portfolio.user.name}</span>
                            </h2>
                            <p className="mb-8 text-gray-400 leading-relaxed">
                                {portfolio.bio || "Passionate developer creating amazing experiences."}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-400">Months of Experience</p>
                                    <p className="text-4xl font-bold">{monthsOfExperience}+</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Internship Completed</p>
                                    <p className="text-4xl font-bold">{internshipsCompleted}+</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Projects Completed</p>
                                    <p className="text-4xl font-bold">{projectsCompleted}+</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">No of Skills</p>
                                    <p className="text-4xl font-bold">{skillsCount}+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    {/* Technical Skills */}
                    <div className="mb-8">
                        <div className="mb-4 flex justify-center">
                            <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                                Skills
                            </Badge>
                        </div>
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-3 px-4">
                                {technicalSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tools/Software */}
                    {tools.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex justify-center">
                                <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                                    Tools / Software
                                </Badge>
                            </div>
                            <div className="overflow-x-auto pb-4">
                                <div className="flex gap-3 px-4">
                                    {tools.map((tool, index) => (
                                        <Badge
                                            key={index}
                                            className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm"
                                        >
                                            {tool}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Soft Skills */}
                    <div>
                        <div className="mb-4 flex justify-center">
                            <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                                Soft Skills
                            </Badge>
                        </div>
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-3 px-4">
                                {softSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            {projects.length > 0 && (
                <section id="projects" className="px-4 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-12 flex justify-center">
                            <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                                Projects
                            </Badge>
                        </div>

                        <h2 className="mb-12 text-center text-4xl font-bold">
                            My Latest <span className="text-gray-400">Projects</span>
                        </h2>

                        {/* Project Carousel */}
                        <div className="relative">
                            <div className="grid gap-6 md:grid-cols-3">
                                {projects.slice(currentProjectIndex, currentProjectIndex + 3).map((project, idx) => (
                                    <div
                                        key={project.id}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/30"
                                    >
                                        {/* Project Logo/Title */}
                                        <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-white">
                                            <h3 className="text-2xl font-bold text-black">{project.title}</h3>
                                        </div>

                                        {/* Project Title */}
                                        <h3 className="mb-2 text-xl font-bold">{project.title}</h3>

                                        {/* Description */}
                                        <p className="mb-4 text-sm text-gray-400 line-clamp-3">{project.description}</p>

                                        {/* Tech Stack */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {project.technologies.slice(0, 4).map((tech, techIdx) => (
                                                    <Badge
                                                        key={techIdx}
                                                        className="rounded-full border-yellow-500/50 bg-yellow-500/10 text-xs text-yellow-500"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            {project.link && (
                                                <Button
                                                    size="sm"
                                                    className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700"
                                                    asChild
                                                >
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                        <Github className="mr-1 h-4 w-4" />
                                                        GitHub
                                                    </a>
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                className="flex-1 rounded-full bg-red-600 hover:bg-red-700"
                                                asChild
                                            >
                                                <a href={project.link || "#"} target="_blank" rel="noopener noreferrer">
                                                    <Youtube className="mr-1 h-4 w-4" />
                                                    YouTube
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            {projects.length > 3 && (
                                <>
                                    <button
                                        onClick={prevProject}
                                        className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextProject}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
                <section id="achievements" className="px-4 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-12 flex justify-center">
                            <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                                Achievements
                            </Badge>
                        </div>

                        <h2 className="mb-12 text-center text-4xl font-bold">
                            My <span className="text-gray-400">Achievements</span>
                        </h2>

                        {/* Achievement Carousel */}
                        <div className="relative">
                            <div className="grid gap-6 md:grid-cols-3">
                                {achievements.slice(currentAchievementIndex, currentAchievementIndex + 3).map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/30"
                                    >
                                        {/* Achievement Image Placeholder */}
                                        <div className="h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-bold">{achievement.position}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-4">
                                                {achievement.description || `Worked at ${achievement.company} from ${achievement.startDate} to ${achievement.current ? 'Present' : achievement.endDate}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            {achievements.length > 3 && (
                                <>
                                    <button
                                        onClick={prevAchievement}
                                        className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextAchievement}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">
                        Built with{" "}
                        <a href="/" className="text-purple-400 hover:underline">
                            PortfolioHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
