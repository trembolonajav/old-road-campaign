import { useGame } from '@/contexts/GameContext';
import { Trophy, Coins, Star, Package } from 'lucide-react';

const VictoryScreen = () => {
  const { state, claimVictory } = useGame();
  const { combat } = state;

  if (!combat) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />
      <div className="absolute inset-4 border-2 border-primary/20 pointer-events-none" />

      <Trophy className="w-12 h-12 text-gold mb-4 animate-pulse-gold" />
      <h1 className="font-pixel text-xl text-primary mb-2">VITÓRIA!</h1>
      <p className="font-retro text-lg text-muted-foreground mb-8">
        {combat.enemy.name} foi derrotado.
      </p>

      <div className="flex flex-col items-center gap-3 mb-10 z-20">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-gold" />
          <span className="font-retro text-xl text-gold">+{combat.goldEarned} ouro</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-xp-blue" />
          <span className="font-retro text-xl text-xp-blue">+{combat.xpEarned} XP</span>
        </div>
        {combat.lootEarned && (
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-secondary" />
            <span className="font-retro text-xl text-secondary">{combat.lootEarned.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={claimVictory}
        className="font-pixel text-sm text-foreground hover:text-primary transition-colors tracking-widest px-8 py-3 pixel-border bg-card hover:bg-muted z-20"
      >
        CONTINUAR
      </button>
    </div>
  );
};

export default VictoryScreen;
