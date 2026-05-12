interface LoadingScreenProps {
  diagnosticInfo?: string | null;
}

export default function LoadingScreen({ diagnosticInfo }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-xs">
        {/* Logo com animação de pulsar */}
        <div className="animate-pulse mb-6">
          <img 
            src="./apple-touch-icon.png" 
            alt="OctoMind" 
            className="w-20 h-20 mx-auto object-contain"
          />
        </div>
        
        {/* Texto de carregamento com animação sutil */}
        <div className="animate-pulse-slow">
          <p className="text-lg text-gray-700 font-medium">Carregando portfólio</p>
          <div className="flex justify-center space-x-1 mt-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>

        {diagnosticInfo && (
          <p className="mt-6 text-xs text-gray-500">{diagnosticInfo}</p>
        )}
      </div>
    </div>
  );
}