import { useGame } from '@/contexts/GameContext';
import { Sword, ShieldCheck, Package, Store, MapPin, Heart, Coins } from 'lucide-react';
import villageBg from '@/assets/village-bg.jpg';

const VillageScreen = () => {
  const { state, navigate, totalAttack, totalDefense } = useGame();
  const { player } = state;

  const hpPercent = (player.hp / player.maxHp) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      {/* Header - Player Status */}
      <header className="p-4 border-b-2 border-primary/30 bg-card/90 backdrop-blur-sm relative z-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-primary" />
              <span className="font-pixel text-xs text-primary">{player.name}</span>
            </div>
            <span className="font-pixel text-[10px] text-muted-foreground">Nv. {player.level}</span>
          </div>

          {/* HP Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-hp-red" />
                <span className="font-retro text-sm text-foreground">HP</span>
              </div>
              <span className="font-retro text-sm text-foreground">{player.hp}/{player.maxHp}</span>
            </div>
            <div className="w-full h-3 bg-muted pixel-border overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${hpPercent}%`,
                  backgroundColor: hpPercent > 50 ? 'hsl(var(--hp-green))' : hpPercent > 25 ? 'hsl(var(--gold))' : 'hsl(var(--hp-red))',
                }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between font-retro text-base">
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold">{player.gold}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent">⚔ {totalAttack}</span>
              <span className="text-xp-blue">🛡 {totalDefense}</span>
              <span className="text-muted-foreground">🧪 {player.potions}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Village Content with background */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-20">
        {/* Village background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={villageBg}
            alt="Vila medieval"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </div>

        <div className="relative z-10 p-6 w-full flex flex-col items-center">
          {/* Village title */}
          <div className="text-center mb-8">
            <h2 className="font-pixel text-lg text-primary mb-2">⛏ VILA</h2>
            <p className="font-retro text-lg text-muted-foreground max-w-sm">
              O fogo da fogueira crepita. O vento traz o cheiro de ferro e pão quente.
              Você está seguro... por enquanto.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <VillageButton
              icon={<MapPin className="w-5 h-5" />}
              label="AVENTURA"
              sublabel="Estrada Velha"
              onClick={() => navigate('region')}
              variant="primary"
            />
            <VillageButton
              icon={<Store className="w-5 h-5" />}
              label="MERCADOR"
              sublabel="Comprar & Vender"
              onClick={() => navigate('shop')}
            />
            <VillageButton
              icon={<Package className="w-5 h-5" />}
              label="INVENTÁRIO"
              sublabel="Equipamento & Itens"
              onClick={() => navigate('inventory')}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 border-t border-border/50 text-center relative z-20 bg-background/80 backdrop-blur-sm">
        <p className="font-retro text-xs text-muted-foreground/50">
          XP: {player.xp}/{player.xpToNext} até o próximo nível
        </p>
      </footer>
    </div>
  );
};

interface VillageButtonProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  variant?: 'primary' | 'default';
}

const VillageButton = ({ icon, label, sublabel, onClick, variant = 'default' }: VillageButtonProps) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-4 w-full px-5 py-4 pixel-border bg-card/90 backdrop-blur-sm
      hover:bg-muted transition-all duration-200 group text-left
      ${variant === 'primary' ? 'border-accent/50 hover:border-accent' : ''}
    `}
  >
    <div className={`${variant === 'primary' ? 'text-accent' : 'text-primary'} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <span className="font-pixel text-xs text-foreground group-hover:text-primary transition-colors block">
        {label}
      </span>
      <span className="font-retro text-sm text-muted-foreground">{sublabel}</span>
    </div>
  </button>
);

export default VillageScreen;
