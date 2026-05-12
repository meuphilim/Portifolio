'use client';

import { useEffect, useState } from 'react';
import type { Repository, PortfolioData } from '@/types/portfolio';
import { fetchUserRepositories, FALLBACK_REPOS } from '@/services/github.service';

export function usePortfolioData(): PortfolioData {
  const [repos, setRepos] = useState<Repository[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>('fallback');
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>('Usando dados de exemplo');

  const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'meuphilim';

  useEffect(() => {
    async function loadRepos() {
      try {
        console.log('🔍 Tentando buscar repositórios...');
        setDiagnosticInfo('Tentando conectar à API do GitHub...');

        const filteredRepos = await fetchUserRepositories(GITHUB_USERNAME);

        setRepos(filteredRepos);
        setAuthStatus('public');
        setDiagnosticInfo(`✅ Conectado à API do GitHub - ${filteredRepos.length} repositórios encontrados`);
      } catch (err) {
        console.warn('⚠️ Não foi possível conectar à API do GitHub, usando dados de exemplo', err);
        setError(null);
        setAuthStatus('fallback');
        setDiagnosticInfo('⚠️ Usando dados de exemplo (não foi possível conectar à API do GitHub)');
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
  }, [GITHUB_USERNAME]);

  return {
    repos,
    loading,
    error,
    authStatus,
    diagnosticInfo,
  };
}
