import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameState, GameScreen, PlayerState, CombatState, LootItem, RegionProgress, MechanicState, Enemy } from '@/types/game';
import { WEAPONS, ARMORS, SHIELDS, POTION_HEAL } from '@/data/items';
import { ENEMIES, EnemyData } from '@/data/enemies';
import { LOOT_TABLE } from '@/data/loot';

const SAVE_KEY = 'iron-oath-save';

const createNewPlayer = (): PlayerState => ({
  name: 'Guerreiro',
  level: 1,
  xp: 0,
  xpToNext: 20,
  hp: 30,
  maxHp: 30,
  baseAttack: 6,
  baseDefense: 3,
  gold: 12,
  potions: 1,
  equippedWeapon: WEAPONS[0],
  equippedArmor: ARMORS[0],
  equippedShield: SHIELDS[0],
  inventory: [],
});

const createNewProgress = (): RegionProgress => ({
  clearedCommons: [],
  alphaDefeated: false,
  captainDefeated: false,
  trollDefeated: false,
});

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcDamage(attack: number, defense: number): number {
  const base = Math.max(1, attack - defense);
  const variance = Math.max(1, Math.floor(base * 0.2));
  return base + randInt(-variance, variance);
}

interface SaveData {
  player: PlayerState;
  regionProgress: RegionProgress;
}

interface GameContextType {
  state: GameState;
  navigate: (screen: GameScreen) => void;
  newGame: () => void;
  continueGame: () => void;
  updatePlayer: (updates: Partial<PlayerState>) => void;
  saveGame: () => void;
  totalAttack: number;
  totalDefense: number;
  startCombat: (enemy?: EnemyData) => void;
  startEncounterIntro: (enemy: EnemyData) => void;
  combatAttack: () => void;
  combatDefend: () => void;
  combatHeavyAttack: () => void;
  combatPotion: () => void;
  combatFlee: () => void;
  claimVictory: () => void;
  acceptDefeat: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    let hasSave = false;
    if (saved) {
      try { JSON.parse(saved); hasSave = true; } catch { /* ignore */ }
    }
    return {
      screen: 'title' as GameScreen,
      player: createNewPlayer(),
      hasSave,
      combat: null,
      regionProgress: createNewProgress(),
      pendingEnemy: null,
    };
  });

  const navigate = useCallback((screen: GameScreen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const newGame = useCallback(() => {
    const player = createNewPlayer();
    const regionProgress = createNewProgress();
    const s: GameState = { screen: 'village', player, hasSave: false, combat: null, regionProgress, pendingEnemy: null };
    setState(s);
    localStorage.setItem(SAVE_KEY, JSON.stringify({ player, regionProgress }));
  }, []);

  const continueGame = useCallback(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved) as SaveData;
        const s: GameState = {
          screen: 'village',
          player: data.player,
          hasSave: true,
          combat: null,
          regionProgress: data.regionProgress || createNewProgress(),
          pendingEnemy: null,
        };
        setState(s);
      } catch { /* ignore */ }
    }
  }, []);

  const updatePlayer = useCallback((updates: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, player: { ...prev.player, ...updates } }));
  }, []);

  const saveGame = useCallback(() => {
    const data: SaveData = { player: state.player, regionProgress: state.regionProgress };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    setState(prev => ({ ...prev, hasSave: true }));
  }, [state.player, state.regionProgress]);

  useEffect(() => {
    if (state.screen !== 'title') {
      const data: SaveData = { player: state.player, regionProgress: state.regionProgress };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    }
  }, [state.player, state.regionProgress, state.screen]);

  const totalAttack = state.player.baseAttack + state.player.equippedWeapon.bonus;
  const totalDefense = state.player.baseDefense + state.player.equippedArmor.bonus + state.player.equippedShield.bonus;

  const startEncounterIntro = useCallback((enemy: EnemyData) => {
    setState(prev => ({ ...prev, screen: 'encounter_intro' as GameScreen, pendingEnemy: enemy }));
  }, []);

  const initMechanic = (enemy: Enemy): MechanicState | null => {
    if (!enemy.mechanic) return null;
    const m = enemy.mechanic;
    switch (m.type) {
      case 'howl':
        return { type: 'howl', triggered: false, bonusTurnsLeft: 0, bonusAttack: m.bonusAttack || 4 };
      case 'guard_stance':
        return { type: 'guard_stance', triggered: false, guardActive: false };
      case 'telegraphed_strike':
        return { type: 'telegraphed_strike', triggered: false, isCharging: false };
      default:
        return null;
    }
  };

  const startCombat = useCallback((enemy?: EnemyData) => {
    const chosen = enemy || ENEMIES[0];
    const mechanic = initMechanic(chosen);
    const combat: CombatState = {
      enemy: { ...chosen },
      enemyHp: chosen.maxHp,
      isDefending: false,
      heavyAttackUses: 2,
      log: [`${chosen.name} aparece!`],
      goldEarned: 0,
      xpEarned: 0,
      lootEarned: null,
      mechanic,
      turnCount: 0,
    };
    setState(prev => ({ ...prev, screen: 'combat' as GameScreen, combat, pendingEnemy: null }));
  }, []);

  const processMechanicPreTurn = (combat: CombatState): CombatState => {
    if (!combat.mechanic) return combat;
    const m = { ...combat.mechanic };
    const log = [...combat.log];
    const enemyDef = combat.enemy.mechanic;

    if (m.type === 'howl' && !m.triggered && combat.turnCount === 2) {
      m.triggered = true;
      m.bonusTurnsLeft = enemyDef?.bonusTurns || 2;
      log.push(`⚡ ${combat.enemy.name} uiva! A matilha responde — seu ataque aumenta!`);
    }

    if (m.type === 'guard_stance' && !m.triggered && combat.turnCount === 1) {
      m.triggered = true;
      m.guardActive = true;
      log.push(`🛡 ${combat.enemy.name} assume postura de guarda. Cuidado com o contra-ataque!`);
    }

    if (m.type === 'telegraphed_strike' && combat.turnCount >= 2 && combat.turnCount % 3 === 2) {
      m.isCharging = true;
      log.push(`⚠ ${combat.enemy.name} ergue o tronco acima da cabeça! DEFENDA-SE!`);
    }

    return { ...combat, mechanic: m, log };
  };

  const getEffectiveEnemyAttack = (combat: CombatState): number => {
    let atk = combat.enemy.attack;
    if (!combat.mechanic) return atk;
    const m = combat.mechanic;

    if (m.type === 'howl' && m.bonusTurnsLeft && m.bonusTurnsLeft > 0) {
      atk += m.bonusAttack || 4;
    }
    if (m.type === 'guard_stance' && m.guardActive) {
      atk = Math.floor(atk * (combat.enemy.mechanic?.counterMultiplier || 1.8));
    }
    if (m.type === 'telegraphed_strike' && m.isCharging) {
      atk = Math.floor(atk * (combat.enemy.mechanic?.heavyDamageMultiplier || 2.5));
    }
    return atk;
  };

  const processMechanicPostTurn = (m: MechanicState): MechanicState => {
    const next = { ...m };
    if (next.type === 'howl' && next.bonusTurnsLeft && next.bonusTurnsLeft > 0) {
      next.bonusTurnsLeft -= 1;
    }
    if (next.type === 'guard_stance' && next.guardActive) {
      next.guardActive = false;
    }
    if (next.type === 'telegraphed_strike' && next.isCharging) {
      next.isCharging = false;
    }
    return next;
  };

  const doEnemyTurn = (prev: GameState, tAtk: number, tDef: number): GameState => {
    if (!prev.combat || prev.combat.enemyHp <= 0) return prev;
    let combat = processMechanicPreTurn(prev.combat);
    const { player } = prev;

    const effectiveAtk = getEffectiveEnemyAttack(combat);
    const enemyDmg = calcDamage(effectiveAtk, tDef);
    const reducedDmg = combat.isDefending ? Math.max(1, Math.floor(enemyDmg * 0.5)) : enemyDmg;
    const newHp = Math.max(0, player.hp - reducedDmg);
    const defText = combat.isDefending ? ' (bloqueado!)' : '';
    const isHeavyHit = combat.mechanic?.type === 'telegraphed_strike' && combat.mechanic.isCharging;
    const hitLabel = isHeavyHit ? ' 💥 GOLPE DEVASTADOR!' : '';
    const log = [...combat.log, `${combat.enemy.name} ataca e causa ${reducedDmg} de dano${defText}.${hitLabel}`];

    const mechanic = combat.mechanic ? processMechanicPostTurn(combat.mechanic) : null;

    if (newHp <= 0) {
      const goldLost = Math.floor(player.gold * 0.15);
      return {
        ...prev,
        screen: 'defeat',
        player: { ...player, hp: 0 },
        combat: { ...combat, log: [...log, 'Você foi derrotado...'], isDefending: false, goldEarned: goldLost, mechanic, turnCount: combat.turnCount + 1 },
      };
    }
    return {
      ...prev,
      player: { ...player, hp: newHp },
      combat: { ...combat, log, isDefending: false, mechanic, turnCount: combat.turnCount + 1 },
    };
  };

  const doCheckVictory = (prev: GameState): GameState => {
    if (!prev.combat || prev.combat.enemyHp > 0) return prev;
    const { combat } = prev;
    const goldEarned = randInt(combat.enemy.goldReward[0], combat.enemy.goldReward[1]);
    const xpEarned = combat.enemy.xpReward;
    const lootEarned = Math.random() < 0.4 ? LOOT_TABLE[randInt(0, LOOT_TABLE.length - 1)] : null;
    return {
      ...prev,
      screen: 'victory',
      combat: { ...combat, goldEarned, xpEarned, lootEarned, log: [...combat.log, `${combat.enemy.name} foi derrotado!`] },
    };
  };

  const combatAttack = useCallback(() => {
    setState(prev => {
      if (!prev.combat) return prev;
      const tAtk = prev.player.baseAttack + prev.player.equippedWeapon.bonus;
      const tDef = prev.player.baseDefense + prev.player.equippedArmor.bonus + prev.player.equippedShield.bonus;
      const dmg = calcDamage(tAtk, prev.combat.enemy.defense);
      const newEnemyHp = Math.max(0, prev.combat.enemyHp - dmg);
      const log = [...prev.combat.log, `Você ataca e causa ${dmg} de dano.`];
      let next: GameState = { ...prev, combat: { ...prev.combat, enemyHp: newEnemyHp, log, isDefending: false } };
      next = doCheckVictory(next);
      if (next.screen !== 'victory') next = doEnemyTurn(next, tAtk, tDef);
      return next;
    });
  }, []);

  const combatDefend = useCallback(() => {
    setState(prev => {
      if (!prev.combat) return prev;
      const tAtk = prev.player.baseAttack + prev.player.equippedWeapon.bonus;
      const tDef = prev.player.baseDefense + prev.player.equippedArmor.bonus + prev.player.equippedShield.bonus;
      const log = [...prev.combat.log, 'Você se defende, preparado para o próximo golpe.'];
      let next: GameState = { ...prev, combat: { ...prev.combat, log, isDefending: true } };
      next = doEnemyTurn(next, tAtk, tDef);
      return next;
    });
  }, []);

  const combatHeavyAttack = useCallback(() => {
    setState(prev => {
      if (!prev.combat || prev.combat.heavyAttackUses <= 0) return prev;
      const tAtk = prev.player.baseAttack + prev.player.equippedWeapon.bonus;
      const tDef = prev.player.baseDefense + prev.player.equippedArmor.bonus + prev.player.equippedShield.bonus;
      const dmg = calcDamage(Math.floor(tAtk * 1.6), prev.combat.enemy.defense);
      const newEnemyHp = Math.max(0, prev.combat.enemyHp - dmg);
      const log = [...prev.combat.log, `Golpe Pesado! Você causa ${dmg} de dano!`];
      let next: GameState = {
        ...prev,
        combat: { ...prev.combat, enemyHp: newEnemyHp, log, isDefending: false, heavyAttackUses: prev.combat.heavyAttackUses - 1 },
      };
      next = doCheckVictory(next);
      if (next.screen !== 'victory') next = doEnemyTurn(next, tAtk, tDef);
      return next;
    });
  }, []);

  const combatPotion = useCallback(() => {
    setState(prev => {
      if (!prev.combat || prev.player.potions <= 0) return prev;
      const tAtk = prev.player.baseAttack + prev.player.equippedWeapon.bonus;
      const tDef = prev.player.baseDefense + prev.player.equippedArmor.bonus + prev.player.equippedShield.bonus;
      const healed = Math.min(POTION_HEAL, prev.player.maxHp - prev.player.hp);
      const newHp = prev.player.hp + healed;
      const log = [...prev.combat.log, `Você usa uma Poção de Vida e recupera ${healed} HP.`];
      let next: GameState = {
        ...prev,
        player: { ...prev.player, hp: newHp, potions: prev.player.potions - 1 },
        combat: { ...prev.combat, log, isDefending: false },
      };
      next = doEnemyTurn(next, tAtk, tDef);
      return next;
    });
  }, []);

  const combatFlee = useCallback(() => {
    setState(prev => {
      if (!prev.combat) return prev;
      if (prev.combat.enemy.type === 'boss') return prev;
      const chance = prev.combat.enemy.fleeChance;
      if (Math.random() < chance) {
        return { ...prev, screen: 'village' as GameScreen, combat: null };
      }
      const tAtk = prev.player.baseAttack + prev.player.equippedWeapon.bonus;
      const tDef = prev.player.baseDefense + prev.player.equippedArmor.bonus + prev.player.equippedShield.bonus;
      const log = [...prev.combat.log, 'Você tenta fugir, mas falha!'];
      let next: GameState = { ...prev, combat: { ...prev.combat, log, isDefending: false } };
      next = doEnemyTurn(next, tAtk, tDef);
      return next;
    });
  }, []);

  const levelUp = (player: PlayerState): PlayerState => {
    let p = { ...player };
    while (p.xp >= p.xpToNext) {
      p.xp -= p.xpToNext;
      p.level += 1;
      p.maxHp += 4;
      p.hp = p.maxHp;
      p.baseAttack += 1;
      p.baseDefense += 1;
      p.xpToNext = Math.floor(p.xpToNext * 1.4);
    }
    return p;
  };

  const claimVictory = useCallback(() => {
    setState(prev => {
      if (!prev.combat) return prev;
      const { goldEarned, xpEarned, lootEarned } = prev.combat;
      const enemyId = prev.combat.enemy.id;
      let player = {
        ...prev.player,
        gold: prev.player.gold + goldEarned,
        xp: prev.player.xp + xpEarned,
        inventory: lootEarned ? [...prev.player.inventory, lootEarned] : prev.player.inventory,
      };
      player = levelUp(player);

      const rp = { ...prev.regionProgress };
      if (prev.combat.enemy.type === 'common' && !rp.clearedCommons.includes(enemyId)) {
        rp.clearedCommons = [...rp.clearedCommons, enemyId];
      }
      if (enemyId === 'e5') rp.alphaDefeated = true;
      if (enemyId === 'e6') rp.captainDefeated = true;
      if (enemyId === 'e7') rp.trollDefeated = true;

      return { ...prev, screen: 'village' as GameScreen, player, combat: null, regionProgress: rp };
    });
  }, []);

  const acceptDefeat = useCallback(() => {
    setState(prev => {
      if (!prev.combat) return prev;
      const goldLost = prev.combat.goldEarned;
      const player = {
        ...prev.player,
        hp: prev.player.maxHp,
        gold: Math.max(0, prev.player.gold - goldLost),
      };
      return { ...prev, screen: 'village' as GameScreen, player, combat: null };
    });
  }, []);

  return (
    <GameContext.Provider value={{
      state, navigate, newGame, continueGame, updatePlayer, saveGame,
      totalAttack, totalDefense,
      startCombat, startEncounterIntro,
      combatAttack, combatDefend, combatHeavyAttack, combatPotion, combatFlee,
      claimVictory, acceptDefeat,
    }}>
      {children}
    </GameContext.Provider>
  );
};
