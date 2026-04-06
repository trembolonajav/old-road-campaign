import { useGame } from '@/contexts/GameContext';
import { ENEMIES } from '@/data/enemies';
import { MapPin, Skull, Crown, ChevronLeft } from 'lucide-react';

const RegionScreen = () => {
  const { navigate, startCombat } = useGame();

  const commons = ENEMIES.filter(e => e.type === 'common');
  const elites = ENEMIES.filter(e => e.type === 'elite');
  const bosses = ENEMIES.filter(e => e.type === 'boss');

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      <header className="p-4 border-b-2 border-primary/30 bg-card/80">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('village')} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-pixel text-sm text-primary">ESTRADA VELHA</h2>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 z-20 overflow-y-auto">
        <p className="font-retro text-lg text-muted-foreground text-center max-w-sm mb-8">
          Uma rota antiga infestada por criaturas e bandidos. Escolha seu encontro.
        </p>

        <div className="w-full max-w-xs space-y-6">
          <div>
            <h3 className="font-pixel text-[10px] text-muted-foreground mb-3 tracking-widest">ENCONTROS COMUNS</h3>
            <div className="space-y-2">
              {commons.map(enemy => (
                <button key={enemy.id} onClick={() => startCombat(enemy)}
                  className="flex items-center gap-3 w-full px-4 py-3 pixel-border bg-card hover:bg-muted transition-all text-left group">
                  <img src={enemy.image} alt={enemy.name} className="w-10 h-10 object-contain" />
                  <div className="flex-1">
                    <span className="font-pixel text-[10px] text-foreground group-hover:text-primary transition-colors block">{enemy.name}</span>
                    <span className="font-retro text-sm text-muted-foreground">HP {enemy.maxHp} · ATK {enemy.attack}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-pixel text-[10px] text-accent mb-3 tracking-widest flex items-center gap-2">
              <Skull className="w-3.5 h-3.5" /> ELITES
            </h3>
            <div className="space-y-2">
              {elites.map(enemy => (
                <button key={enemy.id} onClick={() => startCombat(enemy)}
                  className="flex items-center gap-3 w-full px-4 py-3 pixel-border bg-card hover:bg-muted transition-all text-left group border-accent/40">
                  <img src={enemy.image} alt={enemy.name} className="w-10 h-10 object-contain" />
                  <div className="flex-1">
                    <span className="font-pixel text-[10px] text-accent group-hover:text-primary transition-colors block">{enemy.name}</span>
                    <span className="font-retro text-sm text-muted-foreground">HP {enemy.maxHp} · ATK {enemy.attack}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-pixel text-[10px] text-gold mb-3 tracking-widest flex items-center gap-2">
              <Crown className="w-3.5 h-3.5" /> CHEFE
            </h3>
            <div className="space-y-2">
              {bosses.map(enemy => (
                <button key={enemy.id} onClick={() => startCombat(enemy)}
                  className="flex items-center gap-3 w-full px-4 py-3 pixel-border bg-card hover:bg-muted transition-all text-left group border-gold/40">
                  <img src={enemy.image} alt={enemy.name} className="w-10 h-10 object-contain" />
                  <div className="flex-1">
                    <span className="font-pixel text-[10px] text-gold group-hover:text-primary transition-colors block">{enemy.name}</span>
                    <span className="font-retro text-sm text-muted-foreground">HP {enemy.maxHp} · ATK {enemy.attack}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegionScreen;
