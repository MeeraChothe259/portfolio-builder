import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { PublicPortfolio } from "@shared/schema";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Code2,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.getPublicPortfolio(username!);
        if (!data) {
          setNotFound(true);
        } else {
          setPortfolio(data);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: "Link copied!", description: "Portfolio URL copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-32 w-32 rounded-full" />
          <Skeleton className="mx-auto mb-2 h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !portfolio) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-not-found-title">
          Portfolio Not Found
        </h1>
        <p className="mb-8 text-muted-foreground">
          The portfolio for @{username} doesn't exist or hasn't been created yet.
        </p>
        <Button asChild>
          <a href="/">Go to Homepage</a>
        </Button>
      </div>
    );
  }

  const socialLinks = [
    { href: portfolio.website, icon: Globe, label: "Website" },
    { href: portfolio.github, icon: Github, label: "GitHub" },
    { href: portfolio.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: portfolio.twitter, icon: Twitter, label: "Twitter" },
  ].filter((link) => link.href);

  const hasContent =
    portfolio.bio ||
    (portfolio.skills && portfolio.skills.length > 0) ||
    (portfolio.projects && portfolio.projects.length > 0) ||
    (portfolio.education && portfolio.education.length > 0) ||
    (portfolio.experience && portfolio.experience.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="mb-6 h-32 w-32">
              <AvatarFallback className="bg-primary text-3xl text-primary-foreground">
                {getInitials(portfolio.user.name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="mb-2 text-4xl font-bold" data-testid="text-portfolio-name">
              {portfolio.user.name}
            </h1>
            
            {portfolio.title && (
              <p className="mb-4 text-xl text-muted-foreground" data-testid="text-portfolio-title">
                {portfolio.title}
              </p>
            )}
            
            {portfolio.location && (
              <p className="mb-6 flex items-center gap-2 text-muted-foreground" data-testid="text-portfolio-location">
                <MapPin className="h-4 w-4" />
                {portfolio.location}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    asChild
                    data-testid={`button-social-${link.label.toLowerCase()}`}
                  >
                    <a
                      href={link.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
            )}

            {/* Share Button */}
            <Button
              variant="outline"
              onClick={copyUrl}
              data-testid="button-share"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Share Portfolio
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {!hasContent ? (
          <Card className="text-center">
            <CardContent className="py-12">
              <p className="text-muted-foreground">
                This portfolio is still being built. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* About Section */}
            {portfolio.bio && (
              <section data-testid="section-about">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <Briefcase className="h-6 w-6 text-primary" />
                  About
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground" data-testid="text-bio">
                      {portfolio.bio}
                    </p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Skills Section */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <section data-testid="section-skills">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <Code2 className="h-6 w-6 text-primary" />
                  Skills
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-4 py-1.5 text-sm"
                          data-testid={`badge-skill-${index}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Projects Section */}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <section data-testid="section-projects">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <FolderKanban className="h-6 w-6 text-primary" />
                  Projects
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {portfolio.projects.map((project, index) => (
                    <Card key={project.id} className="hover-elevate" data-testid={`card-project-${index}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 text-primary hover:underline"
                              data-testid={`link-project-${index}`}
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {project.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {portfolio.education && portfolio.education.length > 0 && (
              <section data-testid="section-education">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Education
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                      {portfolio.education.map((edu, index) => (
                        <div key={edu.id} className="relative" data-testid={`education-item-${index}`}>
                          <div className="absolute -left-8 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{edu.institution}</h3>
                            <p className="text-muted-foreground">
                              {edu.degree} {edu.field && `in ${edu.field}`}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {edu.startDate}
                              {edu.current ? " - Present" : edu.endDate ? ` - ${edu.endDate}` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Experience Section */}
            {portfolio.experience && portfolio.experience.length > 0 && (
              <section data-testid="section-experience">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Experience
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                      {portfolio.experience.map((exp, index) => (
                        <div key={exp.id} className="relative" data-testid={`experience-item-${index}`}>
                          <div className="absolute -left-8 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{exp.position}</h3>
                            <p className="font-medium text-muted-foreground">
                              {exp.company}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {exp.startDate}
                              {exp.current ? " - Present" : exp.endDate ? ` - ${exp.endDate}` : ""}
                            </p>
                            {exp.description && (
                              <p className="mt-2 text-muted-foreground">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a href="/" className="font-medium text-primary hover:underline">
              PortfolioHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
