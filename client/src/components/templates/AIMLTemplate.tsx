import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicPortfolio } from "@shared/schema";
import {
  Github,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Brain,
} from "lucide-react";
import { useState } from "react";

interface AIMLTemplateProps {
  portfolio: PublicPortfolio;
  getInitials: (name: string) => string;
  copied: boolean;
  onCopyUrl: () => void;
}

export function AIMLTemplate({ portfolio, getInitials }: AIMLTemplateProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const projects = portfolio.projects || [];
  const achievements = portfolio.experience || [];

  const monthsOfExperience = achievements.length > 0 ? achievements.length * 6 : 0;
  const internshipsCompleted = achievements.filter(exp =>
    exp.position.toLowerCase().includes('intern')
  ).length;
  const projectsCompleted = projects.length;
  const skillsCount = (portfolio.skills || []).length;

  const allSkills = portfolio.skills || [];
  const technicalSkills = allSkills.slice(0, Math.ceil(allSkills.length / 2));
  const tools = allSkills.slice(Math.ceil(allSkills.length / 2));
  const softSkills = ["Research", "Model Training", "Data Analysis", "Algorithm Design", "Innovation"];

  const nextProject = () => setCurrentProjectIndex((prev) => (prev + 1) % Math.max(projects.length, 1));
  const prevProject = () => setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % Math.max(projects.length, 1));
  const nextAchievement = () => setCurrentAchievementIndex((prev) => (prev + 1) % Math.max(achievements.length, 1));
  const prevAchievement = () => setCurrentAchievementIndex((prev) => (prev - 1 + achievements.length) % Math.max(achievements.length, 1));

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="mb-8 animate-fade-in">
          <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">
            <Brain className="mr-2 inline h-4 w-4" />
            Hello, I'm {portfolio.user.name.split(' ')[0]} 👋
          </Badge>
        </div>
        <h1 className="mb-4 text-center text-5xl font-bold leading-tight md:text-7xl animate-fade-in-up">
          Hi Everyone, I'm{" "}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            {portfolio.user.name}
          </span>
        </h1>
        <p className="mb-8 text-center text-2xl font-semibold text-gray-300 md:text-4xl animate-fade-in-up animation-delay-200">
          {portfolio.title || "Building Intelligent Systems with AI & ML!"}
        </p>

        <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl" />
      </section>

      <section id="about" className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 flex justify-center">
            <Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">About</Badge>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-96 w-80 overflow-hidden rounded-3xl">
                {(portfolio as any).profilePicture ? (
                  <img src={(portfolio as any).profilePicture} alt={portfolio.user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-6xl font-bold">
                    {getInitials(portfolio.user.name)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="mb-4 text-3xl font-bold">Hi Everyone! I'm<br /><span className="text-4xl">{portfolio.user.name}</span></h2>
              <p className="mb-8 leading-relaxed text-gray-400">{portfolio.bio || "AI/ML engineer building intelligent systems."}</p>
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-sm text-gray-400">Months of Experience</p><p className="text-4xl font-bold text-purple-400">{monthsOfExperience}+</p></div>
                <div><p className="text-sm text-gray-400">Internship Completed</p><p className="text-4xl font-bold text-purple-400">{internshipsCompleted}+</p></div>
                <div><p className="text-sm text-gray-400">ML Projects</p><p className="text-4xl font-bold text-purple-400">{projectsCompleted}+</p></div>
                <div><p className="text-sm text-gray-400">No of Skills</p><p className="text-4xl font-bold text-purple-400">{skillsCount}+</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-4 flex justify-center"><Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">AI/ML Skills</Badge></div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 px-4">
                {technicalSkills.map((skill, index) => (
                  <Badge key={index} className="whitespace-nowrap rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm font-normal text-purple-400 backdrop-blur-sm">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
          {tools.length > 0 && (
            <div className="mb-8">
              <div className="mb-4 flex justify-center"><Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">Frameworks & Tools</Badge></div>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-3 px-4">
                  {tools.map((tool, index) => (
                    <Badge key={index} className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm">{tool}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="mb-4 flex justify-center"><Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">Soft Skills</Badge></div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 px-4">
                {softSkills.map((skill, index) => (
                  <Badge key={index} className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-normal text-white backdrop-blur-sm">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section id="projects" className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex justify-center"><Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">Projects</Badge></div>
            <h2 className="mb-12 text-center text-4xl font-bold">My Latest <span className="text-gray-400">ML Projects</span></h2>
            <div className="relative">
              <div className="grid gap-6 md:grid-cols-3">
                {projects.slice(currentProjectIndex, currentProjectIndex + 3).map((project) => (
                  <div key={project.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-purple-500/50">
                    <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20"><h3 className="text-2xl font-bold">{project.title}</h3></div>
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-400">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech, techIdx) => (
                          <Badge key={techIdx} className="rounded-full border-purple-500/50 bg-purple-500/10 text-xs text-purple-400">{tech}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.link && (<Button size="sm" className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700" asChild><a href={project.link} target="_blank" rel="noopener noreferrer"><Github className="mr-1 h-4 w-4" />GitHub</a></Button>)}
                      <Button size="sm" className="flex-1 rounded-full bg-gray-700 hover:bg-gray-600" asChild><a href={project.link || "#"} target="_blank" rel="noopener noreferrer"><Youtube className="mr-1 h-4 w-4" />Demo</a></Button>
                    </div>
                  </div>
                ))}
              </div>
              {projects.length > 3 && (
                <>
                  <button onClick={prevProject} className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
                  <button onClick={nextProject} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section id="achievements" className="px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex justify-center"><Badge className="bg-white/10 px-4 py-2 text-sm font-normal text-white backdrop-blur-sm border-white/20">Achievements</Badge></div>
            <h2 className="mb-12 text-center text-4xl font-bold">My <span className="text-gray-400">Achievements</span></h2>
            <div className="relative">
              <div className="grid gap-6 md:grid-cols-3">
                {achievements.slice(currentAchievementIndex, currentAchievementIndex + 3).map((achievement) => (
                  <div key={achievement.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-purple-500/50">
                    <div className="h-48 bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold">{achievement.position}</h3>
                      <p className="line-clamp-4 text-sm text-gray-400">{achievement.description || `Worked at ${achievement.company} from ${achievement.startDate} to ${achievement.current ? 'Present' : achievement.endDate}`}</p>
                    </div>
                  </div>
                ))}
              </div>
              {achievements.length > 3 && (
                <>
                  <button onClick={prevAchievement} className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
                  <button onClick={nextAchievement} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full bg-white/10 p-3 backdrop-blur-sm hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Built with <a href="/" className="text-purple-400 hover:underline">PortfolioHub</a></p>
        </div>
      </footer>
    </div>
  );
}
