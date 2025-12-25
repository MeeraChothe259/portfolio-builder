import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";
import type { PublicPortfolio } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { DeveloperTemplate } from "@/components/templates/DeveloperTemplate";
import { TesterTemplate } from "@/components/templates/TesterTemplate";
import { AIMLTemplate } from "@/components/templates/AIMLTemplate";
import { DataAnalystTemplate } from "@/components/templates/DataAnalystTemplate";
import { PremiumTemplate } from "@/components/templates/PremiumTemplate";

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // If the logged-in user is viewing their own portfolio, use the authenticated endpoint.
        if (user && username && user.username === username) {
          const data = await api.getMyPortfolio();
          if (!data) {
            setNotFound(true);
          } else {
            setPortfolio({
              ...(data as any),
              user: {
                username: user.username,
                name: user.name,
              },
            } as PublicPortfolio);
          }
        } else {
          const data = await api.getPublicPortfolio(username!);
          if (!data) {
            setNotFound(true);
          } else {
            setPortfolio(data);
          }
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
  }, [username, user]);

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

  // Render the appropriate template based on role
  const role = (portfolio as any).role || "developer";

  const templateProps = {
    portfolio,
    getInitials,
    copied,
    onCopyUrl: copyUrl,
  };

  switch (role) {
    case "premium":
      return <PremiumTemplate {...templateProps} />;
    case "tester":
      return <TesterTemplate {...templateProps} />;
    case "ai_ml":
      return <AIMLTemplate {...templateProps} />;
    case "data_analyst":
      return <DataAnalystTemplate {...templateProps} />;
    case "developer":
    default:
      return <DeveloperTemplate {...templateProps} />;
  }
}