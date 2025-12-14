import { RepoContext, RepoMetadata, FileStructure } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

// Helper to parse "user/repo" from various URL formats
export const parseRepoUrl = (url: string): { owner: string; name: string } | null => {
  try {
    const cleanUrl = url.replace(/\/$/, ''); // Remove trailing slash
    const parts = cleanUrl.split('/');
    const index = parts.findIndex(p => p === 'github.com');
    
    if (index !== -1 && parts.length >= index + 3) {
      return { owner: parts[index + 1], name: parts[index + 2] };
    }
    
    // Handle short format "owner/repo" input directly
    if (!url.includes('github.com') && parts.length === 2) {
        return { owner: parts[0], name: parts[1] };
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const fetchRepoData = async (owner: string, name: string): Promise<RepoContext> => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  // 1. Fetch Metadata
  const metaRes = await fetch(`${GITHUB_API_BASE}/${owner}/${name}`, { headers });
  if (!metaRes.ok) throw new Error(`Repository not found or private. Status: ${metaRes.status}`);
  const metaData = await metaRes.json();

  const metadata: RepoMetadata = {
    owner: metaData.owner.login,
    name: metaData.name,
    description: metaData.description,
    stars: metaData.stargazers_count,
    forks: metaData.forks_count,
    language: metaData.language,
    openIssues: metaData.open_issues_count,
    topics: metaData.topics || [],
    defaultBranch: metaData.default_branch,
  };

  // 2. Fetch Languages
  const langRes = await fetch(`${GITHUB_API_BASE}/${owner}/${name}/languages`, { headers });
  const languages = langRes.ok ? await langRes.json() : {};

  // 3. Fetch Root Contents (File Structure)
  const contentsRes = await fetch(`${GITHUB_API_BASE}/${owner}/${name}/contents`, { headers });
  const contentsData = contentsRes.ok ? await contentsRes.json() : [];
  
  const files: FileStructure[] = Array.isArray(contentsData) 
    ? contentsData.map((item: any) => ({
        name: item.name,
        type: item.type,
        path: item.path
      }))
    : [];

  // 4. Fetch README
  const readmeRes = await fetch(`${GITHUB_API_BASE}/${owner}/${name}/readme`, { headers });
  let readmeContent: string | null = null;
  
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    try {
        // GitHub API returns content in Base64
        readmeContent = atob(readmeData.content.replace(/\n/g, ''));
    } catch (e) {
        console.warn('Failed to decode README', e);
    }
  }

  return {
    metadata,
    languages,
    files,
    readmeContent
  };
};
