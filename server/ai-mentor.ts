import Groq from "groq-sdk";
import type { Portfolio, AIAnalysisResult, AIScores, AISuggestion, ATSIssue } from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * AI PORTFOLIO MENTOR SERVICE
 * Features: AI Analysis (Groq), Targeted ATS Matching, Rule-based Fallback
 */

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Main Entry Point: Analyzes portfolio using Llama-3 (Groq)
 * @param portfolio - The user's portfolio data
 * @param userName - The user's name for personalized feedback
 * @param jobDescription - (Optional) Target job posting to match against
 */
export async function analyzePortfolioWithAI(
  portfolio: Portfolio,
  userName: string,
  jobDescription?: string
): Promise<AIAnalysisResult> {
  try {
    // 1. Guard against missing API Key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === "") {
      console.warn("⚠️  GROQ_API_KEY missing or empty. Falling back to rule-based analysis.");
      return getFallbackAnalysis(portfolio);
    }

    console.log("🤖 Calling Groq AI for portfolio analysis...");
    const prompt = buildAnalysisPrompt(portfolio, userName, jobDescription);

    // 2. Call AI Model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Technical Recruiter and ATS Specialist. 
          Your goal is to provide brutal but constructive feedback to help candidates pass top-tier company filters. 
          Analyze the data and return a JSON object following the requested schema strictly.`
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, // Slightly lower temperature for more consistent scoring
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      console.warn("⚠️  AI returned empty response. Using fallback.");
      return getFallbackAnalysis(portfolio);
    }

    // 3. Parse and Validate
    const aiAnalysis = JSON.parse(response);
    console.log("✅ AI analysis completed successfully");
    return formatAIResponse(aiAnalysis);

  } catch (error) {
    console.error("❌ AI analysis error:", error);
    console.log("📊 Using fallback rule-based analysis");
    // 4. Reliable Fallback if AI or Network fails
    return getFallbackAnalysis(portfolio);
  }
}

/**
 * PROMPT ENGINEERING
 * Injects Job Description logic into the AI instructions
 */
function buildAnalysisPrompt(portfolio: Portfolio, userName: string, jobDescription?: string): string {
  const contextHeader = jobDescription
    ? `### TARGET JOB DESCRIPTION:\n${jobDescription}\n`
    : "### TARGET ROLE: General Full-Stack/Software Engineering Role\n";

  return `
Analyze the portfolio for candidate: ${userName}

${contextHeader}

### PORTFOLIO CONTENT:
- Current Role: ${portfolio.role}
- Title: ${portfolio.title || "N/A"}
- Professional Bio: ${portfolio.bio || "N/A"}
- Core Skills: ${portfolio.skills?.join(", ") || "None listed"}
- Projects Data: ${JSON.stringify(portfolio.projects || [])}
- Experience Data: ${JSON.stringify(portfolio.experience || [])}
- Links Provided: GitHub: ${!!portfolio.github}, LinkedIn: ${!!portfolio.linkedin}, Personal Site: ${!!portfolio.website}

### INSTRUCTIONS:
1. **ATS Match:** If a Job Description is provided, calculate the "atsCompatibility" score based strictly on keyword matching and experience relevance. Identify 3-5 "missingKeywords".
2. **Impact Scoring:** Grade "impact" based on the presence of metrics (%, $, time saved). If no numbers are found in projects/experience, score this section below 40.
3. **Actionable Suggestions:** Provide 5-7 suggestions. Use categories: 'critical' (must fix for ATS), 'important' (highly recommended), 'recommended' (extra polish).
4. **Summary:** Write a 3-sentence summary that highlights the biggest strength and the biggest weakness.

### EXPECTED JSON FORMAT:
{
  "scores": {
    "contentQuality": number,
    "atsCompatibility": number,
    "completeness": number,
    "impact": number,
    "overall": number
  },
  "suggestions": [
    { "category": "critical" | "important" | "recommended", "title": string, "description": string, "section": string }
  ],
  "atsIssues": [
    { "severity": "high" | "medium" | "low", "issue": string, "suggestion": string }
  ],
  "summary": string
}`;
}

/**
 * SCHEMA FORMATTING
 * Ensures AI response matches the database/shared schema exactly
 */
function formatAIResponse(aiAnalysis: any): AIAnalysisResult {
  const sanitizeScore = (s: any) => Math.min(100, Math.max(0, parseInt(s) || 50));

  return {
    scores: {
      contentQuality: sanitizeScore(aiAnalysis.scores?.contentQuality),
      atsCompatibility: sanitizeScore(aiAnalysis.scores?.atsCompatibility),
      completeness: sanitizeScore(aiAnalysis.scores?.completeness),
      impact: sanitizeScore(aiAnalysis.scores?.impact),
      overall: sanitizeScore(aiAnalysis.scores?.overall),
    },
    suggestions: (aiAnalysis.suggestions || []).map((s: any) => ({
      id: `ai-${randomUUID()}`,
      category: s.category || "recommended",
      title: s.title || "Refine Content",
      description: s.description || "",
      section: s.section || "general",
    })),
    atsIssues: (aiAnalysis.atsIssues || []).map((issue: any) => ({
      id: `ats-${randomUUID()}`,
      severity: issue.severity || "medium",
      issue: issue.issue || "",
      suggestion: issue.suggestion || "",
    })),
    summary: aiAnalysis.summary || "Portfolio analyzed successfully.",
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * COMPREHENSIVE FALLBACK ENGINE
 * Hand-coded rules that execute when AI is unavailable
 */
function getFallbackAnalysis(portfolio: Portfolio): AIAnalysisResult {
  const suggestions: AISuggestion[] = [];
  const atsIssues: ATSIssue[] = [];

  let qScore = 60, aScore = 60, cScore = 0, iScore = 50;

  // 1. Completeness Logic (Objective Checks)
  if (portfolio.bio && portfolio.bio.length > 50) cScore += 20;
  if ((portfolio.skills?.length || 0) >= 8) cScore += 20;
  if ((portfolio.projects?.length || 0) >= 3) cScore += 30;
  if ((portfolio.experience?.length || 0) >= 1) cScore += 30;

  // 2. ATS Heuristics
  if (!portfolio.github || !portfolio.linkedin) {
    atsIssues.push({
      id: randomUUID(),
      severity: "high",
      issue: "Missing Social Proof",
      suggestion: "Add your LinkedIn and GitHub. 85% of recruiters check these before an interview."
    });
    aScore -= 20;
  }

  const skillCount = portfolio.skills?.length || 0;
  if (skillCount < 6) {
    atsIssues.push({
      id: randomUUID(),
      severity: "medium",
      issue: "Low Keyword Density",
      suggestion: "Add specific technologies and tools. Aim for 10-15 relevant skills."
    });
    aScore -= 15;
  }

  // 3. Impact & Content
  const descString = JSON.stringify(portfolio.experience) + JSON.stringify(portfolio.projects);
  const hasNumbers = /\d+%|\d+x|\$\d+/.test(descString);

  if (!hasNumbers) {
    suggestions.push({
      id: randomUUID(),
      category: "critical",
      title: "Quantify Your Work",
      description: "Recruiters love numbers. Instead of 'Improved app speed', use 'Reduced latency by 40%'.",
      section: "experience"
    });
    iScore -= 30;
    qScore -= 10;
  }

  if (!portfolio.bio || portfolio.bio.length < 150) {
    suggestions.push({
      id: randomUUID(),
      category: "important",
      title: "Strengthen Professional Summary",
      description: "Your bio should be a 3-sentence elevator pitch of your unique value.",
      section: "bio"
    });
    qScore -= 20;
  }

  const overall = Math.round((qScore + aScore + cScore + iScore) / 4);

  return {
    scores: {
      contentQuality: Math.max(0, qScore),
      atsCompatibility: Math.max(0, aScore),
      completeness: Math.max(0, cScore),
      impact: Math.max(0, iScore),
      overall: Math.max(0, overall),
    },
    suggestions: suggestions.slice(0, 5),
    atsIssues: atsIssues,
    summary: "Note: AI analysis is currently unavailable. Displaying results based on heuristic scoring.",
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * GENERATIVE AI OPTIMIZER
 * Rewrites portfolio content to match a specific Job Description
 */
export async function optimizePortfolioWithAI(
  portfolio: Portfolio,
  jobDescription: string
): Promise<Partial<Portfolio>> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const prompt = `
    You are an expert Resume Writer and ATS Optimizer.
    I will provide a User's Portfolio and a Target Job Description.
    
    Your task is to REWRITE and OPTIMIZE the user's content to strictly match the Job Description.
    
    ### TARGET JOB DESCRIPTION:
    ${jobDescription}

    ### USER PORTFOLIO:
    - Current Title: ${portfolio.title}
    - Bio: ${portfolio.bio}
    - Skills: ${portfolio.skills?.join(", ")}
    - Projects: ${JSON.stringify(portfolio.projects?.map(p => ({ title: p.title, desc: p.description })))}

    ### INSTRUCTIONS:
    1. **Title:** Update the professional title to match the target role (e.g., "Senior React Developer").
    2. **Bio:** Rewrite the bio (max 400 chars) to highlight experience relevant to the JD. Use keywords from the JD.
    3. **Skills:** Return a list of 10-15 top skills. Prioritize skills found in BOTH the JD and the User's background.
    4. **Projects:** Rewrite the descriptions for EACH project to emphasize the skills found in the JD. Use the STAR method if possible. Stick to the same number of projects.
    5. **Experience:** Rewrite the descriptions for EACH experience entry to highlight relevance to the JD. Stick to the same number of experience entries.
    
    ### RETURN JSON ONLY:
    {
      "title": "New Title",
      "bio": "Optimized Bio...",
      "skills": ["Skill 1", "Skill 2"...],
      "projects": [
        { "title": "Optimized Title", "description": "Optimized Description" }
      ],
      "experience": [
        { "company": "Company Name", "position": "Position", "description": "Optimized Description" }
      ]
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a JSON-only API. specific response format required." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error("Empty AI response");

    return JSON.parse(response);

  } catch (error) {
    console.warn("⚠️ AI Optimization failed (likely invalid API key). Using fallback.");
    return getFallbackOptimization(portfolio, jobDescription);
  }
}

/**
 * Heuristic Fallback for Optimization
 * Used when AI service is unavailable
 */
function getFallbackOptimization(portfolio: Portfolio, jd: string): Partial<Portfolio> {
  // 1. Title Extraction (Simple heuristic: look for "Senior/Junior X Developer" in JD)
  const titleMatch = jd.match(/(Senior|Lead|Principal|Junior|Staff)?\s?([\w\s]+)?(Developer|Engineer|Architect)/i);
  const newTitle = titleMatch ? titleMatch[0] : portfolio.title || "Software Engineer";

  // 2. Skill Extraction (Find common tech keywords in JD)
  const commonTech = ["React", "Node", "TypeScript", "JavaScript", "Python", "Java", "AWS", "Docker", "Kubernetes", "SQL", "NoSQL", "Angular", "Vue", "C++", "C#", "Go", "Rust"];
  const newSkills = new Set(portfolio.skills || []);

  commonTech.forEach(tech => {
    if (jd.toLowerCase().includes(tech.toLowerCase())) {
      newSkills.add(tech);
    }
  });

  // 3. Bio Construction
  const bio = `I am a passionate ${newTitle} with experience in ${Array.from(newSkills).slice(0, 3).join(", ")}. I have a proven track record of delivering high-quality software solutions and am eager to apply my skills to this new challenge.`;

  // 4. Projects & Experience (Rewrite to show optimization effect)
  const topSkills = Array.from(newSkills).slice(0, 3).join(", ");

  const optimizedProjects = portfolio.projects?.map(p => ({
    title: p.title,
    description: `[Optimized for ${newTitle}] ${p.description} Demonstrated proficiency in ${topSkills}.`
  })) || [];

  const optimizedExperience = portfolio.experience?.map(e => ({
    company: e.company,
    position: e.position,
    description: `[Optimized] ${e.description} Focused on delivering scalable solutions using ${topSkills}.`
  })) || [];

  return {
    title: newTitle,
    bio: bio,
    skills: Array.from(newSkills).slice(0, 15),
    projects: optimizedProjects as any,
    experience: optimizedExperience as any
  };
}