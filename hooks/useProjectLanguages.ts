'use client';

import { useState, useEffect } from 'react';
import type { Repository } from '@/types/portfolio';
import { fetchRepositoryLanguages } from '@/services/github.service';

export function useProjectLanguages(repos: Repository[], username: string) {
  const [repoLanguages, setRepoLanguages] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadLanguages = async () => {
      setLoading(true);
      const langData: Record<string, Record<string, number>> = {};

      // Limitamos a busca simultânea para evitar Rate Limit excedido rapidamente
      for (const repo of repos.slice(0, 6)) { // Apenas os que vão ser mostrados na página inicial
        try {
          const data = await fetchRepositoryLanguages(username, repo.name);
          langData[repo.name] = data;
        } catch (error) {
          console.error(`Erro ao buscar linguagens para ${repo.name}:`, error);
        }
      }

      if (isMounted) {
        setRepoLanguages(langData);
        setLoading(false);
      }
    };

    if (repos.length > 0) {
      loadLanguages();
    }

    return () => {
      isMounted = false;
    };
  }, [repos, username]);

  return { repoLanguages, loading };
}
