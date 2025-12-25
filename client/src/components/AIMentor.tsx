import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AIAnalysisResult } from "@shared/schema";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingUp,
  FileCheck,
  Target,
  Zap,
} from "lucide-react";

interface AIMentorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: AIAnalysisResult | null;
}

export function AIMentor({ open, onOpenChange, analysis }: AIMentorProps) {
  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "important":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "recommended":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "critical":
        return "destructive";
      case "important":
        return "default";
      case "recommended":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Portfolio Analysis
          </DialogTitle>
          <DialogDescription>
            Comprehensive analysis of your portfolio with ATS compatibility check
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                    {analysis.scores.overall}
                    <span className="text-2xl">/100</span>
                  </div>
                  <p className="text-lg text-muted-foreground mt-2">
                    {getScoreLabel(analysis.scores.overall)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
                    {analysis.summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detailed Scores
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <ScoreCard
                  icon={<FileCheck className="h-5 w-5" />}
                  title="Content Quality"
                  score={analysis.scores.contentQuality}
                  description="Writing quality, clarity, and professionalism"
                />
                <ScoreCard
                  icon={<Zap className="h-5 w-5" />}
                  title="ATS Compatibility"
                  score={analysis.scores.atsCompatibility}
                  description="Resume parseability and keyword usage"
                />
                <ScoreCard
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="Completeness"
                  score={analysis.scores.completeness}
                  description="All sections filled with sufficient detail"
                />
                <ScoreCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Impact"
                  score={analysis.scores.impact}
                  description="Quantifiable achievements and results"
                />
              </div>
            </div>

            <Separator />

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Suggestions ({analysis.suggestions.length})
                </h3>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getCategoryIcon(suggestion.category)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold">{suggestion.title}</h4>
                              <div className="flex gap-2">
                                <Badge variant={getCategoryBadgeVariant(suggestion.category)}>
                                  {suggestion.category}
                                </Badge>
                                <Badge variant="outline">{suggestion.section}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Issues */}
            {analysis.atsIssues.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  ATS Compatibility Issues ({analysis.atsIssues.length})
                </h3>
                <div className="space-y-3">
                  {analysis.atsIssues.map((issue) => (
                    <Card key={issue.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-semibold">{issue.issue}</h4>
                              <Badge variant="outline">{issue.severity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>How to fix:</strong> {issue.suggestion}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Timestamp */}
            <div className="text-center text-xs text-muted-foreground">
              Analysis completed on {new Date(analysis.analyzedAt).toLocaleString()}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface ScoreCardProps {
  icon: React.ReactNode;
  title: string;
  score: number;
  description: string;
}

function ScoreCard({ icon, title, score, description }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
