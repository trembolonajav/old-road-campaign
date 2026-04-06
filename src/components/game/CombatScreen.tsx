import { useGame } from '@/contexts/GameContext';
import { Sword, Shield, Zap, Heart, Wind, Coins } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CombatScreen = () => {
  const { state, combatAttack, combatDefend, combatHeavyAttack, combatPotion, combatFlee, totalAttack, totalDefense } = useGame();
  const { player, combat } = state;
  const logRef = useRef<HTMLDivElement>(null);
  const [shaking, setShaking] = useState(false);
  const [enemyFlash, setEnemyFlash] = useState(false);
  const prevPlayerHp = useRef(player.hp);
  const prevEnemyHp = useRef(combat?.enemyHp ?? 0);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combat?.log]);

  // Shake when player takes damage
  useEffect(() => {
    if (player.hp < prevPlayerHp.current) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 400);
      return () => clearTimeout(t);
    }
    prevPlayerHp.current = player.hp;
  }, [player.hp]);

  // Flash when enemy takes damage
  useEffect(() => {
    if (combat && combat.enemyHp < prevEnemyHp.current) {
      setEnemyFlash(true);
      const t = setTimeout(() => setEnemyFlash(false), 300);
      prevEnemyHp.current = combat.enemyHp;
      return () => clearTimeout(t);
    }
    if (combat) prevEnemyHp.current = combat.enemyHp;
  }, [combat?.enemyHp]);

  if (!combat) return null;

  const playerHpPercent = (player.hp / player.maxHp) * 100;
  const enemyHpPercent = (combat.enemyHp / combat.enemy.maxHp) * 100;

  const typeLabel = combat.enemy.type === 'common' ? 'Comum' : combat.enemy.type === 'elite' ? 'Elite' : 'Chefe';
  const typeColor = combat.enemy.type === 'common' ? 'text-muted-foreground' : combat.enemy.type === 'elite' ? 'text-accent' : 'text-gold';

  return (
    <div className={`flex flex-col min-h-screen bg-background relative overflow-hidden animate-slide-up ${shaking ? 'animate-shake' : ''}`}>
      <div className="absolute inset-0 retro-scanline pointer-events-none z-10" />

      {/* Enemy Section */}
      <div className="p-4 bg-card/60 border-b border-border">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`font-pixel text-[10px] ${typeColor} tracking-widest`}>{typeLabel.toUpperCase()}</span>
              <h2 className="font-pixel text-sm text-foreground">{combat.enemy.name}</h2>
            </div>
            <span className="font-retro text-base text-foreground">{combat.enemyHp}/{combat.enemy.maxHp}</span>
          </div>
          <div className="w-full h-3 bg-muted pixel-border overflow-hidden">
            <div className="h-full transition-all duration-500" style={{
              width: `${enemyHpPercent}%`,
              backgroundColor: enemyHpPercent > 50 ? 'hsl(var(--hp-red))' : enemyHpPercent > 25 ? 'hsl(var(--gold))' : 'hsl(var(--hp-green))',
            }} />
          </div>

          <div className="flex justify-center mt-3 relative">
            <img
              src={combat.enemy.image}
              alt={combat.enemy.name}
              className={`w-24 h-24 md:w-32 md:h-32 object-contain transition-all duration-200 ${enemyFlash ? 'animate-flash-red' : ''}`}
            />
            {enemyFlash && (
              <div className="absolute inset-0 bg-primary/20 animate-flash-white rounded-lg" />
            )}
          </div>
        </div>
      </div>

      {/* Combat Log */}
      <div ref={logRef} className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full z-20">
        <div className="space-y-1">
          {combat.log.map((msg, i) => (
            <p key={i} className="font-retro text-base text-foreground/80 animate-slide-down" style={{ animationDelay: `${Math.max(0, (i - combat.log.length + 3)) * 50}ms` }}>
              {'>'} {msg}
            </p>
          ))}
        </div>
      </div>

      {/* Player Status */}
      <div className="border-t border-border bg-card/80 p-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-hp-red" />
              <span className="font-retro text-sm text-foreground">HP {player.hp}/{player.maxHp}</span>
            </div>
            <div className="flex items-center gap-3 font-retro text-sm">
              <span className="text-foreground">⚔ {totalAttack}</span>
              <span className="text-foreground">🛡 {totalDefense}</span>
              <span className="text-muted-foreground">🧪 {player.potions}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted overflow-hidden rounded-sm">
            <div className="h-full transition-all duration-500" style={{
              width: `${playerHpPercent}%`,
              backgroundColor: playerHpPercent > 50 ? 'hsl(var(--hp-green))' : playerHpPercent > 25 ? 'hsl(var(--gold))' : 'hsl(var(--hp-red))',
            }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t-2 border-primary/30 bg-card p-4">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2">
          <CombatButton icon={<Sword className="w-4 h-4" />} label="ATACAR" onClick={combatAttack} />
          <CombatButton icon={<Shield className="w-4 h-4" />} label="DEFENDER" onClick={combatDefend} />
          <CombatButton
            icon={<Zap className="w-4 h-4" />}
            label={`PESADO (${combat.heavyAttackUses})`}
            onClick={combatHeavyAttack}
            disabled={combat.heavyAttackUses <= 0}
            variant="accent"
          />
          <CombatButton
            icon={<Heart className="w-4 h-4" />}
            label={`POÇÃO (${player.potions})`}
            onClick={combatPotion}
            disabled={player.potions <= 0}
            variant="heal"
          />
          <CombatButton
            icon={<Wind className="w-4 h-4" />}
            label="FUGIR"
            onClick={combatFlee}
            disabled={combat.enemy.type === 'boss'}
            variant="muted"
          />
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-gold" />
              <span className="font-retro text-base text-gold">{player.gold}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CombatButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'accent' | 'heal' | 'muted';
}

const CombatButton = ({ icon, label, onClick, disabled = false, variant = 'default' }: CombatButtonProps) => {
  const variantClasses = {
    default: 'text-primary hover:bg-primary/10',
    accent: 'text-accent hover:bg-accent/10',
    heal: 'text-hp-green hover:bg-hp-green/10',
    muted: 'text-muted-foreground hover:bg-muted',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-1 py-3 px-2 pixel-border bg-card 
        transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
        active:scale-95
        ${variantClasses[variant]}
      `}
    >
      {icon}
      <span className="font-pixel text-[8px] tracking-wider">{label}</span>
    </button>
  );
};

export default CombatScreen;
