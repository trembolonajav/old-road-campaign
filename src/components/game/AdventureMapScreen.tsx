import { useGame } from '@/contexts/GameContext';
import { WORLD_REGIONS } from '@/data/regions';
import { ChevronLeft, Lock, MapPin, CheckCircle } from 'lucide-react';

const AdventureMapScreen = () => {
  const { navigate, state } = useGame();
  const { regionProgress } = state;

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      <header className="p-4 border-b-2 border-primary/30 bg-card/80">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('village')} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-pixel text-sm text-primary">MAPA DE AVENTURAS</h2>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 z-20 overflow-y-auto">
        <p className="font-retro text-lg text-muted-foreground text-center max-w-sm mb-6">
          O mundo se estende além da vila. Escolha seu destino.
        </p>

        <div className="w-full max-w-xs space-y-3">
          {WORLD_REGIONS.map((region) => {
            const isCompleted = region.id === 'estrada_velha' && regionProgress.trollDefeated;
            const isLocked = region.locked && !regionProgress.trollDefeated;
            const isActive = region.id === 'estrada_velha';

            return (
              <button
                key={region.id}
                onClick={() => {
                  if (isActive) navigate('region');
                }}
                disabled={isLocked}
                className={`
                  flex items-center gap-4 w-full px-4 py-4 pixel-border bg-card transition-all text-left group relative
                  ${isLocked ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:bg-muted cursor-pointer'}
                  ${isActive ? 'border-accent/50' : ''}
                  ${isCompleted ? 'border-hp-green/50' : ''}
                `}
              >
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-hp-green" />
                  ) : (
                    <MapPin className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-primary'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-pixel text-[10px] block ${isLocked ? 'text-muted-foreground' : isActive ? 'text-foreground group-hover:text-primary' : 'text-foreground'} transition-colors`}>
                    {region.name}
                  </span>
                  <span className="font-retro text-sm text-muted-foreground block">
                    {isLocked ? region.lockMessage : region.description}
                  </span>
                  {isCompleted && (
                    <span className="font-pixel text-[8px] text-hp-green mt-1 block">CONCLUÍDA</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdventureMapScreen;
