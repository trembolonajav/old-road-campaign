import { useGame } from '@/contexts/GameContext';
import { Trophy, Coins, Star, Package, Shield, Crown } from 'lucide-react';

const TROLL_ID = 'e7';
const FIRST_KILL_BONUS_GOLD = 25;

const VictoryScreen = () => {
  const { state, claimVictory } = useGame();
  const { combat, regionProgress } = state;

  if (!combat) return null;

  const isTroll = combat.enemy.id === TROLL_ID;
  const isFirstTrollKill = isTroll && !regionProgress.trollDefeated;

  if (isTroll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />
        
        {/* Ornate boss border */}
        <div className="absolute inset-3 border-2 border-gold/40 pointer-events-none" />
        <div className="absolute inset-5 border border-gold/20 pointer-events-none" />

        {/* Crown icon for boss */}
        <Crown className="w-16 h-16 text-gold mb-2 animate-pulse-gold" />

        <h1 className="font-pixel text-2xl text-gold mb-1 tracking-wider">
          {isFirstTrollKill ? 'CONQUISTA DESBLOQUEADA' : 'O TROLL CAI NOVAMENTE'}
        </h1>

        {isFirstTrollKill && (
          <p className="font-pixel text-sm text-primary mb-2 tracking-widest animate-pulse">
            ★ ESTRADA VELHA CONQUISTADA ★
          </p>
        )}

        <p className="font-retro text-lg text-muted-foreground mb-2 text-center max-w-md px-4">
          {isFirstTrollKill
            ? 'A ponte velha estremece pela última vez. O Troll tomba — e a estrada está livre.'
            : 'O Troll da Ponte cai mais uma vez. A estrada permanece segura.'}
        </p>

        {isFirstTrollKill && (
          <p className="font-retro text-sm text-muted-foreground/70 italic mb-6 text-center max-w-sm px-4">
            "Poucos ousaram cruzar. Você não apenas cruzou — conquistou."
          </p>
        )}

        {!isFirstTrollKill && <div className="mb-6" />}

        {/* Rewards */}
        <div className="flex flex-col items-center gap-3 mb-4 z-20 pixel-border bg-card/80 px-8 py-5">
          <span className="font-pixel text-xs text-muted-foreground tracking-widest mb-1">RECOMPENSAS</span>
          
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

          {isFirstTrollKill && (
            <>
              <div className="w-full h-px bg-gold/30 my-1" />
              <span className="font-pixel text-xs text-gold/80 tracking-widest">BÔNUS PRIMEIRA VITÓRIA</span>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                <span className="font-retro text-xl text-gold">+{FIRST_KILL_BONUS_GOLD} ouro</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={claimVictory}
          className="font-pixel text-sm text-gold hover:text-primary transition-colors tracking-widest px-10 py-3 pixel-border bg-card hover:bg-muted z-20 mt-4 border-gold/40"
        >
          {isFirstTrollKill ? 'REIVINDICAR CONQUISTA' : 'CONTINUAR'}
        </button>
      </div>
    );
  }

  // Standard victory for non-boss enemies
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
