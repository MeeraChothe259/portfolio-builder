import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPortfolio, Achievement } from "@shared/schema";
import {
  Github,
  Linkedin,
  Twitter,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Terminal,
  Mouse,
} from "lucide-react";
import { useState } from "react";

interface DeveloperTemplateProps {
  portfolio: PublicPortfolio;
  getInitials: (name: string) => string;
  copied: boolean;
  onCopyUrl: () => void;
}

export function DeveloperTemplate({ portfolio, getInitials }: DeveloperTemplateProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const projects = portfolio.projects || [];
  const achievements = (portfolio as any).achievements || [];

  // Calculate stats
  const monthsOfExperience = portfolio.experience?.length || 0;
  const internshipsCompleted = portfolio.experience?.filter((exp: any) =>
    exp.position.toLowerCase().includes('intern')
  ).length || 0;
  const projectsCompleted = projects.length;
  const skillsCount = (portfolio.skills || []).length;

  // Categorize skills
  const allSkills = portfolio.skills || [];
  const technicalSkills = allSkills.slice(0, Math.ceil(allSkills.length / 2));
  const tools = allSkills.slice(Math.ceil(allSkills.length / 2));
  const softSkills = ["Problem Solving", "Team Collaboration", "Code Review", "Agile Development", "Technical Documentation"];

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

  // Ensure marquee has enough items for consistent speed
  const getMarqueeItems = (items: string[]) => {
    if (!items || items.length === 0) return [];
    // Target ~20 items minimum to ensure the container is wide enough for the fixed animation duration
    // This makes the speed roughly consistent regardless of the number of unique skills
    const minItems = 20;
    const repeats = Math.ceil(minItems / items.length);
    return Array(repeats).fill(items).flat();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 z-10 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Greeting Badge */}
        <div className="mb-8 animate-fade-in relative">
          <Badge className="bg-white/5 px-6 py-2 text-sm font-normal text-emerald-300 backdrop-blur-md border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Terminal className="mr-2 inline h-4 w-4" />
            Hello, I'm {portfolio.user.name.split(' ')[0]} 👋
          </Badge>
        </div>

        {/* Main Headline */}
        <h1 className="mb-6 text-center text-5xl font-bold leading-tight md:text-8xl animate-fade-in-up tracking-tight">
          Hi Everyone, I'm{" "}
          <br className="md:hidden" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            {portfolio.user.name}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-center text-xl font-medium text-gray-400 md:text-3xl animate-fade-in-up animation-delay-200 max-w-3xl leading-relaxed">
          {portfolio.title || "Building Amazing Software Every Day!"}
        </p>

        {/* Call to Actions - Optional enhancement */}
        <div className="flex gap-4 animate-fade-in-up animation-delay-300 z-20">
          <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg shadow-lg shadow-emerald-900/20 transition-all hover:scale-105" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View Work
          </Button>
          <Button variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-lg backdrop-blur-sm transition-all hover:scale-105" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            More About Me
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Professional Scroll Indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500/60 group-hover:text-emerald-400 transition-colors">Scroll</span>
          <div className="h-10 w-6 rounded-full border border-emerald-500/30 bg-emerald-500/5 p-1 backdrop-blur-sm group-hover:border-emerald-500/50 transition-colors">
            <div className="h-1.5 w-full rounded-full bg-emerald-500/50 animate-bounce group-hover:bg-emerald-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
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
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-6xl font-bold">
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
              <p className="mb-8 leading-relaxed text-gray-400">
                {portfolio.bio || "Passionate developer creating amazing software experiences."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Months of Experience</p>
                  <p className="text-4xl font-bold text-emerald-400">{monthsOfExperience}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Internship Completed</p>
                  <p className="text-4xl font-bold text-emerald-400">{internshipsCompleted}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Projects Completed</p>
                  <p className="text-4xl font-bold text-emerald-400">{projectsCompleted}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">No of Skills</p>
                  <p className="text-4xl font-bold text-emerald-400">{skillsCount}+</p>
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
                Technical Skills
              </Badge>
            </div>
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll">
                {getMarqueeItems(technicalSkills).map((skill, index) => (
                  <Badge
                    key={index}
                    className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 text-sm font-normal text-emerald-400 backdrop-blur-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll" aria-hidden="true">
                {getMarqueeItems(technicalSkills).map((skill, index) => (
                  <Badge
                    key={`dup-${index}`}
                    className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 text-sm font-normal text-emerald-400 backdrop-blur-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tools */}
          {tools.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex justify-center">
                <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                  Tools & Frameworks
                </Badge>
              </div>
              <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll">
                  {getMarqueeItems(tools).map((tool, index) => (
                    <Badge
                      key={index}
                      className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll" aria-hidden="true">
                  {getMarqueeItems(tools).map((tool, index) => (
                    <Badge
                      key={`dup-${index}`}
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
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll">
                {getMarqueeItems(softSkills).map((skill, index) => (
                  <Badge
                    key={index}
                    className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start [&_span]:mx-2 animate-scroll" aria-hidden="true">
                {getMarqueeItems(softSkills).map((skill, index) => (
                  <Badge
                    key={`dup-${index}`}
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
          {projects.length > 0 ? (
            <div className="relative">
              <div className="grid gap-6 md:grid-cols-3">
                {projects.slice(currentProjectIndex, currentProjectIndex + 3).map((project) => (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/50"
                  >
                    {/* Project Image */}
                    <div className="mb-4 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <h3 className="text-2xl font-bold">{project.title}</h3>
                        </div>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>

                    {/* Description */}
                    <p className="mb-4 line-clamp-3 text-sm text-gray-400">{project.description}</p>

                    {/* Tech Stack */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech, techIdx) => (
                          <Badge
                            key={techIdx}
                            className="rounded-full border-emerald-500/50 bg-emerald-500/10 text-xs text-emerald-400"
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
                          className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700"
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
                        className="flex-1 rounded-full bg-gray-700 hover:bg-gray-600"
                        asChild
                      >
                        <a href={project.link || "#"} target="_blank" rel="noopener noreferrer">
                          <Youtube className="mr-1 h-4 w-4" />
                          Demo
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
          ) : (
            <div className="text-center text-gray-400">
              <p>No projects added yet.</p>
            </div>
          )}
        </div>
      </section>

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
                {achievements.slice(currentAchievementIndex, currentAchievementIndex + 3).map((achievement: Achievement) => (
                  <div
                    key={achievement.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-emerald-500/50"
                  >
                    {/* Achievement Image */}
                    <div className="h-48 overflow-hidden">
                      {achievement.image ? (
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-emerald-600/20 to-teal-600/20 flex items-center justify-center">
                          <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                            <p className="text-sm text-gray-400">{achievement.issuer}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold">{achievement.title}</h3>
                      {achievement.issuer && (
                        <p className="mb-2 text-sm text-emerald-400">{achievement.issuer}</p>
                      )}
                      <p className="mb-2 text-sm text-gray-500">{achievement.date}</p>
                      <p className="line-clamp-3 text-sm text-gray-400">
                        {achievement.description}
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

      {/* Connect with Me Section */}
      {(portfolio.github || portfolio.linkedin || portfolio.twitter) && (
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex justify-center">
              <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
                Connect with Me
              </Badge>
            </div>

            <h2 className="mb-12 text-center text-4xl font-bold">
              Let's <span className="text-emerald-400">Connect</span>
            </h2>

            <div className="flex justify-center gap-6">
              {portfolio.github && (
                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  <Github className="h-8 w-8 text-white transition-colors group-hover:text-emerald-400" />
                </a>
              )}
              {portfolio.linkedin && (
                <a
                  href={portfolio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  <Linkedin className="h-8 w-8 text-white transition-colors group-hover:text-emerald-400" />
                </a>
              )}
              {portfolio.twitter && (
                <a
                  href={portfolio.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  <Twitter className="h-8 w-8 text-white transition-colors group-hover:text-emerald-400" />
                </a>
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
            <a href="/" className="text-emerald-400 hover:underline">
              PortfolioHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
