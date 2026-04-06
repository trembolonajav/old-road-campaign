import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Coins, Sword, Shield, ShieldCheck, Heart } from 'lucide-react';
import { WEAPONS, ARMORS, SHIELDS, POTION_PRICE, POTION_HEAL, POTION_IMAGE } from '@/data/items';
import { Equipment } from '@/types/game';

const ShopScreen = () => {
  const { state, navigate, updatePlayer, totalAttack, totalDefense } = useGame();
  const { player } = state;

  const buyEquipment = (item: Equipment) => {
    if (player.gold < item.price) return;
    const updates: Partial<typeof player> = { gold: player.gold - item.price };
    if (item.type === 'weapon') updates.equippedWeapon = item;
    else if (item.type === 'armor') updates.equippedArmor = item;
    else if (item.type === 'shield') updates.equippedShield = item;
    updatePlayer(updates);
  };

  const buyPotion = () => {
    if (player.gold < POTION_PRICE) return;
    updatePlayer({ gold: player.gold - POTION_PRICE, potions: player.potions + 1 });
  };

  const isOwned = (item: Equipment) => {
    if (item.type === 'weapon') return player.equippedWeapon.id === item.id;
    if (item.type === 'armor') return player.equippedArmor.id === item.id;
    if (item.type === 'shield') return player.equippedShield.id === item.id;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden animate-slide-up">
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      <header className="p-4 border-b-2 border-primary/30 bg-card/80 flex items-center justify-between">
        <button onClick={() => navigate('village')} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-pixel text-[10px]">VOLTAR</span>
        </button>
        <div className="flex items-center gap-1">
          <Coins className="w-4 h-4 text-gold" />
          <span className="font-retro text-lg text-gold">{player.gold}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 z-20">
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="font-pixel text-sm text-primary text-center mb-4">🏪 MERCADOR</h2>

          <ShopSection title="⚔ ARMAS" icon={<Sword className="w-4 h-4 text-accent" />}>
            {WEAPONS.filter(w => w.price > 0).map(w => (
              <ShopItem key={w.id} item={w} owned={isOwned(w)} canAfford={player.gold >= w.price} onBuy={() => buyEquipment(w)} statLabel={`+${w.bonus} ATK`} />
            ))}
          </ShopSection>

          <ShopSection title="🛡 ARMADURAS" icon={<ShieldCheck className="w-4 h-4 text-xp-blue" />}>
            {ARMORS.filter(a => a.price > 0).map(a => (
              <ShopItem key={a.id} item={a} owned={isOwned(a)} canAfford={player.gold >= a.price} onBuy={() => buyEquipment(a)} statLabel={`+${a.bonus} DEF`} />
            ))}
          </ShopSection>

          <ShopSection title="🔰 ESCUDOS" icon={<Shield className="w-4 h-4 text-xp-blue" />}>
            {SHIELDS.filter(s => s.price > 0).map(s => (
              <ShopItem key={s.id} item={s} owned={isOwned(s)} canAfford={player.gold >= s.price} onBuy={() => buyEquipment(s)} statLabel={`+${s.bonus} DEF`} />
            ))}
          </ShopSection>

          <ShopSection title="🧪 CONSUMÍVEIS" icon={<Heart className="w-4 h-4 text-hp-green" />}>
            <div className="flex items-center justify-between p-3 pixel-border bg-card">
              <div className="flex items-center gap-3 flex-1">
                <img src={POTION_IMAGE} alt="Poção de Vida" className="w-10 h-10 object-contain pixelated" loading="lazy" />
                <div>
                  <span className="font-pixel text-[10px] text-foreground block">Poção de Vida</span>
                  <span className="font-retro text-sm text-muted-foreground">Recupera {POTION_HEAL} HP</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-retro text-sm text-muted-foreground">Tem: {player.potions}</span>
                <button
                  onClick={buyPotion}
                  disabled={player.gold < POTION_PRICE}
                  className="px-3 py-1 pixel-border bg-card text-hp-green font-pixel text-[8px] hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {POTION_PRICE} <Coins className="w-3 h-3 inline text-gold" />
                </button>
              </div>
            </div>
          </ShopSection>

          <div className="text-center pt-2">
            <p className="font-retro text-sm text-muted-foreground">
              ⚔ {totalAttack} ATK &nbsp; 🛡 {totalDefense} DEF
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const ShopSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-pixel text-[10px] text-foreground tracking-widest">{title}</h3>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const ShopItem = ({ item, owned, canAfford, onBuy, statLabel }: {
  item: Equipment; owned: boolean; canAfford: boolean; onBuy: () => void; statLabel: string;
}) => (
  <div className={`flex items-center justify-between p-3 pixel-border bg-card ${owned ? 'border-hp-green/50' : ''}`}>
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain pixelated" loading="lazy" />
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-foreground">{item.name}</span>
          {owned && <span className="font-pixel text-[8px] text-hp-green">EQUIPADO</span>}
        </div>
        <span className="font-retro text-sm text-muted-foreground block truncate">{item.description}</span>
        <span className="font-retro text-sm text-accent">{statLabel}</span>
      </div>
    </div>
    {!owned && (
      <button
        onClick={onBuy}
        disabled={!canAfford}
        className="ml-3 px-3 py-1 pixel-border bg-card text-primary font-pixel text-[8px] hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {item.price} <Coins className="w-3 h-3 inline text-gold" />
      </button>
    )}
  </div>
);

export default ShopScreen;
