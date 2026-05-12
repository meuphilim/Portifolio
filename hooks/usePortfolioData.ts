'use client';

import { useEffect, useState } from 'react';
import type { Repository, PortfolioData } from '@/types/portfolio';

const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 1000 * 60 * 15;

interface CacheData {
  repos: Repository[];
  timestamp: number;
}

const FALLBACK_REPOS: Repository[] = [
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

function getCache(): Repository[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data: CacheData = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data.repos;
  } catch {
    return null;
  }
}

function setCache(repos: Repository[]): void {
  if (typeof window === 'undefined') return;
  try {
    const data: CacheData = { repos, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save cache');
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 403 || response.status === 429) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export function usePortfolioData(): PortfolioData {
  const [repos, setRepos] = useState<Repository[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>('fallback');
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>('Carregando...');

  const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'meuphilim';
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  useEffect(() => {
    async function fetchRepos() {
      try {
        setDiagnosticInfo('Verificando cache local...');
        const cachedRepos = getCache();
        if (cachedRepos) {
          setRepos(cachedRepos);
          setAuthStatus('cached');
          setDiagnosticInfo(`Cache válido: ${cachedRepos.length} repositórios`);
          setLoading(false);
          return;
        }

        // eslint-disable-next-line no-console
        console.log('🔍 Tentando buscar repositórios...');
        setDiagnosticInfo('Conectando à API do GitHub...');

        const headers: Record<string, string> = {
          'User-Agent': 'OctoMind-Portfolio',
          Accept: 'application/vnd.github.v3+json',
        };

        if (GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
        }

        const response = await fetchWithRetry(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          { headers }
        );

        if (response.status === 403 || response.status === 429) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const remaining = response.headers.get('X-RateLimit-Remaining');
          console.warn(`Rate limit excedido. Restam: ${remaining}`);

          const cached = getCache();
          if (cached) {
            setRepos(cached);
            setAuthStatus('rate-limited');
            setDiagnosticInfo('Rate limit excedido, usando cache');
            setLoading(false);
            return;
          }
          throw new Error('Rate limit excedido');
        }

        if (response.ok) {
          const data = await response.json();
          const filteredRepos = data.filter(
            (repo: any) =>
              !repo.fork &&
              !repo.archived &&
              !repo.private &&
              repo.name &&
              !repo.name.startsWith('.'),
          );

          setRepos(filteredRepos);
          setAuthStatus('public');
          setDiagnosticInfo(
            `✅ Conectado à API do GitHub - ${filteredRepos.length} repositórios encontrados`,
          );
        } else {
          throw new Error(`API GitHub retornou: ${response.status}`);
        }
      } catch (err) {
        console.warn('⚠️ Não foi possível conectar à API do GitHub, usando dados de exemplo');
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        setAuthStatus('fallback');
        setDiagnosticInfo('⚠️ Usando dados de exemplo (não foi possível conectar à API do GitHub)');
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [GITHUB_USERNAME]);

  return {
    repos,
    loading,
    error,
    authStatus,
    diagnosticInfo,
  };
}