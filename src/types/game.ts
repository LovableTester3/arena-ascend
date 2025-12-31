// Rarity types
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// Skill definitions
export interface Skill {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  icon: string;
  baseCooldown: number; // seconds
  currentCooldown: number;
  level: number;
  maxLevel: number;
  baseCost: number;
  purchased: boolean;
  active: boolean; // Is this skill currently equipped
  effect: SkillEffect;
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff';
  value: number;
  valuePerLevel: number;
}

// Pet definitions
export interface Pet {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  icon: string;
  level: number;
  maxLevel: number;
  hpBonus: number;
  hpBonusPerLevel: number;
  atkBonus: number;
  atkBonusPerLevel: number;
  owned: boolean;
  equipped: boolean;
}

// Egg definitions
export interface Egg {
  id: string;
  rarity: Rarity;
  hatchTimeRemaining: number; // seconds
  isHatching: boolean;
}

// Dungeon definitions
export type DungeonType = 'skill' | 'egg';

export interface Dungeon {
  id: string;
  type: DungeonType;
  name: string;
  description: string;
  ticketsRequired: number;
  rewards: DungeonReward;
  currentStage: number;
  currentChapter: number;
}

export interface DungeonReward {
  skillCurrency?: number;
  eggs?: number;
  commonEggChance?: number;
  rareEggChance?: number;
}

// Tech Tree definitions
export type TechCategory = 'combat' | 'resource' | 'automation';

export interface TechUpgrade {
  id: string;
  name: string;
  description: string;
  category: TechCategory;
  icon: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effect: TechEffect;
  unlocked: boolean;
  requiredTechId?: string;
}

export interface TechEffect {
  type: 'attack' | 'defense' | 'hp' | 'critChance' | 'goldBonus' | 'currencyBonus' | 'eggGen' | 'ticketRegen' | 'autoSpeed' | 'idleBonus' | 'autoSkillCd';
  value: number;
  valuePerLevel: number;
}

// Battle definitions
export interface BattleEntity {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  x: number;
  y: number;
  isPlayer: boolean;
  attackCooldown: number;
  maxAttackCooldown: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  damage: number;
  isPlayerProjectile: boolean;
  progress: number;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  value: number;
  isCrit: boolean;
  isHeal: boolean;
}

// Stage definitions
export interface Stage {
  chapter: number;
  stage: number;
  enemies: number;
  enemyHpMultiplier: number;
  enemyAtkMultiplier: number;
  goldReward: number;
  xpReward: number;
}

// Player stats
export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  critChance: number;
}

// Currency
export interface Currency {
  gold: number;
  skillCurrency: number;
}

// Dungeon Stages
export interface DungeonStages {
  skillDungeon: { chapter: number; stage: number };
  eggDungeon: { chapter: number; stage: number };
}

// Tickets
export interface Tickets {
  skillDungeon: number;
  maxSkillDungeon: number;
  eggDungeon: number;
  maxEggDungeon: number;
  lastRefresh: number; // timestamp
}

// Game screen
export type GameScreen = 'battle' | 'skills' | 'pets' | 'dungeons' | 'techTree';

// Battle state
export type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat' | 'dungeon';

// Full game state
export interface GameState {
  // UI
  currentScreen: GameScreen;
  battleState: BattleState;
  
  // Progress
  currentChapter: number;
  currentStage: number;
  highestChapter: number;
  highestStage: number;
  
  // Player
  player: PlayerStats;
  currency: Currency;
  
  // Battle
  playerEntity: BattleEntity | null;
  enemies: BattleEntity[];
  projectiles: Projectile[];
  damageNumbers: DamageNumber[];
  
  // Skills
  skills: Skill[];
  activeSkillIds: string[];
  autoSkills: boolean;
  
  // Pets
  pets: Pet[];
  eggs: Egg[];
  maxEggs: number;
  eggTimer: number;
  equippedPetId: string | null;
  
  // Dungeons
  tickets: Tickets;
  dungeonStages: DungeonStages;
  currentDungeon: DungeonType | null;
  
  // Tech Tree
  techUpgrades: TechUpgrade[];
  
  // Timestamps
  lastSaveTime: number;
  lastOfflineTime: number;
}
