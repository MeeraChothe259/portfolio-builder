import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio, Project, Education, Experience, Achievement, PublicPortfolio } from "@shared/schema";
import { generateSimpleResumePDF } from "@/lib/resume-generator";
import { AIOptimizerModal } from "@/components/ai-optimizer-modal";
import {
  User,
  Code2,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Plus,
  X,
  Loader2,
  Save,
  ArrowLeft,
  Globe,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Download,
  Upload,
  Image as ImageIcon,
  Trophy,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DeveloperTemplate } from "@/components/templates/DeveloperTemplate";
import { TesterTemplate } from "@/components/templates/TesterTemplate";
import { AIMLTemplate } from "@/components/templates/AIMLTemplate";
import { DataAnalystTemplate } from "@/components/templates/DataAnalystTemplate";
import { PremiumTemplate } from "@/components/templates/PremiumTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { CompactTemplate } from "@/components/templates/CompactTemplate";

const ROLE_OPTIONS = ["developer", "tester", "ai_ml", "data_analyst", "premium"] as const;
type Role = (typeof ROLE_OPTIONS)[number];


const portfolioFormSchema = z.object({
  role: z.custom<Role>().optional(),
  bio: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export default function EditPortfolio() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      role: "developer",
      bio: "",
      title: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const watchedValues = form.watch();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const previewPortfolio = {
    id: 0,
    userId: user?.id || 0,
    user: {
      id: user?.id || 0,
      username: user?.username || "username",
      name: user?.name || "Your Name",
    },
    title: watchedValues.title || "",
    role: watchedValues.role || "developer",
    bio: watchedValues.bio || "",
    location: watchedValues.location || "",
    website: watchedValues.website || "",
    github: watchedValues.github || "",
    linkedin: watchedValues.linkedin || "",
    twitter: watchedValues.twitter || "",
    instagram: null,
    youtube: null,
    email: null,
    profilePicture: profilePicture,
    skills: skills,
    projects: projects,
    education: education,
    experience: experience,
    achievements: achievements,
    theme: "light"
  } as unknown as PublicPortfolio;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data: Portfolio | null = await api.getMyPortfolio();
        if (data) {
          form.reset({
            role: (data as any).role || "developer",
            bio: data.bio || "",
            title: data.title || "",
            location: data.location || "",
            website: data.website || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
          });
          setSkills(data.skills || []);
          setProjects(data.projects || []);
          setEducation(data.education || []);
          setExperience(data.experience || []);
          setAchievements((data as any).achievements || []);
          setProfilePicture((data as any).profilePicture || null);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, [form]);

  const onSubmit = async (data: PortfolioFormValues) => {
    setIsSaving(true);
    try {
      await api.updatePortfolio({
        ...data,
        role: data.role || "developer",
        skills,
        projects,
        education,
        experience,
        achievements,
        profilePicture,
      });
      toast({
        title: "Portfolio saved!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        link: "",
        technologies: [],
      },
    ]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: crypto.randomUUID(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const addAchievement = () => {
    setAchievements([
      ...achievements,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        date: "",
        issuer: "",
      },
    ]);
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(achievements.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const removeAchievement = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, itemId: string, itemType: 'project' | 'achievement') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type first
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please choose an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;

      // Update the appropriate item with the image
      if (itemType === 'project') {
        updateProject(itemId, { image: base64 });
      } else {
        updateAchievement(itemId, { image: base64 });
      }

      toast({
        title: "Image uploaded successfully",
        description: "Image added to your portfolio.",
      });
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Unable to read the file. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type first
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please choose an image file",
        variant: "destructive",
      });
      return;
    }

    // Compress and resize image to prevent database entity size errors
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast({
            title: "Error processing image",
            description: "Unable to process the image. Please try another.",
            variant: "destructive",
          });
          return;
        }

        // Calculate new dimensions (max 400x400, maintain aspect ratio)
        const maxDimension = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        // Set canvas dimensions and draw compressed image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (JPEG format, 0.8 quality)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        // Check if compressed size is still reasonable (should be well under 200KB after compression)
        const sizeInKB = Math.round((compressedBase64.length * 3) / 4 / 1024);

        if (sizeInKB > 300) {
          toast({
            title: "Image still too large",
            description: `Compressed size: ${sizeInKB}KB. Please try a smaller image.`,
            variant: "destructive",
          });
          return;
        }

        setProfilePicture(compressedBase64);
        toast({
          title: "Image uploaded successfully",
          description: `Compressed to ${sizeInKB}KB for optimal storage.`,
        });
      };

      img.onerror = () => {
        toast({
          title: "Error loading image",
          description: "Unable to load the image. Please try another file.",
          variant: "destructive",
        });
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Unable to read the file. Please try again.",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
  };

  const downloadResume = async () => {
    if (!user) return;

    setIsGeneratingPDF(true);
    try {
      const currentPortfolio: Portfolio = {
        id: "",
        userId: user.id,
        role: form.getValues("role") || "developer",
        bio: form.getValues("bio") || null,
        title: form.getValues("title") || null,
        location: form.getValues("location") || null,
        website: form.getValues("website") || null,
        github: form.getValues("github") || null,
        linkedin: form.getValues("linkedin") || null,
        twitter: form.getValues("twitter") || null,
        profilePicture: profilePicture || null,
        skills,
        projects,
        education,
        experience,
        achievements,
      };

      generateSimpleResumePDF({
        portfolio: currentPortfolio,
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

  const handleApplyOptimization = (data: {
    title: string;
    bio: string;
    skills: string[];
    projects?: { title: string; description: string }[];
    experience?: { company: string; position: string; description: string }[];
  }) => {
    form.setValue("title", data.title);
    form.setValue("bio", data.bio);
    setSkills(data.skills);

    // Merge Projects (Preserve ID and Image)
    if (data.projects && data.projects.length > 0) {
      const mergedProjects = projects.map((p, i) => {
        const optimized = data.projects?.[i];
        if (optimized) {
          return { ...p, title: optimized.title, description: optimized.description };
        }
        return p;
      });
      setProjects(mergedProjects);
    }

    // Merge Experience
    if (data.experience && data.experience.length > 0) {
      const mergedExperience = experience.map((e, i) => {
        const optimized = data.experience?.[i];
        if (optimized) {
          return { ...e, company: optimized.company, position: optimized.position, description: optimized.description };
        }
        return e;
      });
      setExperience(mergedExperience);
    }

    toast({
      title: "Full Optimization Applied!",
      description: "Projects, Experience, Skills, and Bio have been updated. Please review and Save.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <ScrollArea className="h-full">
            <div className="container mx-auto max-w-3xl px-4 py-8">
              {/* Header */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation("/dashboard")}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-2xl font-bold" data-testid="text-page-title">
                    Edit Portfolio
                  </h1>
                </div>
                <div className="flex gap-2">
                  <AIOptimizerModal onApply={handleApplyOptimization} />
                  <Button
                    variant="outline"
                    onClick={downloadResume}
                    disabled={isGeneratingPDF}
                    data-testid="button-download-resume"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isGeneratingPDF ? "Generating..." : "Download Resume"}
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSaving}
                    data-testid="button-save"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Profile Picture */}
                  <Card data-testid="card-profile-picture">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Profile Picture
                      </CardTitle>
                      <CardDescription>
                        Upload a profile picture for your portfolio
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center gap-4 sm:flex-row">
                        {profilePicture ? (
                          <div className="relative">
                            <img
                              src={profilePicture}
                              alt="Profile preview"
                              className="h-32 w-32 rounded-full object-cover border-2"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
                              onClick={removeProfilePicture}
                              data-testid="button-remove-picture"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed bg-muted">
                            <User className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <label htmlFor="profile-picture-upload">
                            <div className="cursor-pointer">
                              <Button
                                type="button"
                                variant="outline"
                                asChild
                                data-testid="button-upload-picture"
                              >
                                <span>
                                  <Upload className="mr-2 h-4 w-4" />
                                  {profilePicture ? "Change Picture" : "Upload Picture"}
                                </span>
                              </Button>
                            </div>
                          </label>
                          <input
                            id="profile-picture-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureUpload}
                          />
                          <p className="text-xs text-muted-foreground">
                            Images are automatically compressed and resized to 400x400px. Any format accepted.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role & Basic Info */}
                  <Card data-testid="card-basic-info">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Choose your primary role and tell visitors about yourself
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Role (for template)</FormLabel>
                            <FormDescription>
                              This controls which portfolio template is used on your public page.
                            </FormDescription>
                            <Select
                              value={field.value || "developer"}
                              onValueChange={(value) => field.onChange(value as Role)}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-role">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="tester">Tester / QA Engineer</SelectItem>
                                <SelectItem value="ai_ml">AI / ML Engineer</SelectItem>
                                <SelectItem value="data_analyst">Data Analyst</SelectItem>
                                <SelectItem value="premium">Premium Dark Theme</SelectItem>
                                <SelectItem value="minimal">Minimal Template</SelectItem>
                                <SelectItem value="creative">Creative Template</SelectItem>
                                <SelectItem value="modern">Modern Template</SelectItem>
                                <SelectItem value="compact">Compact Template</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Full Stack Developer"
                                data-testid="input-title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write a brief introduction about yourself..."
                                className="min-h-32 resize-none"
                                data-testid="input-bio"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., San Francisco, CA"
                                data-testid="input-location"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Website
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://yourwebsite.com"
                                  data-testid="input-website"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                GitHub
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://github.com/username"
                                  data-testid="input-github"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://linkedin.com/in/username"
                                  data-testid="input-linkedin"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://twitter.com/username"
                                  data-testid="input-twitter"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card data-testid="card-skills">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5" />
                        Skills
                      </CardTitle>
                      <CardDescription>
                        Add your technical and soft skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g., React, Python)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                          data-testid="input-skill"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addSkill}
                          data-testid="button-add-skill"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="gap-1 pr-1"
                              data-testid={`badge-skill-${index}`}
                            >
                              {skill}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => removeSkill(skill)}
                                data-testid={`button-remove-skill-${index}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  <Card data-testid="card-projects">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5" />
                            Projects
                          </CardTitle>
                          <CardDescription>
                            Showcase your best work
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addProject}
                          data-testid="button-add-project"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {projects.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No projects yet. Click "Add Project" to get started.
                        </p>
                      ) : (
                        projects.map((project, index) => (
                          <div
                            key={project.id}
                            className="relative space-y-4 rounded-lg border p-4"
                            data-testid={`project-item-${index}`}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeProject(project.id)}
                              data-testid={`button-remove-project-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="grid gap-4 pr-8 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                  placeholder="Project name"
                                  value={project.title}
                                  onChange={(e) =>
                                    updateProject(project.id, { title: e.target.value })
                                  }
                                  data-testid={`input-project-title-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Link</label>
                                <Input
                                  placeholder="https://project-url.com"
                                  value={project.link || ""}
                                  onChange={(e) =>
                                    updateProject(project.id, { link: e.target.value })
                                  }
                                  data-testid={`input-project-link-${index}`}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                placeholder="Describe your project..."
                                className="min-h-20 resize-none"
                                value={project.description}
                                onChange={(e) =>
                                  updateProject(project.id, { description: e.target.value })
                                }
                                data-testid={`input-project-description-${index}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Project Image/Screenshot</label>
                              <div className="flex gap-2">
                                <input
                                  id={`project-image-${project.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, project.id, 'project')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <label htmlFor={`project-image-${project.id}`} className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                  </label>
                                </Button>
                                {project.image && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateProject(project.id, { image: undefined })}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove
                                  </Button>
                                )}
                              </div>
                              {project.image && (
                                <div className="mt-2">
                                  <img
                                    src={project.image}
                                    alt="Project preview"
                                    className="h-32 w-full max-w-xs rounded object-cover border"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card data-testid="card-education">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Education
                          </CardTitle>
                          <CardDescription>
                            Your academic background
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addEducation}
                          data-testid="button-add-education"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Education
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {education.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No education entries yet. Click "Add Education" to get started.
                        </p>
                      ) : (
                        education.map((edu, index) => (
                          <div
                            key={edu.id}
                            className="relative space-y-4 rounded-lg border p-4"
                            data-testid={`education-item-${index}`}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeEducation(edu.id)}
                              data-testid={`button-remove-education-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="grid gap-4 pr-8 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Institution</label>
                                <Input
                                  placeholder="University name"
                                  value={edu.institution}
                                  onChange={(e) =>
                                    updateEducation(edu.id, { institution: e.target.value })
                                  }
                                  data-testid={`input-education-institution-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Degree</label>
                                <Input
                                  placeholder="e.g., Bachelor's, Master's"
                                  value={edu.degree}
                                  onChange={(e) =>
                                    updateEducation(edu.id, { degree: e.target.value })
                                  }
                                  data-testid={`input-education-degree-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Field of Study</label>
                                <Input
                                  placeholder="e.g., Computer Science"
                                  value={edu.field}
                                  onChange={(e) =>
                                    updateEducation(edu.id, { field: e.target.value })
                                  }
                                  data-testid={`input-education-field-${index}`}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Start</label>
                                  <Input
                                    placeholder="2020"
                                    value={edu.startDate}
                                    onChange={(e) =>
                                      updateEducation(edu.id, { startDate: e.target.value })
                                    }
                                    data-testid={`input-education-start-${index}`}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">End</label>
                                  <Input
                                    placeholder="2024"
                                    value={edu.endDate || ""}
                                    disabled={edu.current}
                                    onChange={(e) =>
                                      updateEducation(edu.id, { endDate: e.target.value })
                                    }
                                    data-testid={`input-education-end-${index}`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`edu-current-${edu.id}`}
                                checked={edu.current || false}
                                onCheckedChange={(checked) =>
                                  updateEducation(edu.id, { current: !!checked, endDate: checked ? "" : edu.endDate })
                                }
                                data-testid={`checkbox-education-current-${index}`}
                              />
                              <label
                                htmlFor={`edu-current-${edu.id}`}
                                className="text-sm font-medium leading-none"
                              >
                                Currently studying here
                              </label>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card data-testid="card-achievements">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Achievements
                          </CardTitle>
                          <CardDescription>
                            Awards, certifications, and accomplishments
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addAchievement}
                          data-testid="button-add-achievement"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Achievement
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {achievements.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No achievements yet. Click "Add Achievement" to get started.
                        </p>
                      ) : (
                        achievements.map((achievement, index) => (
                          <div
                            key={achievement.id}
                            className="relative space-y-4 rounded-lg border p-4"
                            data-testid={`achievement-item-${index}`}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeAchievement(achievement.id)}
                              data-testid={`button-remove-achievement-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="grid gap-4 pr-8 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                  placeholder="e.g., First Place in Hackathon"
                                  value={achievement.title}
                                  onChange={(e) =>
                                    updateAchievement(achievement.id, { title: e.target.value })
                                  }
                                  data-testid={`input-achievement-title-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Issuer</label>
                                <Input
                                  placeholder="e.g., Google, Microsoft"
                                  value={achievement.issuer || ""}
                                  onChange={(e) =>
                                    updateAchievement(achievement.id, { issuer: e.target.value })
                                  }
                                  data-testid={`input-achievement-issuer-${index}`}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                placeholder="Describe your achievement..."
                                className="min-h-20 resize-none"
                                value={achievement.description}
                                onChange={(e) =>
                                  updateAchievement(achievement.id, { description: e.target.value })
                                }
                                data-testid={`input-achievement-description-${index}`}
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                  placeholder="e.g., December 2023"
                                  value={achievement.date}
                                  onChange={(e) =>
                                    updateAchievement(achievement.id, { date: e.target.value })
                                  }
                                  data-testid={`input-achievement-date-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Certificate/Image</label>
                                <div className="flex gap-2">
                                  <input
                                    id={`achievement-image-${achievement.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, achievement.id, 'achievement')}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    asChild
                                  >
                                    <label htmlFor={`achievement-image-${achievement.id}`} className="cursor-pointer">
                                      <Upload className="mr-2 h-4 w-4" />
                                      Upload Image
                                    </label>
                                  </Button>
                                  {achievement.image && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateAchievement(achievement.id, { image: undefined })}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                {achievement.image && (
                                  <div className="mt-2">
                                    <img
                                      src={achievement.image}
                                      alt="Achievement preview"
                                      className="h-20 w-20 rounded object-cover border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card data-testid="card-experience">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Work Experience
                          </CardTitle>
                          <CardDescription>
                            Your professional journey
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addExperience}
                          data-testid="button-add-experience"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Experience
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {experience.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No experience entries yet. Click "Add Experience" to get started.
                        </p>
                      ) : (
                        experience.map((exp, index) => (
                          <div
                            key={exp.id}
                            className="relative space-y-4 rounded-lg border p-4"
                            data-testid={`experience-item-${index}`}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeExperience(exp.id)}
                              data-testid={`button-remove-experience-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="grid gap-4 pr-8 sm:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Company</label>
                                <Input
                                  placeholder="Company name"
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperience(exp.id, { company: e.target.value })
                                  }
                                  data-testid={`input-experience-company-${index}`}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Position</label>
                                <Input
                                  placeholder="Job title"
                                  value={exp.position}
                                  onChange={(e) =>
                                    updateExperience(exp.id, { position: e.target.value })
                                  }
                                  data-testid={`input-experience-position-${index}`}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                placeholder="Describe your responsibilities and achievements..."
                                className="min-h-20 resize-none"
                                value={exp.description}
                                onChange={(e) =>
                                  updateExperience(exp.id, { description: e.target.value })
                                }
                                data-testid={`input-experience-description-${index}`}
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Start</label>
                                  <Input
                                    placeholder="Jan 2022"
                                    value={exp.startDate}
                                    onChange={(e) =>
                                      updateExperience(exp.id, { startDate: e.target.value })
                                    }
                                    data-testid={`input-experience-start-${index}`}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">End</label>
                                  <Input
                                    placeholder="Dec 2023"
                                    value={exp.endDate || ""}
                                    disabled={exp.current}
                                    onChange={(e) =>
                                      updateExperience(exp.id, { endDate: e.target.value })
                                    }
                                    data-testid={`input-experience-end-${index}`}
                                  />
                                </div>
                              </div>
                              <div className="flex items-end">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`exp-current-${exp.id}`}
                                    checked={exp.current || false}
                                    onCheckedChange={(checked) =>
                                      updateExperience(exp.id, { current: !!checked, endDate: checked ? "" : exp.endDate })
                                    }
                                    data-testid={`checkbox-experience-current-${index}`}
                                  />
                                  <label
                                    htmlFor={`exp-current-${exp.id}`}
                                    className="text-sm font-medium leading-none"
                                  >
                                    Currently working here
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </form>
              </Form>

              {/* Sticky Save Button */}
              <div className="sticky bottom-4 mt-8 flex justify-end">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSaving}
                  size="lg"
                  className="shadow-lg"
                  data-testid="button-save-sticky"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30} className="hidden lg:block bg-muted/30 border-l">
          <div className="h-full w-full overflow-y-auto bg-background">
            {(() => {
              const role = watchedValues.role || "developer";
              const templateProps = {
                portfolio: previewPortfolio,
                getInitials,
                copied: false,
                onCopyUrl: () => { },
              };

              switch (role) {
                case "premium": return <PremiumTemplate {...templateProps} />;
                case "tester": return <TesterTemplate {...templateProps} />;
                case "ai_ml": return <AIMLTemplate {...templateProps} />;
                case "data_analyst": return <DataAnalystTemplate {...templateProps} />;
                case "minimal": return <MinimalTemplate {...templateProps} />;
                case "creative": return <CreativeTemplate {...templateProps} />;
                case "modern": return <ModernTemplate {...templateProps} />;
                case "compact": return <CompactTemplate {...templateProps} />;
                case "developer":
                default: return <DeveloperTemplate {...templateProps} />;
              }
            })()}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
