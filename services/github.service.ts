import type { Repository } from '@/types/portfolio';

// Dados de fallback para quando a API não estiver disponível
export const FALLBACK_REPOS: Repository[] = [
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
    owner: {
      login: 'meuphilim',
    },
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
    owner: {
      login: 'meuphilim',
    },
  },
];

export async function fetchUserRepositories(username: string): Promise<Repository[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        'User-Agent': `${username}-portfolio`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`API GitHub retornou: ${response.status}`);
  }

  const data = await response.json();
  return data.filter(
    (repo: any) =>
      !repo.fork &&
      !repo.archived &&
      !repo.private &&
      repo.name &&
      !repo.name.startsWith('.'),
  );
}

export async function fetchRepositoryLanguages(username: string, repoName: string): Promise<Record<string, number>> {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/languages`,
    {
      headers: {
        'User-Agent': `${username}-portfolio`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API GitHub retornou: ${response.status} ao buscar linguagens para ${repoName}`);
  }

  return response.json();
}

export async function fetchAllRepositoryLanguages(repos: Repository[]): Promise<Record<string, number>> {
  const languagesData: Record<string, number> = {};

  const requests = repos.map(async (repo) => {
    try {
      const data = await fetchRepositoryLanguages(repo.owner.login, repo.name);

      for (const [lang, bytes] of Object.entries(data) as [string, number][]) {
        languagesData[lang] = (languagesData[lang] || 0) + bytes;
      }
    } catch (err) {
      console.error(`Erro ao carregar linguagens de ${repo.name}`, err);
    }
  });

  await Promise.all(requests);

  return languagesData;
}
