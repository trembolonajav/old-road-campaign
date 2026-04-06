export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield';
  bonus: number;
  price: number;
  description: string;
  image?: string;
}

export interface LootItem {
  id: string;
  name: string;
  sellPrice: number;
  description: string;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  baseAttack: number;
  baseDefense: number;
  gold: number;
  potions: number;
  equippedWeapon: Equipment;
  equippedArmor: Equipment;
  equippedShield: Equipment;
  inventory: (Equipment | LootItem)[];
}

export interface Enemy {
  id: string;
  name: string;
  type: 'common' | 'elite' | 'boss';
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: [number, number];
  fleeChance: number;
  description: string;
}

export interface CombatState {
  enemy: Enemy & { image: string };
  enemyHp: number;
  isDefending: boolean;
  heavyAttackUses: number;
  log: string[];
  goldEarned: number;
  xpEarned: number;
  lootEarned: LootItem | null;
}

export type GameScreen = 'title' | 'village' | 'shop' | 'inventory' | 'region' | 'combat' | 'victory' | 'defeat';

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  hasSave: boolean;
  combat: CombatState | null;
}
