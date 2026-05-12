'use client';

import { useState, useEffect } from 'react';
import type { Repository } from '@/types/portfolio';
import { fetchAllRepositoryLanguages, type LanguageData, type GitHubRepo } from '@/services/github.service';

export function useProjectLanguages(repos: Repository[], username: string) {
  const [repoLanguages, setRepoLanguages] = useState<Record<string, LanguageData>>({});

  useEffect(() => {
    const fetchLanguages = async () => {
      const reposForFetch = repos.map((r) => ({
        name: r.name,
      })) as unknown as GitHubRepo[];
      
      const languageData = await fetchAllRepositoryLanguages(username, reposForFetch);
      setRepoLanguages(languageData);
    };

    if (repos.length > 0) {
      fetchLanguages();
    }
  }, [repos, username]);

  return repoLanguages;
}