import { useGame } from '@/contexts/GameContext';
import { Skull, Coins } from 'lucide-react';

const DefeatScreen = () => {
  const { state, acceptDefeat } = useGame();
  const { combat } = state;

  if (!combat) return null;

  const goldLost = combat.goldEarned; // stored as goldLost on defeat

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />
      <div className="absolute inset-4 border-2 border-accent/20 pointer-events-none" />

      <Skull className="w-12 h-12 text-accent mb-4" />
      <h1 className="font-pixel text-xl text-accent mb-2">DERROTA</h1>
      <p className="font-retro text-lg text-muted-foreground text-center max-w-sm mb-4">
        Você caiu em combate e foi arrastado de volta à vila. Parte de suas moedas se perdeu pelo caminho.
      </p>

      <div className="flex items-center gap-2 mb-10 z-20">
        <Coins className="w-5 h-5 text-accent" />
        <span className="font-retro text-xl text-accent">-{goldLost} ouro</span>
      </div>

      <button
        onClick={acceptDefeat}
        className="font-pixel text-sm text-foreground hover:text-primary transition-colors tracking-widest px-8 py-3 pixel-border bg-card hover:bg-muted z-20"
      >
        VOLTAR À VILA
      </button>
    </div>
  );
};

export default DefeatScreen;
