import type { Repository } from '@/types/portfolio';
import { getLanguageEmoji, getLanguageColors } from '@/utils/portfolio';
import { useProjectLanguages } from '@/hooks/useProjectLanguages';
import React from 'react';

interface ProjectsSectionProps {
  repos: Repository[];
  username: string;
}

export default function ProjectsSection({ repos, username }: ProjectsSectionProps) {
  const { repoLanguages } = useProjectLanguages(repos, username);
  const colors = getLanguageColors();

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">🗂️ Meus Projetos</h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Explore alguns dos meus trabalhos e contribuições de código aberto
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.slice(0, 6).map((repo) => {
            const totalBytes = repoLanguages[repo.name]
              ? Object.values(repoLanguages[repo.name]).reduce((a, b) => a + b, 0)
              : 0;

            const languages = repoLanguages[repo.name]
              ? Object.entries(repoLanguages[repo.name])
                  .map(([lang, bytes]) => ({
                    name: lang,
                    percentage: ((bytes / totalBytes) * 100).toFixed(1),
                  }))
                  .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
                  .slice(0, 3)
              : [];

            return (
              <div
                key={repo.id}
                className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">{repo.name}</h3>
                    <div className="flex space-x-2 text-sm text-gray-500">
                      <span className="flex items-center">⭐ {repo.stargazers_count}</span>
                      <span className="flex items-center">🍴 {repo.forks_count}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {repo.description || 'Sem descrição disponível.'}
                  </p>

                  {/* Linguagem principal */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getLanguageEmoji(repo.language)}</span>
                      <span className="text-sm text-gray-600">{repo.language || 'N/A'}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Atualizado em {new Date(repo.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Barra de porcentagem por linguagem */}
                  {languages.length > 0 && (
                    <div className="mb-4">
                      {languages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-2 mb-1">
                          <div
                            className="h-2 rounded-full overflow-hidden w-full bg-gray-200"
                            title={`${lang.name}: ${lang.percentage}%`}
                          >
                            <div
                              className="h-full group relative"
                              style={{
                                width: `${lang.percentage}%`,
                                backgroundColor: `#${colors[lang.name] || colors['Outros'] || '9CA3AF'}`,
                              }}
                            >
                              {parseFloat(lang.percentage) > 10 && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white mix-blend-difference">
                                  {Math.round(parseFloat(lang.percentage))}%
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs whitespace-nowrap w-24">
                            {lang.name} ({lang.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                      {repo.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{repo.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex space-x-2 mt-auto">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ver Código
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {repos.length > 6 && (
          <div className="text-center mt-12">
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Todos os Projetos
            </a>
          </div>
        )}
      </div>
    </section>
  );
}