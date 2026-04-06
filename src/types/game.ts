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
  mechanic?: EnemyMechanicDef;
}

export type EnemyMechanicType = 'howl' | 'guard_stance' | 'telegraphed_strike';

export interface EnemyMechanicDef {
  type: EnemyMechanicType;
  name: string;
  description: string;
  bonusAttack?: number;
  bonusTurns?: number;
  counterMultiplier?: number;
  heavyDamageMultiplier?: number;
}

export interface MechanicState {
  type: EnemyMechanicType;
  triggered: boolean;
  // howl
  bonusTurnsLeft?: number;
  bonusAttack?: number;
  // guard_stance
  guardActive?: boolean;
  // telegraphed
  isCharging?: boolean;
}

export interface RoadNode {
  id: string;
  name: string;
  description: string;
  enemyId: string;
  type: 'common' | 'elite' | 'boss';
  unlockCondition: 'start' | 'clear_commons' | 'defeat_alpha' | 'defeat_captain';
}

export interface RegionProgress {
  clearedCommons: string[];
  alphaDefeated: boolean;
  captainDefeated: boolean;
  trollDefeated: boolean;
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
  mechanic: MechanicState | null;
  turnCount: number;
}

export type GameScreen = 'title' | 'village' | 'shop' | 'inventory' | 'region' | 'combat' | 'victory' | 'defeat' | 'adventure_map' | 'encounter_intro';

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  hasSave: boolean;
  combat: CombatState | null;
  regionProgress: RegionProgress;
  pendingEnemy: (Enemy & { image: string }) | null;
}
