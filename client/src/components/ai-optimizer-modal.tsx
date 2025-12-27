import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/auth";

interface OptimizedData {
    title: string;
    bio: string;
    skills: string[];
    projects: { title: string; description: string }[];
    experience: { company: string; position: string; description: string }[];
}

interface AIOptimizerModalProps {
    onApply: (data: OptimizedData) => void;
}

export function AIOptimizerModal({ onApply }: AIOptimizerModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"input" | "review">("input");
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [optimizedData, setOptimizedData] = useState<OptimizedData | null>(null);
    const { toast } = useToast();

    const handleOptimize = async () => {
        if (!jobDescription.trim()) {
            toast({
                title: "Required",
                description: "Please paste a job description first.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const token = getAuthToken();
            if (!token) throw new Error("Not authenticated");

            const response = await fetch("/api/portfolio/optimize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobDescription }),
            });

            if (!response.ok) {
                throw new Error("Failed to optimize");
            }

            const data = await response.json();
            setOptimizedData(data);
            setStep("review");
        } catch (error) {
            console.error("Optimization error:", error);
            toast({
                title: "Optimization Failed",
                description: "Could not generate optimization. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (optimizedData) {
            onApply(optimizedData);
            setIsOpen(false);
            // Reset state for next time
            setStep("input");
            setJobDescription("");
            setOptimizedData(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                    <Wand2 className="h-4 w-4 text-primary" />
                    Auto-Optimize for Role
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Portfolio Optimizer
                    </DialogTitle>
                    <DialogDescription>
                        {step === "input"
                            ? "Paste a job description below. The AI will rewrite your Title, Bio, and Skills to match the role."
                            : "Review the proposed changes before applying them to your portfolio."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === "input" ? (
                        <Textarea
                            placeholder="Paste Job Description here (e.g., 'Senior Frontend Engineer with React and AWS experience...')"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="min-h-[200px]"
                        />
                    ) : (
                        <div className="space-y-4 rounded-lg border bg-muted/40 p-4 text-sm">
                            {optimizedData && (
                                <>
                                    <div className="space-y-1">
                                        <span className="font-bold uppercase text-xs text-muted-foreground">New Title</span>
                                        <div className="font-semibold text-primary">{optimizedData.title}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-bold uppercase text-xs text-muted-foreground">Optimized Bio</span>
                                        <div className="leading-relaxed">{optimizedData.bio}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-bold uppercase text-xs text-muted-foreground">Suggested Skills</span>
                                        <div className="flex flex-wrap gap-1">
                                            {optimizedData.skills.map((skill, i) => (
                                                <span key={i} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {optimizedData.projects && optimizedData.projects.length > 0 && (
                                        <div className="space-y-1 pt-2 border-t">
                                            <span className="font-bold uppercase text-xs text-muted-foreground">Optimized Projects ({optimizedData.projects.length})</span>
                                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                                {optimizedData.projects.map((p, i) => (
                                                    <div key={i} className="text-xs border-l-2 pl-2 border-primary/20">
                                                        <div className="font-semibold">{p.title}</div>
                                                        <div className="text-muted-foreground line-clamp-2">{p.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {optimizedData.experience && optimizedData.experience.length > 0 && (
                                        <div className="space-y-1 pt-2 border-t">
                                            <span className="font-bold uppercase text-xs text-muted-foreground">Optimized Experience ({optimizedData.experience.length})</span>
                                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                                {optimizedData.experience.map((e, i) => (
                                                    <div key={i} className="text-xs border-l-2 pl-2 border-primary/20">
                                                        <div className="font-semibold">{e.position} at {e.company}</div>
                                                        <div className="text-muted-foreground line-clamp-2">{e.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === "input" ? (
                        <Button onClick={handleOptimize} disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Optimizing Portfolio...
                                </>
                            ) : (
                                <>
                                    Optimize Now <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep("input")}>
                                Back
                            </Button>
                            <Button onClick={handleApply}>
                                Apply Changes
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
