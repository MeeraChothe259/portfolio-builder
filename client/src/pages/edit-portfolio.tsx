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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio, Project, Education, Experience } from "@shared/schema";
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
} from "lucide-react";

const portfolioFormSchema = z.object({
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
  
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      bio: "",
      title: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data: Portfolio | null = await api.getMyPortfolio();
        if (data) {
          form.reset({
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
        skills,
        projects,
        education,
        experience,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <Card data-testid="card-basic-info">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell visitors about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
  );
}
