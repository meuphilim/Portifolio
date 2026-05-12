import type { Repository } from '@/types/portfolio';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  private: boolean;
  owner?: {
    login: string;
  };
}

export interface LanguageData {
  [language: string]: number;
}

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'portfolio-generator',
    description: 'Gerador automático de portfólio GitHub com deploy automático',
    html_url: 'https://github.com/meuphilim/portfolio-generator',
    homepage: null,
    language: 'TypeScript',
    topics: ['portfolio', 'github', 'automation', 'nextjs'],
    updated_at: new Date().toISOString(),
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    archived: false,
    private: false,
  },
  {
    id: 2,
    name: 'octomind',
    description: 'Sistema inteligente de automação para portfólios GitHub',
    html_url: 'https://github.com/meuphilim/octomind',
    homepage: null,
    language: 'JavaScript',
    topics: ['automation', 'github-actions', 'portfolio'],
    updated_at: new Date().toISOString(),
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    archived: false,
    private: false,
  },
];

function buildHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent': 'OctoMind-Portfolio',
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim() !== '') {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      !repo.private &&
      repo.name &&
      !repo.name.startsWith('.')
  );
}

export async function fetchUserRepositories(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const headers = buildHeaders(token);
  
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=public`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const repos: GitHubRepo[] = await response.json();
  return filterRepos(repos);
}

export async function fetchRepositoryLanguages(
  username: string,
  repoName: string
): Promise<LanguageData | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      {
        headers: {
          'User-Agent': 'OctoMind-Portfolio',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchAllRepositoryLanguages(
  username: string,
  repos: GitHubRepo[]
): Promise<Record<string, LanguageData>> {
  const results: Record<string, LanguageData> = {};

  await Promise.all(
    repos.map(async (repo) => {
      const languages = await fetchRepositoryLanguages(username, repo.name);
      if (languages) {
        results[repo.name] = languages;
      }
    })
  );

  return results;
}

export function getFallbackRepos(): GitHubRepo[] {
  return FALLBACK_REPOS;
}