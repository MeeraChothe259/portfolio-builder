import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio } from "@shared/schema";
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
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-welcome">
              Welcome, {user?.name}!
            </h1>
            <p className="text-muted-foreground" data-testid="text-username">
              @{user?.username}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/edit-portfolio" data-testid="link-edit-portfolio">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Portfolio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={`/portfolio/${user?.username}`}
              data-testid="link-view-portfolio"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Portfolio
            </Link>
          </Button>
        </div>
      </div>

      {/* Portfolio URL Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Your Portfolio URL</CardTitle>
          <CardDescription>
            Share this link on your resume and social profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1 rounded-lg bg-muted px-4 py-2.5 font-mono text-sm">
              <span data-testid="text-portfolio-url">{portfolioUrl}</span>
            </div>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              data-testid="button-copy-url"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} data-testid={`card-stat-${stat.label.toLowerCase()}`}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Preview / Empty State */}
      {!portfolio?.bio && !portfolio?.skills?.length && !portfolio?.projects?.length ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold" data-testid="text-empty-state-title">
              Your portfolio is empty
            </h3>
            <p className="mb-6 text-muted-foreground">
              Start building your professional portfolio by adding your bio, skills,
              projects, and experience.
            </p>
            <Button asChild>
              <Link href="/edit-portfolio" data-testid="link-start-building">
                <Plus className="mr-2 h-4 w-4" />
                Start Building
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bio Preview */}
          {portfolio?.bio && (
            <Card data-testid="card-bio-preview">
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-4">{portfolio.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills Preview */}
          {portfolio?.skills && portfolio.skills.length > 0 && (
            <Card data-testid="card-skills-preview">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.slice(0, 10).map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {portfolio.skills.length > 10 && (
                    <Badge variant="outline">
                      +{portfolio.skills.length - 10} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Preview */}
          {portfolio?.projects && portfolio.projects.length > 0 && (
            <Card data-testid="card-projects-preview">
              <CardHeader>
                <CardTitle className="text-lg">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Preview */}
          {portfolio?.experience && portfolio.experience.length > 0 && (
            <Card data-testid="card-experience-preview">
              <CardHeader>
                <CardTitle className="text-lg">Latest Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.experience.slice(0, 2).map((exp) => (
                    <div key={exp.id}>
                      <p className="font-medium">{exp.position}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.startDate}
                        {exp.current ? " - Present" : exp.endDate ? ` - ${exp.endDate}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
