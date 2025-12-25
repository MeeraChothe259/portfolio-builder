import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getAuthToken } from "@/lib/auth";
import type { Portfolio, AIAnalysisResult } from "@shared/schema";
import {
  Loader2,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface AIMentorSectionProps {
  portfolio: Portfolio | null | undefined;
}

export function AIMentorSection({ portfolio }: AIMentorSectionProps) {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!portfolio) {
      toast({
        title: "Error",
        description: "Portfolio data is not loaded yet. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const token = getAuthToken();

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in again to use the AI Mentor.",
        });
        setIsAnalyzing(false);
        return;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const response = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        // Try to get error details from response
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.details || errorData.message || "Failed to get analysis");
      }

      const data = await response.json();
      setAnalysisResult(data);

      // Check if using fallback
      const usingFallback = data.summary?.includes("AI analysis is currently unavailable");

      toast({
        title: usingFallback ? "Analysis Complete (Fallback Mode)" : "✅ AI Analysis Complete",
        description: usingFallback
          ? "Using rule-based analysis. Check server logs for details."
          : "Your portfolio has been reviewed by the AI Mentor.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze portfolio";
      console.error("AI Mentor Error:", error);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-xl bg-card shadow-sm h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold">AI Portfolio Mentor</h2>
        </div>
        {analysisResult && (
          <Badge variant="outline" className="text-primary border-primary font-mono">
            SCORE: {analysisResult.scores.overall}
          </Badge>
        )}
      </div>

      {!analysisResult || isAnalyzing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
              Target Job Description
            </label>
            <Textarea
              placeholder="Paste the job description here to check your ATS match..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px] bg-muted/30 focus:bg-background transition-all"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full shadow-lg shadow-primary/20"
          >
            {isAnalyzing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Portfolio...</>
            ) : (
              <><Target className="mr-2 h-4 w-4" /> Match & Score Portfolio</>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <ScoreItem label="ATS Match" value={analysisResult.scores.atsCompatibility} />
            <ScoreItem label="Content" value={analysisResult.scores.contentQuality} />
            <ScoreItem label="Impact" value={analysisResult.scores.impact} />
            <ScoreItem label="Completeness" value={analysisResult.scores.completeness} />
          </div>

          <div className="p-4 bg-muted/40 rounded-lg border text-sm leading-relaxed italic">
            "{analysisResult.summary}"
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-3 w-3" /> Fix These Issues
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {analysisResult.suggestions.map((s, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-background/50 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={s.category === 'critical' ? 'destructive' : 'secondary'} className="text-[10px] h-4">
                      {s.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{s.section}</span>
                  </div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" onClick={() => setAnalysisResult(null)} className="w-full text-xs h-8 opacity-50 hover:opacity-100">
            ← Run New Match
          </Button>
        </div>
      )}
    </div>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      {/* Removed 'indicatorClassName' to fix the error from your screenshot */}
      <Progress value={value} className="h-1.5" />
    </div>
  );
}