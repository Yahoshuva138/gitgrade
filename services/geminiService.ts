import { GoogleGenAI, Type } from "@google/genai";
import { RepoContext, AnalysisResult } from '../types';

// Initialize Gemini
// Note: In a real production app, you would proxy this through a backend to keep the key secret.
// For this client-side demo, we rely on the environment variable as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepository = async (repoContext: RepoContext): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";

  const { metadata, files, languages, readmeContent } = repoContext;

  // Prepare a prompt that summarizes the repository state
  const promptContext = `
    Analyze this GitHub repository based on the following metadata:
    
    Repository: ${metadata.owner}/${metadata.name}
    Description: ${metadata.description || "No description provided"}
    Primary Language: ${metadata.language || "Unknown"}
    Languages Breakdown: ${JSON.stringify(languages)}
    Stars: ${metadata.stars}, Forks: ${metadata.forks}, Open Issues: ${metadata.openIssues}
    
    Root File Structure:
    ${files.map(f => `- ${f.name} (${f.type})`).join('\n')}
    
    README Content (First 2000 characters):
    ${readmeContent ? readmeContent.substring(0, 2000) : "No README found."}
    
    TASK:
    Act as a senior software engineer and mentor. Evaluate the repository on:
    1. Code quality indicators (inferred from structure, linting files, languages)
    2. Documentation (README quality, clarity)
    3. Project structure (standard conventions for the language)
    4. Development consistency (inferred from metadata)
    
    Provide a Score (0-100), a qualitative Level, a Summary, detailed Strengths/Weaknesses, and a specific Roadmap for improvement.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: promptContext,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall quality score from 0-100" },
          level: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
          summary: { type: Type.STRING, description: "A concise 2-3 sentence executive summary of the repo quality." },
          strengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-4 key strengths identified."
          },
          weaknesses: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-4 key areas needing improvement."
          },
          roadmap: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Ordered list of 3-5 actionable steps for the student to improve the project."
          },
          consistencyScore: { type: Type.NUMBER, description: "Sub-score for consistency 0-100" },
          documentationScore: { type: Type.NUMBER, description: "Sub-score for documentation 0-100" },
          bestPracticesScore: { type: Type.NUMBER, description: "Sub-score for best practices 0-100" },
        },
        required: ["score", "level", "summary", "strengths", "weaknesses", "roadmap", "consistencyScore", "documentationScore", "bestPracticesScore"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as AnalysisResult;
  } else {
    throw new Error("Failed to generate analysis from AI.");
  }
};
