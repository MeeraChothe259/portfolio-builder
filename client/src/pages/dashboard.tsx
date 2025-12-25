import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio } from "@shared/schema";
import { generateSimpleResumePDF } from "@/lib/resume-generator";
import { AIMentorSection } from "@/components/ai-mentor-section";
import {
  Pencil,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Code2,
  Copy,
  Check,
  Plus,
  User,
  Brain,
  Lightbulb,
  Download,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.getMyPortfolio();
        setPortfolio(data);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const portfolioUrl = `${window.location.origin}/portfolio/${user?.username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Portfolio URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const downloadResume = async () => {
    if (!portfolio || !user) return;
    
    setIsGeneratingPDF(true);
    try {
      generateSimpleResumePDF({
        portfolio,
        userName: user.name,
      });
      toast({
        title: "Resume downloaded!",
        description: "Your resume PDF has been generated successfully.",
      });
    } catch (error) {
      console.error("Failed to generate resume:", error);
      toast({
        title: "Failed to generate resume",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      icon: FolderKanban,
      label: "Projects",
      value: portfolio?.projects?.length ?? 0,
    },
    {
      icon: Code2,
      label: "Skills",
      value: portfolio?.skills?.length ?? 0,
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: portfolio?.education?.length ?? 0,
    },
    {
      icon: Briefcase,
      label: "Experience",
      value: portfolio?.experience?.length ?? 0,
    },
  ];

  function getCompletionScore(p: Portfolio | null): { score: number; level: string } {
    if (!p) return { score: 0, level: "Getting started" };
    let score = 0;
    if (p.bio) score += 20;
    if (p.title) score += 10;
    if (p.location) score += 5;
    const skillsCount = p.skills?.length ?? 0;
    if (skillsCount >= 3) score += 10;
    if (skillsCount >= 6) score += 10;
    const projectsCount = p.projects?.length ?? 0;
    if (projectsCount >= 1) score += 15;
    if (projectsCount >= 3) score += 10;
    if ((p.education?.length ?? 0) > 0) score += 10;
    if ((p.experience?.length ?? 0) > 0) score += 10;
    if (p.github || p.linkedin || p.website) score += 10;
    if (score >= 80) return { score: Math.min(score, 100), level: "Job‑ready" };
    if (score >= 50) return { score, level: "In progress" };
    return { score, level: "Getting started" };
  }

  type IntelligenceSuggestion = {
    id: string;
    title: string;
    description: string;
    estimatedImpact: string;
  };

  function getIntelligenceSuggestions(p: Portfolio | null): IntelligenceSuggestion[] {
    const suggestions: IntelligenceSuggestion[] = [];
    if (!p) {
      suggestions.push({
        id: "create-portfolio",
        title: "Create your first portfolio entries",
        description: "Add your bio, at least 3 skills, and 1 project to unlock your public profile.",
        estimatedImpact: "+30% strength",
      });
      return suggestions;
    }
    const role = (p as any).role || "developer";
    const skills = p.skills ?? [];
    const projects = p.projects ?? [];
    if (!p.bio) {
      suggestions.push({
        id: "add-bio",
        title: "Add a compelling bio",
        description: "Write 3‑4 lines summarizing who you are and what you do.",
        estimatedImpact: "+15% interest",
      });
    }
    if (skills.length < 5) {
      suggestions.push({
        id: "add-skills",
        title: "Strengthen skills",
        description: "Aim for at least 5–8 focused skills.",
        estimatedImpact: "+10% match",
      });
    }
    if (projects.length === 0) {
      suggestions.push({
        id: "add-projects",
        title: "Show a project",
        description: "Add a project that demonstrates problem‑solving.",
        estimatedImpact: "+20% impact",
      });
    }
    if (!p.github && (role === "developer" || role === "ai_ml")) {
      suggestions.push({
        id: "add-github",
        title: "Link GitHub",
        description: "Teams scan GitHub for coding style.",
        estimatedImpact: "+10% visibility",
      });
    }
    return suggestions.slice(0, 4);
  }

  const { score: completionScore, level: completionLevel } = getCompletionScore(portfolio);
  const intelligenceSuggestions = getIntelligenceSuggestions(portfolio);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-24" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link href="/edit-portfolio"><Pencil className="mr-2 h-4 w-4" />Edit Portfolio</Link></Button>
          <Button variant="outline" asChild><Link href={`/portfolio/${user?.username}`}><ExternalLink className="mr-2 h-4 w-4" />View Portfolio</Link></Button>
          <Button variant="outline" onClick={downloadResume} disabled={isGeneratingPDF || !portfolio}>
            <Download className="mr-2 h-4 w-4" />{isGeneratingPDF ? "Generating..." : "Download Resume"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Portfolio URL</CardTitle>
              <CardDescription>Share this link on your resume and social profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded-lg bg-muted px-4 py-2.5 font-mono text-sm"><span>{portfolioUrl}</span></div>
                <Button variant="outline" onClick={copyToClipboard}>{copied ? <><Check className="mr-2 h-4 w-4" />Copied!</> : <><Copy className="mr-2 h-4 w-4" />Copy</>}</Button>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-portfolio-intelligence">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg"><Brain className="h-5 w-5 text-primary" />Portfolio Intelligence</CardTitle>
                <CardDescription>Smart hints to make your portfolio more job‑ready.</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold">{completionLevel}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm"><span>Completion score</span><span className="font-semibold">{completionScore}%</span></div>
                <Progress value={completionScore} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">Heuristic estimates to guide you—not real placement probabilities.</p>
              </div>
              {intelligenceSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex gap-3 rounded-md border bg-muted/40 p-3">
                  <div className="mt-1"><Lightbulb className="h-4 w-4 text-primary" /></div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{suggestion.title}</p>
                      <span className="text-xs font-semibold text-primary">{suggestion.estimatedImpact}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {stats.map((stat, index) => (
              <Card key={index}><CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><stat.icon className="h-6 w-6 text-primary" /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
              </CardContent></Card>
            ))}
          </div>

          {!portfolio?.bio && !portfolio?.skills?.length && !portfolio?.projects?.length ? (
            <Card className="text-center"><CardContent className="py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"><User className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="mb-2 text-xl font-semibold">Your portfolio is empty</h3>
              <p className="mb-6 text-muted-foreground">Start building by adding bio, skills, projects, and experience.</p>
              <Button asChild><Link href="/edit-portfolio"><Plus className="mr-2 h-4 w-4" />Start Building</Link></Button>
            </CardContent></Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1">
              {portfolio?.bio && <Card><CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader><CardContent><p className="text-muted-foreground line-clamp-4">{portfolio.bio}</p></CardContent></Card>}
              {portfolio?.projects && portfolio.projects.length > 0 && (
                <Card><CardHeader><CardTitle className="text-lg">Recent Projects</CardTitle></CardHeader><CardContent><div className="space-y-3">{portfolio.projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div><p className="font-medium">{project.title}</p><p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p></div>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><ExternalLink className="h-4 w-4" /></a>}
                  </div>
                ))}</div></CardContent></Card>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AIMentorSection portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
}