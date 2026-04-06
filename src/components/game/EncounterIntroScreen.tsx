import { useGame } from '@/contexts/GameContext';
import { EnemyData } from '@/data/enemies';
import { Skull, Crown, Sword } from 'lucide-react';

const EncounterIntroScreen = () => {
  const { state, startCombat } = useGame();
  const enemy = state.pendingEnemy as EnemyData | null;

  if (!enemy) return null;

  const isBoss = enemy.type === 'boss';
  const isElite = enemy.type === 'elite';

  const typeLabel = isBoss ? 'CHEFE' : isElite ? 'ELITE' : 'COMUM';
  const typeColor = isBoss ? 'text-gold' : isElite ? 'text-accent' : 'text-muted-foreground';
  const borderColor = isBoss ? 'border-gold/60' : isElite ? 'border-accent/60' : 'border-primary/30';
  const bgGlow = isBoss ? 'shadow-[0_0_60px_hsl(var(--gold)/0.15)]' : isElite ? 'shadow-[0_0_40px_hsl(var(--accent)/0.15)]' : '';

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden items-center justify-center">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      <div className={`max-w-sm w-full mx-4 p-6 pixel-border bg-card/95 ${borderColor} ${bgGlow} z-20 animate-slide-up`}>
        {/* Type badge */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isBoss ? <Crown className="w-5 h-5 text-gold animate-pulse-gold" /> :
             isElite ? <Skull className="w-4 h-4 text-accent" /> :
             <Sword className="w-4 h-4 text-muted-foreground" />}
            <span className={`font-pixel text-[10px] ${typeColor} tracking-[0.2em]`}>{typeLabel}</span>
            {isBoss && <Crown className="w-5 h-5 text-gold animate-pulse-gold" />}
          </div>
        </div>

        {/* Enemy portrait */}
        <div className="flex justify-center mb-4">
          <div className={`relative ${isBoss ? 'w-36 h-36' : isElite ? 'w-28 h-28' : 'w-24 h-24'}`}>
            <img
              src={enemy.image}
              alt={enemy.name}
              className={`w-full h-full object-contain ${isBoss ? 'animate-flicker' : ''}`}
            />
            {(isBoss || isElite) && (
              <div className={`absolute inset-0 rounded-full ${isBoss ? 'bg-gold/5' : 'bg-accent/5'} animate-pulse`} />
            )}
          </div>
        </div>

        {/* Name */}
        <h2 className={`font-pixel text-center mb-3 ${isBoss ? 'text-base text-gold pixel-glow' : isElite ? 'text-sm text-accent' : 'text-xs text-foreground'}`}>
          {enemy.name}
        </h2>

        {/* Description / microcopy */}
        <p className="font-retro text-base text-muted-foreground text-center mb-4 leading-relaxed">
          {enemy.description}
        </p>

        {/* Mechanic warning for elite/boss */}
        {enemy.mechanic && (
          <div className={`p-3 mb-4 border ${isBoss ? 'border-gold/30 bg-gold/5' : 'border-accent/30 bg-accent/5'}`}>
            <p className={`font-pixel text-[8px] ${isBoss ? 'text-gold' : 'text-accent'} mb-1`}>
              ⚡ {enemy.mechanic.name}
            </p>
            <p className="font-retro text-sm text-muted-foreground">
              {enemy.mechanic.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-5 font-retro text-sm text-muted-foreground">
          <span>HP {enemy.maxHp}</span>
          <span>ATK {enemy.attack}</span>
          <span>DEF {enemy.defense}</span>
        </div>

        {/* Boss: no flee warning */}
        {isBoss && (
          <p className="font-pixel text-[8px] text-accent text-center mb-4 animate-flicker">
            ⚠ FUGA IMPOSSÍVEL
          </p>
        )}

        {/* Fight button */}
        <button
          onClick={() => startCombat(enemy as EnemyData)}
          className={`
            w-full py-4 pixel-border font-pixel text-xs tracking-wider transition-all active:scale-95
            ${isBoss
              ? 'bg-gold/10 text-gold border-gold/50 hover:bg-gold/20'
              : isElite
                ? 'bg-accent/10 text-accent border-accent/50 hover:bg-accent/20'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }
          `}
        >
          {isBoss ? '⚔ ENFRENTAR O CHEFE' : isElite ? '⚔ ENFRENTAR ELITE' : '⚔ LUTAR'}
        </button>
      </div>
    </div>
  );
};

export default EncounterIntroScreen;
