import Image from 'next/image';

interface OctoMindSectionProps {
  authStatus: string | null;
  repoCount: number;
}

export default function OctoMindSection({ authStatus, repoCount }: OctoMindSectionProps) {
  return (
    <section id="octomind" className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-16 h-16 mr-4">
              <Image
                src="./OctoMind.png"
                alt="OctoMind - Polvo inteligente representando automação GitHub"
                width={64}
                height={64}
                quality={100}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Projeto OctoMind</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema inteligente de automação que mantém este portfólio sempre atualizado com os
            repositórios mais recentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Cards com estilo consistente */}
          {[
            {
              title: '⚙️ Como Funciona',
              content: (
                <>
                  <p className="mb-4 text-gray-600">
                    Este portfólio <strong>OctoMind</strong> é automatizado através de:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {[
                      'Script Node.js coleta dados dos repositórios via API do GitHub',
                      'GitHub Actions executa o script automaticamente a cada 12 horas',
                      'Vercel & GitHub Pages fazem deploy automático em múltiplas plataformas',
                      'Cache Inteligente otimiza requisições e melhora performance',
                    ].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </>
              ),
            },
            {
              title: '🛠️ Tecnologias',
              content: (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Node.js', color: 'bg-green-500' },
                    { name: 'GitHub Actions', color: 'bg-blue-500' },
                    { name: 'GitHub Pages', color: 'bg-purple-500' },
                    { name: 'GitHub API', color: 'bg-orange-500' },
                    { name: 'Vercel', color: 'bg-black' },
                    { name: 'Next.js', color: 'bg-blue-600' },
                  ].map((tech) => (
                    <div key={tech.name} className="flex items-center space-x-2">
                      <span className={`w-2 h-2 ${tech.color} rounded-full`}></span>
                      <span className="text-gray-700">{tech.name}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: '✨ Benefícios',
              content: (
                <ul className="space-y-2 text-gray-700">
                  {[
                    'Atualização automática sem intervenção manual',
                    'Estatísticas sempre precisas e atualizadas',
                    'Deploy em múltiplas plataformas simultaneamente',
                    'Fallback inteligente em caso de falhas',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: '📊 Monitoramento',
              content: (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Status da API</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {authStatus === 'token'
                        ? 'Autenticada'
                        : authStatus === 'public'
                          ? 'Pública'
                          : 'Demonstração'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Repositórios</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {repoCount} ativos
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Última atualização</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ),
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">{card.title.split(' ')[0]}</span>
                {card.title.split(' ').slice(1).join(' ')}
              </h3>
              {card.content}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Interessado no OctoMind?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Este sistema pode ser adaptado para automatizar seu próprio portfólio. Confira o
              código-fonte e documentação completa no GitHub.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/meuphilim/OctoMind"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Código-Fonte
              </a>
              <a
                href="https://github.com/meuphilim/OctoMind/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Documentação
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
