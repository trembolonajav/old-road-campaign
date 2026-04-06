import { useGame } from '@/contexts/GameContext';
import { ENEMIES } from '@/data/enemies';
import { ROAD_NODES } from '@/data/regions';
import { MapPin, Skull, Crown, ChevronLeft, Lock, CheckCircle } from 'lucide-react';

const RegionScreen = () => {
  const { navigate, startEncounterIntro, state } = useGame();
  const { regionProgress } = state;

  const allCommonsCleared = ['e1', 'e2', 'e3', 'e4'].every(id => regionProgress.clearedCommons.includes(id));

  const isNodeUnlocked = (node: typeof ROAD_NODES[0]) => {
    switch (node.unlockCondition) {
      case 'start': return true;
      case 'clear_commons': return allCommonsCleared;
      case 'defeat_alpha': return regionProgress.alphaDefeated;
      case 'defeat_captain': return regionProgress.captainDefeated;
      default: return false;
    }
  };

  const isNodeCleared = (node: typeof ROAD_NODES[0]) => {
    if (node.type === 'common') return regionProgress.clearedCommons.includes(node.enemyId);
    if (node.enemyId === 'e5') return regionProgress.alphaDefeated;
    if (node.enemyId === 'e6') return regionProgress.captainDefeated;
    if (node.enemyId === 'e7') return regionProgress.trollDefeated;
    return false;
  };

  const getUnlockMessage = (node: typeof ROAD_NODES[0]) => {
    switch (node.unlockCondition) {
      case 'clear_commons': return 'Derrote todos os inimigos comuns';
      case 'defeat_alpha': return 'Derrote o Lobo Alfa';
      case 'defeat_captain': return 'Derrote o Capitão';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      <header className="p-4 border-b-2 border-primary/30 bg-card/80">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('adventure_map')} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-pixel text-sm text-primary">ESTRADA VELHA</h2>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 z-20 overflow-y-auto">
        <p className="font-retro text-lg text-muted-foreground text-center max-w-sm mb-6">
          Uma rota antiga infestada por criaturas e bandidos. Siga o caminho.
        </p>

        <div className="w-full max-w-xs mb-6">
          <div className="flex items-center justify-between font-retro text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{regionProgress.clearedCommons.length}/4 comuns</span>
          </div>
          <div className="w-full h-2 bg-muted overflow-hidden rounded-sm mt-1">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(regionProgress.clearedCommons.length / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="w-full max-w-xs space-y-2">
          {ROAD_NODES.map((node, i) => {
            const enemy = ENEMIES.find(e => e.id === node.enemyId)!;
            const unlocked = isNodeUnlocked(node);
            const cleared = isNodeCleared(node);
            const isElite = node.type === 'elite';
            const isBoss = node.type === 'boss';
            const borderClass = isBoss ? 'border-gold/40' : isElite ? 'border-accent/40' : '';
            const typeIcon = isBoss ? <Crown className="w-3.5 h-3.5 text-gold" /> :
                             isElite ? <Skull className="w-3.5 h-3.5 text-accent" /> : null;

            return (
              <div key={node.id}>
                {i > 0 && (
                  <div className="flex justify-center -mb-1 -mt-1">
                    <div className={`w-0.5 h-4 ${unlocked ? 'bg-primary/40' : 'bg-muted'}`} />
                  </div>
                )}
                <button
                  onClick={() => unlocked && startEncounterIntro(enemy)}
                  disabled={!unlocked}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 pixel-border bg-card transition-all text-left group relative
                    ${!unlocked ? 'opacity-35 cursor-not-allowed grayscale' : 'hover:bg-muted cursor-pointer'}
                    ${borderClass}
                    ${cleared ? 'border-hp-green/30' : ''}
                  `}
                >
                  <div className={`
                    w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-pixel
                    ${cleared ? 'text-hp-green' : !unlocked ? 'text-muted-foreground' : isBoss ? 'text-gold' : isElite ? 'text-accent' : 'text-primary'}
                  `}>
                    {!unlocked ? <Lock className="w-4 h-4" /> :
                     cleared ? <CheckCircle className="w-5 h-5" /> :
                     <span>{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {typeIcon}
                      <span className={`font-pixel text-[10px] ${
                        !unlocked ? 'text-muted-foreground' :
                        isBoss ? 'text-gold' : isElite ? 'text-accent' :
                        'text-foreground group-hover:text-primary'
                      } transition-colors`}>
                        {enemy.name}
                      </span>
                    </div>
                    <span className="font-retro text-xs text-muted-foreground block">{node.name}</span>
                    {unlocked && !cleared && (
                      <span className="font-retro text-xs text-muted-foreground/60 italic block mt-0.5">
                        &quot;{node.description}&quot;
                      </span>
                    )}
                    {!unlocked && (
                      <span className="font-retro text-xs text-accent/70 block mt-0.5">
                        🔒 {getUnlockMessage(node)}
                      </span>
                    )}
                  </div>
                  {unlocked && (
                    <img src={enemy.image} alt={enemy.name} className={`w-10 h-10 object-contain flex-shrink-0 ${cleared ? 'opacity-40' : ''}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default RegionScreen;
