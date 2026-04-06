import { useGame } from '@/contexts/GameContext';
import { ArrowLeft, Coins, Sword, ShieldCheck, Shield, Package } from 'lucide-react';
import { Equipment, LootItem } from '@/types/game';

const InventoryScreen = () => {
  const { state, navigate, updatePlayer, totalAttack, totalDefense } = useGame();
  const { player } = state;

  const isEquipment = (item: Equipment | LootItem): item is Equipment => 'type' in item && 'bonus' in item;

  const equipItem = (item: Equipment) => {
    const updates: Partial<typeof player> = {};
    if (item.type === 'weapon') updates.equippedWeapon = item;
    else if (item.type === 'armor') updates.equippedArmor = item;
    else if (item.type === 'shield') updates.equippedShield = item;
    updates.inventory = player.inventory.filter(i => i.id !== item.id);
    const oldItem = item.type === 'weapon' ? player.equippedWeapon : item.type === 'armor' ? player.equippedArmor : player.equippedShield;
    if (oldItem.price > 0) {
      updates.inventory = [...(updates.inventory || player.inventory), oldItem];
    }
    updatePlayer(updates);
  };

  const sellItem = (item: Equipment | LootItem) => {
    const sellPrice = isEquipment(item) ? Math.floor(item.price * 0.5) : (item as LootItem).sellPrice;
    updatePlayer({
      gold: player.gold + sellPrice,
      inventory: player.inventory.filter(i => i.id !== item.id),
    });
  };

  const lootItems = player.inventory.filter(i => !isEquipment(i));
  const equipItems = player.inventory.filter(i => isEquipment(i)) as Equipment[];

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
          <h2 className="font-pixel text-sm text-primary text-center mb-4">📦 INVENTÁRIO</h2>

          {/* Equipped */}
          <div>
            <h3 className="font-pixel text-[10px] text-foreground tracking-widest mb-2">⚔ EQUIPADO</h3>
            <div className="space-y-2">
              <EquippedSlot label="Arma" item={player.equippedWeapon} stat={`+${player.equippedWeapon.bonus} ATK`} icon={<Sword className="w-3.5 h-3.5 text-accent" />} />
              <EquippedSlot label="Armadura" item={player.equippedArmor} stat={`+${player.equippedArmor.bonus} DEF`} icon={<ShieldCheck className="w-3.5 h-3.5 text-xp-blue" />} />
              <EquippedSlot label="Escudo" item={player.equippedShield} stat={`+${player.equippedShield.bonus} DEF`} icon={<Shield className="w-3.5 h-3.5 text-xp-blue" />} />
            </div>
            <p className="font-retro text-sm text-muted-foreground mt-2 text-center">
              Total: ⚔ {totalAttack} ATK &nbsp; 🛡 {totalDefense} DEF
            </p>
          </div>

          {/* Equipment in inventory */}
          {equipItems.length > 0 && (
            <div>
              <h3 className="font-pixel text-[10px] text-foreground tracking-widest mb-2">🎒 EQUIPAMENTOS</h3>
              <div className="space-y-2">
                {equipItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 pixel-border bg-card">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-9 h-9 object-contain pixelated" loading="lazy" />
                      )}
                      <div className="min-w-0">
                        <span className="font-pixel text-[10px] text-foreground block">{item.name}</span>
                        <span className="font-retro text-sm text-accent">+{item.bonus} {item.type === 'weapon' ? 'ATK' : 'DEF'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => equipItem(item)} className="px-2 py-1 pixel-border bg-card text-hp-green font-pixel text-[8px] hover:bg-muted transition-colors">
                        EQUIPAR
                      </button>
                      <button onClick={() => sellItem(item)} className="px-2 py-1 pixel-border bg-card text-gold font-pixel text-[8px] hover:bg-muted transition-colors">
                        {Math.floor(item.price * 0.5)} <Coins className="w-3 h-3 inline text-gold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loot */}
          {lootItems.length > 0 && (
            <div>
              <h3 className="font-pixel text-[10px] text-foreground tracking-widest mb-2">💎 TESOUROS</h3>
              <div className="space-y-2">
                {lootItems.map((item, i) => (
                  <div key={`${item.id}-${i}`} className="flex items-center justify-between p-3 pixel-border bg-card">
                    <div className="flex-1 min-w-0">
                      <span className="font-pixel text-[10px] text-foreground block">{item.name}</span>
                      <span className="font-retro text-sm text-muted-foreground">{item.description}</span>
                    </div>
                    <button onClick={() => sellItem(item)} className="ml-3 px-2 py-1 pixel-border bg-card text-gold font-pixel text-[8px] hover:bg-muted transition-colors whitespace-nowrap">
                      {(item as LootItem).sellPrice} <Coins className="w-3 h-3 inline text-gold" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {equipItems.length === 0 && lootItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-retro text-lg text-muted-foreground">Inventário vazio</p>
              <p className="font-retro text-sm text-muted-foreground/60">Derrote inimigos para encontrar itens</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const EquippedSlot = ({ label, item, stat, icon }: { label: string; item: Equipment; stat: string; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between p-3 pixel-border bg-card border-primary/30">
    <div className="flex items-center gap-3">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-9 h-9 object-contain pixelated" loading="lazy" />
      )}
      <div>
        <span className="font-pixel text-[8px] text-muted-foreground block">{label}</span>
        <span className="font-pixel text-[10px] text-foreground">{item.name}</span>
      </div>
    </div>
    <span className="font-retro text-sm text-accent">{stat}</span>
  </div>
);

export default InventoryScreen;
