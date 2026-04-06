import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameState, GameScreen, PlayerState, CombatState, LootItem } from '@/types/game';
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

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcDamage(attack: number, defense: number): number {
  const base = Math.max(1, attack - defense);
  const variance = Math.max(1, Math.floor(base * 0.2));
  return base + randInt(-variance, variance);
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
  const [state, setState] = useState<GameState>(() => ({
    screen: 'title',
    player: createNewPlayer(),
    hasSave: !!localStorage.getItem(SAVE_KEY),
    combat: null,
  }));

  const navigate = useCallback((screen: GameScreen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const newGame = useCallback(() => {
    const player = createNewPlayer();
    setState({ screen: 'village', player, hasSave: false, combat: null });
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  }, []);

  const continueGame = useCallback(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const player = JSON.parse(saved) as PlayerState;
      setState({ screen: 'village', player, hasSave: true, combat: null });
    }
  }, []);

  const updatePlayer = useCallback((updates: Partial<PlayerState>) => {
    setState(prev => {
      const newPlayer = { ...prev.player, ...updates };
      return { ...prev, player: newPlayer };
    });
  }, []);

  const saveGame = useCallback(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state.player));
    setState(prev => ({ ...prev, hasSave: true }));
  }, [state.player]);

  useEffect(() => {
    if (state.screen !== 'title') {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state.player));
    }
  }, [state.player, state.screen]);

  const totalAttack = state.player.baseAttack + state.player.equippedWeapon.bonus;
  const totalDefense = state.player.baseDefense + state.player.equippedArmor.bonus + state.player.equippedShield.bonus;

  // ─── Combat ───────────────────────────────────────────

  const startCombat = useCallback((enemy?: EnemyData) => {
    const commons = ENEMIES.filter(e => e.type === 'common');
    const elites = ENEMIES.filter(e => e.type === 'elite');
    const bosses = ENEMIES.filter(e => e.type === 'boss');
    let chosen: EnemyData;
    if (enemy) {
      chosen = enemy;
    } else {
      const roll = Math.random();
      if (roll < 0.65) chosen = commons[randInt(0, commons.length - 1)];
      else if (roll < 0.90) chosen = elites[randInt(0, elites.length - 1)];
      else chosen = bosses[randInt(0, bosses.length - 1)];
    }
    const combat: CombatState = {
      enemy: { ...chosen },
      enemyHp: chosen.maxHp,
      isDefending: false,
      heavyAttackUses: 2,
      log: [`${chosen.name} aparece!`],
      goldEarned: 0,
      xpEarned: 0,
      lootEarned: null,
    };
    setState(prev => ({ ...prev, screen: 'combat', combat }));
  }, []);

  const doEnemyTurn = (prev: GameState, tAtk: number, tDef: number): GameState => {
    if (!prev.combat || prev.combat.enemyHp <= 0) return prev;
    const { combat, player } = prev;
    const enemyDmg = calcDamage(combat.enemy.attack, tDef);
    const reducedDmg = combat.isDefending ? Math.max(1, Math.floor(enemyDmg * 0.5)) : enemyDmg;
    const newHp = Math.max(0, player.hp - reducedDmg);
    const defText = combat.isDefending ? ' (bloqueado!)' : '';
    const log = [...combat.log, `${combat.enemy.name} ataca e causa ${reducedDmg} de dano${defText}.`];

    if (newHp <= 0) {
      const goldLost = Math.floor(player.gold * 0.15);
      return {
        ...prev,
        screen: 'defeat',
        player: { ...player, hp: 0 },
        combat: { ...combat, log: [...log, 'Você foi derrotado...'], isDefending: false, goldEarned: goldLost },
      };
    }
    return {
      ...prev,
      player: { ...player, hp: newHp },
      combat: { ...combat, log, isDefending: false },
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
      let player = {
        ...prev.player,
        gold: prev.player.gold + goldEarned,
        xp: prev.player.xp + xpEarned,
        inventory: lootEarned ? [...prev.player.inventory, lootEarned] : prev.player.inventory,
      };
      player = levelUp(player);
      return { ...prev, screen: 'village' as GameScreen, player, combat: null };
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
      startCombat, combatAttack, combatDefend, combatHeavyAttack, combatPotion, combatFlee,
      claimVictory, acceptDefeat,
    }}>
      {children}
    </GameContext.Provider>
  );
};
