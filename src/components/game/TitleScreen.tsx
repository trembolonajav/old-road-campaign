import { useGame } from '@/contexts/GameContext';
import { Sword, Shield } from 'lucide-react';

const TitleScreen = () => {
  const { newGame, continueGame, state } = useGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />
      
      {/* Decorative border frame */}
      <div className="absolute inset-4 border-2 border-primary/20 pointer-events-none" />
      <div className="absolute inset-6 border border-primary/10 pointer-events-none" />

      {/* Top decorative swords */}
      <div className="flex items-center gap-4 mb-8">
        <Sword className="w-8 h-8 text-primary rotate-[-30deg]" />
        <Shield className="w-10 h-10 text-primary/60" />
        <Sword className="w-8 h-8 text-primary rotate-[30deg] scale-x-[-1]" />
      </div>

      {/* Title */}
      <h1 className="font-pixel text-3xl md:text-5xl text-primary animate-pulse-gold tracking-wider mb-2">
        IRON OATH
      </h1>
      <p className="font-retro text-xl text-muted-foreground tracking-[0.3em] mb-16">
        RPG MEDIEVAL SOLO
      </p>

      {/* Menu options */}
      <div className="flex flex-col items-center gap-4 z-20">
        <button
          onClick={newGame}
          className="font-pixel text-sm md:text-base text-foreground hover:text-primary transition-colors duration-200 tracking-widest px-8 py-3 pixel-border bg-card hover:bg-muted"
        >
          NOVO JOGO
        </button>
        
        <button
          onClick={continueGame}
          disabled={!state.hasSave}
          className="font-pixel text-sm md:text-base tracking-widest px-8 py-3 pixel-border bg-card transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-foreground hover:text-primary hover:bg-muted disabled:hover:bg-card disabled:hover:text-foreground"
        >
          CONTINUAR
        </button>
      </div>

      {/* Bottom flavor */}
      <p className="absolute bottom-8 font-retro text-sm text-muted-foreground/50 tracking-widest">
        v0.1 — Versão de Teste
      </p>
    </div>
  );
};

export default TitleScreen;
