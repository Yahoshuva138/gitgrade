export interface RepoMetadata {
  owner: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  openIssues: number;
  topics: string[];
  defaultBranch: string;
}

export interface FileStructure {
  name: string;
  type: 'file' | 'dir';
  path: string;
}

export interface RepoContext {
  metadata: RepoMetadata;
  files: FileStructure[];
  languages: Record<string, number>;
  readmeContent: string | null;
}

export interface AnalysisResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
  consistencyScore: number;
  documentationScore: number;
  bestPracticesScore: number;
}
