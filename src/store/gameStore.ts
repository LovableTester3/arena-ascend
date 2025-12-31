import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GameScreen,
  Skill,
  Pet,
  Egg,
  TechUpgrade,
  BattleEntity,
  Projectile,
  DamageNumber,
  Stage,
  DungeonType,
  BattleState,
} from '@/types/game';

// Initial skills
const initialSkills: Skill[] = [
  {
    id: 'bomb',
    name: 'Meteor Bomb',
    description: 'Drops a powerful bomb from the sky dealing massive damage',
    rarity: 'rare',
    icon: '💣',
    baseCooldown: 10,
    currentCooldown: 0,
    level: 1,
    maxLevel: 10,
    baseCost: 50,
    purchased: false,
    active: false,
    effect: { type: 'damage', value: 50, valuePerLevel: 15 },
  },
  {
    id: 'power-attack',
    name: 'Power Strike',
    description: 'A devastating attack dealing 2x damage',
    rarity: 'common',
    icon: '⚔️',
    baseCooldown: 10,
    currentCooldown: 0,
    level: 1,
    maxLevel: 10,
    baseCost: 30,
    purchased: false,
    active: false,
    effect: { type: 'damage', value: 30, valuePerLevel: 10 },
  },
  {
    id: 'life-regen',
    name: 'Healing Light',
    description: 'Regenerates 20% of max HP',
    rarity: 'common',
    icon: '💚',
    baseCooldown: 20,
    currentCooldown: 0,
    level: 1,
    maxLevel: 10,
    baseCost: 40,
    purchased: false,
    active: false,
    effect: { type: 'heal', value: 0.2, valuePerLevel: 0.02 },
  },
];

// Initial pets
const initialPets: Pet[] = [
  {
    id: 'wolf',
    name: 'Shadow Wolf',
    description: 'A fierce wolf that boosts your attack',
    rarity: 'common',
    icon: '🐺',
    level: 1,
    maxLevel: 10,
    hpBonus: 10,
    hpBonusPerLevel: 5,
    atkBonus: 5,
    atkBonusPerLevel: 3,
    owned: false,
    equipped: false,
  },
  {
    id: 'cat',
    name: 'Lucky Cat',
    description: 'A mystical cat that brings fortune',
    rarity: 'common',
    icon: '🐱',
    level: 1,
    maxLevel: 10,
    hpBonus: 15,
    hpBonusPerLevel: 4,
    atkBonus: 3,
    atkBonusPerLevel: 2,
    owned: false,
    equipped: false,
  },
  {
    id: 'dragon',
    name: 'Baby Dragon',
    description: 'A powerful dragon with great potential',
    rarity: 'rare',
    icon: '🐲',
    level: 1,
    maxLevel: 10,
    hpBonus: 25,
    hpBonusPerLevel: 8,
    atkBonus: 10,
    atkBonusPerLevel: 5,
    owned: false,
    equipped: false,
  },
  {
    id: 'phoenix',
    name: 'Phoenix Chick',
    description: 'A legendary bird of rebirth',
    rarity: 'rare',
    icon: '🔥',
    level: 1,
    maxLevel: 10,
    hpBonus: 20,
    hpBonusPerLevel: 6,
    atkBonus: 12,
    atkBonusPerLevel: 6,
    owned: false,
    equipped: false,
  },
];

// Initial tech upgrades
const initialTechUpgrades: TechUpgrade[] = [
  // Combat
  {
    id: 'atk-boost',
    name: 'Attack Training',
    description: 'Increases base attack damage',
    category: 'combat',
    icon: '⚔️',
    level: 0,
    maxLevel: 20,
    baseCost: 100,
    costMultiplier: 1.5,
    effect: { type: 'attack', value: 0, valuePerLevel: 5 },
    unlocked: true,
  },
  {
    id: 'def-boost',
    name: 'Defense Training',
    description: 'Increases base defense',
    category: 'combat',
    icon: '🛡️',
    level: 0,
    maxLevel: 20,
    baseCost: 100,
    costMultiplier: 1.5,
    effect: { type: 'defense', value: 0, valuePerLevel: 3 },
    unlocked: true,
  },
  {
    id: 'hp-boost',
    name: 'Vitality Training',
    description: 'Increases max HP',
    category: 'combat',
    icon: '❤️',
    level: 0,
    maxLevel: 20,
    baseCost: 100,
    costMultiplier: 1.5,
    effect: { type: 'hp', value: 0, valuePerLevel: 20 },
    unlocked: true,
  },
  {
    id: 'crit-boost',
    name: 'Critical Training',
    description: 'Increases critical hit chance',
    category: 'combat',
    icon: '💥',
    level: 0,
    maxLevel: 10,
    baseCost: 200,
    costMultiplier: 2,
    effect: { type: 'critChance', value: 0, valuePerLevel: 0.02 },
    unlocked: true,
  },
  // Resource
  {
    id: 'gold-boost',
    name: 'Gold Fortune',
    description: 'Increases gold drops from battles',
    category: 'resource',
    icon: '💰',
    level: 0,
    maxLevel: 20,
    baseCost: 150,
    costMultiplier: 1.6,
    effect: { type: 'goldBonus', value: 0, valuePerLevel: 0.1 },
    unlocked: true,
  },
  {
    id: 'currency-boost',
    name: 'Skill Crystal Mining',
    description: 'Increases skill currency drops',
    category: 'resource',
    icon: '💎',
    level: 0,
    maxLevel: 20,
    baseCost: 150,
    costMultiplier: 1.6,
    effect: { type: 'currencyBonus', value: 0, valuePerLevel: 0.1 },
    unlocked: true,
  },
  {
    id: 'egg-gen',
    name: 'Egg Collector',
    description: 'Faster egg generation',
    category: 'resource',
    icon: '🥚',
    level: 0,
    maxLevel: 10,
    baseCost: 200,
    costMultiplier: 2,
    effect: { type: 'eggGen', value: 0, valuePerLevel: 0.1 },
    unlocked: true,
  },
  {
    id: 'ticket-regen',
    name: 'Dungeon Pass',
    description: 'Faster ticket regeneration',
    category: 'resource',
    icon: '🎫',
    level: 0,
    maxLevel: 5,
    baseCost: 300,
    costMultiplier: 2.5,
    effect: { type: 'ticketRegen', value: 0, valuePerLevel: 0.1 },
    unlocked: true,
  },
  // Automation
  {
    id: 'auto-speed',
    name: 'Battle Speed',
    description: 'Increases auto-battle speed',
    category: 'automation',
    icon: '⚡',
    level: 0,
    maxLevel: 10,
    baseCost: 250,
    costMultiplier: 2,
    effect: { type: 'autoSpeed', value: 0, valuePerLevel: 0.1 },
    unlocked: true,
  },
  {
    id: 'idle-bonus',
    name: 'Idle Mastery',
    description: 'Increases offline rewards',
    category: 'automation',
    icon: '😴',
    level: 0,
    maxLevel: 10,
    baseCost: 300,
    costMultiplier: 2,
    effect: { type: 'idleBonus', value: 0, valuePerLevel: 0.15 },
    unlocked: true,
  },
  {
    id: 'auto-skill-cd',
    name: 'Skill Efficiency',
    description: 'Reduces skill cooldowns in auto mode',
    category: 'automation',
    icon: '⏱️',
    level: 0,
    maxLevel: 5,
    baseCost: 400,
    costMultiplier: 2.5,
    effect: { type: 'autoSkillCd', value: 0, valuePerLevel: 0.05 },
    unlocked: true,
  },
];

// Helper to generate stage data
export const getStageData = (chapter: number, stage: number): Stage => {
  const stageNumber = (chapter - 1) * 10 + stage;
  return {
    chapter,
    stage,
    enemies: 1 + Math.floor(stageNumber / 5),
    enemyHpMultiplier: 1 + (stageNumber - 1) * 0.3,
    enemyAtkMultiplier: 1 + (stageNumber - 1) * 0.2,
    goldReward: 10 + stageNumber * 5,
    xpReward: 5 + stageNumber * 3,
  };
};

// Generate unique ID
let idCounter = 0;
export const generateId = () => `${Date.now()}-${idCounter++}`;

// Initial state
const initialState: Omit<GameState, 'setScreen' | 'startBattle' | 'updateBattle' | 'purchaseSkill' | 'upgradeSkill' | 'toggleSkillActive' | 'useSkill' | 'hatchEgg' | 'equipPet' | 'upgradeTech' | 'enterDungeon' | 'exitDungeon' | 'setAutoSkills' | 'addDamageNumber' | 'removeDamageNumber' | 'calculateOfflineProgress' | 'addProjectile' | 'updateProjectiles' | 'removeProjectile'> = {
  currentScreen: 'battle',
  battleState: 'idle',
  currentChapter: 1,
  currentStage: 1,
  highestChapter: 1,
  highestStage: 1,
  player: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    baseHp: 100,
    baseAttack: 15,
    baseDefense: 5,
    critChance: 0.05,
  },
  currency: {
    gold: 0,
    skillCurrency: 100, // Start with some to buy first skill
  },
  playerEntity: null,
  enemies: [],
  projectiles: [],
  damageNumbers: [],
  skills: initialSkills,
  activeSkillIds: [],
  autoSkills: false,
  pets: initialPets,
  eggs: [],
  maxEggs: 10,
  eggTimer: 0,
  equippedPetId: null,
  tickets: {
    skillDungeon: 2,
    maxSkillDungeon: 5,
    eggDungeon: 2,
    maxEggDungeon: 5,
    lastRefresh: Date.now(),
  },
  currentDungeon: null,
  techUpgrades: initialTechUpgrades,
  lastSaveTime: Date.now(),
  lastOfflineTime: Date.now(),
};

interface GameStore extends GameState {
  setScreen: (screen: GameScreen) => void;
  startBattle: () => void;
  updateBattle: (deltaTime: number) => void;
  purchaseSkill: (skillId: string) => void;
  upgradeSkill: (skillId: string) => void;
  toggleSkillActive: (skillId: string) => void;
  useSkill: (skillId: string) => void;
  hatchEgg: (eggId: string) => void;
  startHatchingEgg: (eggId: string) => void;
  equipPet: (petId: string) => void;
  upgradeTech: (techId: string) => void;
  enterDungeon: (type: DungeonType) => void;
  exitDungeon: (victory: boolean) => void;
  setAutoSkills: (auto: boolean) => void;
  addDamageNumber: (x: number, y: number, value: number, isCrit: boolean, isHeal?: boolean) => void;
  removeDamageNumber: (id: string) => void;
  calculateOfflineProgress: () => void;
  addProjectile: (projectile: Omit<Projectile, 'id' | 'progress'>) => void;
  updateProjectiles: (deltaTime: number) => void;
  removeProjectile: (id: string) => void;
  updateEggTimer: (deltaTime: number) => void;
  updateHatchingEggs: (deltaTime: number) => void;
  updateSkillCooldowns: (deltaTime: number) => void;
  getCalculatedStats: () => { hp: number; attack: number; defense: number; critChance: number };
  getTechBonus: (type: string) => number;
  winBattle: () => void;
  loseBattle: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: (screen) => {
        set({ currentScreen: screen });
        // Don't auto-start battle from here - let BattleArena handle it
      },

      getCalculatedStats: () => {
        const state = get();
        const { player, pets, equippedPetId, techUpgrades } = state;
        
        let hp = player.baseHp;
        let attack = player.baseAttack;
        let defense = player.baseDefense;
        let critChance = player.critChance;

        // Add pet bonuses
        if (equippedPetId) {
          const pet = pets.find(p => p.id === equippedPetId);
          if (pet && pet.owned) {
            hp += pet.hpBonus + (pet.level - 1) * pet.hpBonusPerLevel;
            attack += pet.atkBonus + (pet.level - 1) * pet.atkBonusPerLevel;
          }
        }

        // Add tech bonuses
        techUpgrades.forEach(tech => {
          if (tech.level > 0) {
            switch (tech.effect.type) {
              case 'hp':
                hp += tech.level * tech.effect.valuePerLevel;
                break;
              case 'attack':
                attack += tech.level * tech.effect.valuePerLevel;
                break;
              case 'defense':
                defense += tech.level * tech.effect.valuePerLevel;
                break;
              case 'critChance':
                critChance += tech.level * tech.effect.valuePerLevel;
                break;
            }
          }
        });

        // Add level bonuses
        hp += (player.level - 1) * 10;
        attack += (player.level - 1) * 2;
        defense += (player.level - 1) * 1;

        return { hp, attack, defense, critChance };
      },

      getTechBonus: (type) => {
        const tech = get().techUpgrades.find(t => t.effect.type === type);
        if (tech && tech.level > 0) {
          return tech.level * tech.effect.valuePerLevel;
        }
        return 0;
      },

      startBattle: () => {
        const state = get();
        const stats = state.getCalculatedStats();
        const stageData = getStageData(state.currentChapter, state.currentStage);

        // Create player entity
        const playerEntity: BattleEntity = {
          id: 'player',
          name: 'Hero',
          hp: stats.hp,
          maxHp: stats.hp,
          attack: stats.attack,
          defense: stats.defense,
          x: 80,
          y: 150,
          isPlayer: true,
          attackCooldown: 0,
          maxAttackCooldown: 1.5,
        };

        // Create enemies
        const enemies: BattleEntity[] = [];
        const baseEnemyHp = 50 * stageData.enemyHpMultiplier;
        const baseEnemyAtk = 8 * stageData.enemyAtkMultiplier;
        
        for (let i = 0; i < stageData.enemies; i++) {
          enemies.push({
            id: generateId(),
            name: `Enemy ${i + 1}`,
            hp: baseEnemyHp,
            maxHp: baseEnemyHp,
            attack: baseEnemyAtk,
            defense: 2 + Math.floor(stageData.enemyAtkMultiplier),
            x: 240 + (i % 2) * 40,
            y: 120 + Math.floor(i / 2) * 60,
            isPlayer: false,
            attackCooldown: Math.random() * 2,
            maxAttackCooldown: 2,
          });
        }

        set({
          playerEntity,
          enemies,
          projectiles: [],
          damageNumbers: [],
          battleState: 'fighting',
        });
      },

      updateBattle: (deltaTime) => {
        const state = get();
        if (state.battleState !== 'fighting') return;
        if (!state.playerEntity) return;

        const speedBonus = 1 + state.getTechBonus('autoSpeed');
        const adjustedDelta = deltaTime * speedBonus;

        // Update player attack cooldown
        let updatedPlayer = { ...state.playerEntity };
        updatedPlayer.attackCooldown -= adjustedDelta;

        // Player attacks
        if (updatedPlayer.attackCooldown <= 0 && state.enemies.length > 0) {
          const target = state.enemies[0];
          state.addProjectile({
            x: updatedPlayer.x + 20,
            y: updatedPlayer.y + 15,
            targetX: target.x,
            targetY: target.y + 15,
            damage: updatedPlayer.attack,
            isPlayerProjectile: true,
          });
          updatedPlayer.attackCooldown = updatedPlayer.maxAttackCooldown;
        }

        // Update enemy attack cooldowns and attacks
        const updatedEnemies = state.enemies.map(enemy => {
          const updated = { ...enemy };
          updated.attackCooldown -= adjustedDelta;
          
          if (updated.attackCooldown <= 0 && updatedPlayer) {
            state.addProjectile({
              x: updated.x,
              y: updated.y + 15,
              targetX: updatedPlayer.x + 20,
              targetY: updatedPlayer.y + 15,
              damage: updated.attack,
              isPlayerProjectile: false,
            });
            updated.attackCooldown = updated.maxAttackCooldown;
          }
          
          return updated;
        });

        set({
          playerEntity: updatedPlayer,
          enemies: updatedEnemies,
        });

        // Update projectiles
        state.updateProjectiles(adjustedDelta);
      },

      addProjectile: (projectileData) => {
        set(state => ({
          projectiles: [
            ...state.projectiles,
            {
              ...projectileData,
              id: generateId(),
              progress: 0,
            },
          ],
        }));
      },

      updateProjectiles: (deltaTime) => {
        const state = get();
        const projectileSpeed = 3;

        let updatedProjectiles: Projectile[] = [];
        let updatedPlayer = state.playerEntity ? { ...state.playerEntity } : null;
        let updatedEnemies = [...state.enemies];
        const stats = state.getCalculatedStats();

        state.projectiles.forEach(proj => {
          const updated = { ...proj };
          updated.progress += deltaTime * projectileSpeed;

          if (updated.progress >= 1) {
            // Projectile hit
            if (updated.isPlayerProjectile && updatedEnemies.length > 0) {
              // Find closest enemy to target
              const targetEnemy = updatedEnemies.find(e => 
                Math.abs(e.x - updated.targetX) < 50 && Math.abs(e.y + 15 - updated.targetY) < 50
              );
              
              if (targetEnemy) {
                const isCrit = Math.random() < stats.critChance;
                const damage = Math.max(1, updated.damage - targetEnemy.defense) * (isCrit ? 2 : 1);
                targetEnemy.hp -= damage;
                state.addDamageNumber(targetEnemy.x + 20, targetEnemy.y - 10, Math.round(damage), isCrit);

                if (targetEnemy.hp <= 0) {
                  updatedEnemies = updatedEnemies.filter(e => e.id !== targetEnemy.id);
                }
              }
            } else if (!updated.isPlayerProjectile && updatedPlayer) {
              const damage = Math.max(1, updated.damage - stats.defense);
              updatedPlayer.hp -= damage;
              state.addDamageNumber(updatedPlayer.x + 20, updatedPlayer.y - 10, Math.round(damage), false);
            }
          } else {
            updatedProjectiles.push(updated);
          }
        });

        set({
          projectiles: updatedProjectiles,
          playerEntity: updatedPlayer,
          enemies: updatedEnemies,
        });

        // Check win/lose conditions
        if (updatedPlayer && updatedPlayer.hp <= 0) {
          state.loseBattle();
        } else if (updatedEnemies.length === 0) {
          state.winBattle();
        }
      },

      removeProjectile: (id) => {
        set(state => ({
          projectiles: state.projectiles.filter(p => p.id !== id),
        }));
      },

      winBattle: () => {
        const state = get();
        const stageData = getStageData(state.currentChapter, state.currentStage);
        
        const goldBonus = 1 + state.getTechBonus('goldBonus');
        const currencyBonus = 1 + state.getTechBonus('currencyBonus');

        let newGold = state.currency.gold + Math.round(stageData.goldReward * goldBonus);
        let newXp = state.player.xp + stageData.xpReward;
        let newLevel = state.player.level;
        let newXpToNext = state.player.xpToNextLevel;

        // Level up check
        while (newXp >= newXpToNext) {
          newXp -= newXpToNext;
          newLevel++;
          newXpToNext = Math.floor(newXpToNext * 1.5);
        }

        // Dungeon rewards
        let newSkillCurrency = state.currency.skillCurrency;
        let newEggs = [...state.eggs];
        
        if (state.currentDungeon === 'skill') {
          const dungeonReward = 20 + state.currentChapter * 10 + state.currentStage * 2;
          newSkillCurrency += Math.round(dungeonReward * currencyBonus);
        } else if (state.currentDungeon === 'egg') {
          // Add 2 eggs with rarity chance
          for (let i = 0; i < 2 && newEggs.length < state.maxEggs; i++) {
            const rarity = Math.random() < 0.3 ? 'rare' : 'common';
            newEggs.push({
              id: generateId(),
              rarity,
              hatchTimeRemaining: 10,
              isHatching: false,
            });
          }
        }

        // Progress to next stage
        let newChapter = state.currentChapter;
        let newStage = state.currentStage + 1;
        
        if (newStage > 10) {
          newStage = 1;
          newChapter++;
          if (newChapter > 3) {
            newChapter = 3;
            newStage = 10;
          }
        }

        // Exit dungeon if in one
        if (state.currentDungeon) {
          set({
            battleState: 'victory',
            currentDungeon: null,
            currency: { gold: newGold, skillCurrency: newSkillCurrency },
            eggs: newEggs,
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              xpToNextLevel: newXpToNext,
            },
          });
          
          // Restart main battle after short delay
          setTimeout(() => {
            get().startBattle();
          }, 1500);
        } else {
          set({
            battleState: 'victory',
            currentChapter: newChapter,
            currentStage: newStage,
            highestChapter: Math.max(state.highestChapter, newChapter),
            highestStage: newChapter > state.highestChapter ? newStage : Math.max(state.highestStage, newStage),
            currency: { gold: newGold, skillCurrency: newSkillCurrency },
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              xpToNextLevel: newXpToNext,
            },
          });

          // Auto start next battle
          setTimeout(() => {
            get().startBattle();
          }, 1000);
        }
      },

      loseBattle: () => {
        const state = get();
        
        if (state.currentDungeon) {
          set({
            battleState: 'defeat',
            currentDungeon: null,
          });
          
          // Restart main battle
          setTimeout(() => {
            get().startBattle();
          }, 1500);
        } else {
          set({ battleState: 'defeat' });
          
          // Restart same stage
          setTimeout(() => {
            get().startBattle();
          }, 1500);
        }
      },

      purchaseSkill: (skillId) => {
        set(state => {
          const skill = state.skills.find(s => s.id === skillId);
          if (!skill || skill.purchased) return state;
          if (state.currency.skillCurrency < skill.baseCost) return state;

          return {
            currency: {
              ...state.currency,
              skillCurrency: state.currency.skillCurrency - skill.baseCost,
            },
            skills: state.skills.map(s =>
              s.id === skillId ? { ...s, purchased: true } : s
            ),
          };
        });
      },

      upgradeSkill: (skillId) => {
        set(state => {
          const skill = state.skills.find(s => s.id === skillId);
          if (!skill || !skill.purchased || skill.level >= skill.maxLevel) return state;
          
          const upgradeCost = Math.floor(skill.baseCost * Math.pow(1.5, skill.level));
          if (state.currency.skillCurrency < upgradeCost) return state;

          return {
            currency: {
              ...state.currency,
              skillCurrency: state.currency.skillCurrency - upgradeCost,
            },
            skills: state.skills.map(s =>
              s.id === skillId ? { ...s, level: s.level + 1 } : s
            ),
          };
        });
      },

      toggleSkillActive: (skillId) => {
        set(state => {
          const skill = state.skills.find(s => s.id === skillId);
          if (!skill || !skill.purchased) return state;

          const isCurrentlyActive = state.activeSkillIds.includes(skillId);
          
          if (isCurrentlyActive) {
            return {
              activeSkillIds: state.activeSkillIds.filter(id => id !== skillId),
              skills: state.skills.map(s =>
                s.id === skillId ? { ...s, active: false } : s
              ),
            };
          } else {
            // Max 2 active skills
            if (state.activeSkillIds.length >= 2) return state;
            
            return {
              activeSkillIds: [...state.activeSkillIds, skillId],
              skills: state.skills.map(s =>
                s.id === skillId ? { ...s, active: true } : s
              ),
            };
          }
        });
      },

      useSkill: (skillId) => {
        const state = get();
        const skill = state.skills.find(s => s.id === skillId);
        if (!skill || !skill.active || skill.currentCooldown > 0) return;
        if (state.battleState !== 'fighting' || !state.playerEntity) return;

        let updatedPlayer = { ...state.playerEntity };
        let updatedEnemies = [...state.enemies];

        const effectValue = skill.effect.value + (skill.level - 1) * skill.effect.valuePerLevel;

        if (skill.effect.type === 'damage') {
          // Damage all enemies
          updatedEnemies = updatedEnemies.map(enemy => {
            const damage = effectValue;
            state.addDamageNumber(enemy.x + 20, enemy.y - 10, damage, true);
            return { ...enemy, hp: enemy.hp - damage };
          }).filter(e => e.hp > 0);
        } else if (skill.effect.type === 'heal') {
          const healAmount = Math.floor(updatedPlayer.maxHp * effectValue);
          updatedPlayer.hp = Math.min(updatedPlayer.maxHp, updatedPlayer.hp + healAmount);
          state.addDamageNumber(updatedPlayer.x + 20, updatedPlayer.y - 10, healAmount, false, true);
        }

        const cdReduction = 1 - state.getTechBonus('autoSkillCd');
        
        set({
          playerEntity: updatedPlayer,
          enemies: updatedEnemies,
          skills: state.skills.map(s =>
            s.id === skillId ? { ...s, currentCooldown: s.baseCooldown * cdReduction } : s
          ),
        });

        // Check win condition
        if (updatedEnemies.length === 0) {
          get().winBattle();
        }
      },

      updateSkillCooldowns: (deltaTime) => {
        const state = get();
        
        // Auto use skills if enabled
        if (state.autoSkills && state.battleState === 'fighting') {
          state.activeSkillIds.forEach(skillId => {
            const skill = state.skills.find(s => s.id === skillId);
            if (skill && skill.currentCooldown <= 0) {
              state.useSkill(skillId);
            }
          });
        }

        set({
          skills: state.skills.map(s => ({
            ...s,
            currentCooldown: Math.max(0, s.currentCooldown - deltaTime),
          })),
        });
      },

      setAutoSkills: (auto) => {
        set({ autoSkills: auto });
      },

      updateEggTimer: (deltaTime) => {
        const state = get();
        const eggGenSpeed = 1 + state.getTechBonus('eggGen');
        
        let newTimer = state.eggTimer + deltaTime * eggGenSpeed;
        let newEggs = [...state.eggs];
        
        while (newTimer >= 15 && newEggs.length < state.maxEggs) {
          newTimer -= 15;
          const rarity = Math.random() < 0.2 ? 'rare' : 'common';
          newEggs.push({
            id: generateId(),
            rarity,
            hatchTimeRemaining: 10,
            isHatching: false,
          });
        }

        set({
          eggTimer: newTimer,
          eggs: newEggs,
        });
      },

      updateHatchingEggs: (deltaTime) => {
        set(state => ({
          eggs: state.eggs.map(egg => {
            if (!egg.isHatching) return egg;
            const remaining = egg.hatchTimeRemaining - deltaTime;
            return { ...egg, hatchTimeRemaining: remaining };
          }),
        }));

        // Check for hatched eggs
        const state = get();
        state.eggs.forEach(egg => {
          if (egg.isHatching && egg.hatchTimeRemaining <= 0) {
            state.hatchEgg(egg.id);
          }
        });
      },

      startHatchingEgg: (eggId) => {
        set(state => ({
          eggs: state.eggs.map(egg =>
            egg.id === eggId ? { ...egg, isHatching: true } : egg
          ),
        }));
      },

      hatchEgg: (eggId) => {
        set(state => {
          const egg = state.eggs.find(e => e.id === eggId);
          if (!egg) return state;

          // Find a pet of matching rarity that isn't owned
          const availablePets = state.pets.filter(p => p.rarity === egg.rarity && !p.owned);
          
          let updatedPets = state.pets;
          if (availablePets.length > 0) {
            const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
            updatedPets = state.pets.map(p =>
              p.id === randomPet.id ? { ...p, owned: true } : p
            );
          } else {
            // All pets of this rarity owned - give upgrade currency or duplicate
            const ownedPets = state.pets.filter(p => p.rarity === egg.rarity && p.owned);
            if (ownedPets.length > 0) {
              const randomPet = ownedPets[Math.floor(Math.random() * ownedPets.length)];
              if (randomPet.level < randomPet.maxLevel) {
                updatedPets = state.pets.map(p =>
                  p.id === randomPet.id ? { ...p, level: p.level + 1 } : p
                );
              }
            }
          }

          return {
            eggs: state.eggs.filter(e => e.id !== eggId),
            pets: updatedPets,
          };
        });
      },

      equipPet: (petId) => {
        set(state => {
          const pet = state.pets.find(p => p.id === petId);
          if (!pet || !pet.owned) return state;

          const newEquipped = state.equippedPetId === petId ? null : petId;
          
          return {
            equippedPetId: newEquipped,
            pets: state.pets.map(p => ({
              ...p,
              equipped: p.id === petId ? !p.equipped : false,
            })),
          };
        });
      },

      upgradeTech: (techId) => {
        set(state => {
          const tech = state.techUpgrades.find(t => t.id === techId);
          if (!tech || !tech.unlocked || tech.level >= tech.maxLevel) return state;

          const cost = Math.floor(tech.baseCost * Math.pow(tech.costMultiplier, tech.level));
          if (state.currency.gold < cost) return state;

          return {
            currency: {
              ...state.currency,
              gold: state.currency.gold - cost,
            },
            techUpgrades: state.techUpgrades.map(t =>
              t.id === techId ? { ...t, level: t.level + 1 } : t
            ),
          };
        });
      },

      enterDungeon: (type) => {
        const state = get();
        const ticketKey = type === 'skill' ? 'skillDungeon' : 'eggDungeon';
        
        if (state.tickets[ticketKey] <= 0) return;

        set({
          tickets: {
            ...state.tickets,
            [ticketKey]: state.tickets[ticketKey] - 1,
          },
          currentDungeon: type,
          battleState: 'idle',
        });

        // Start dungeon battle
        get().startBattle();
      },

      exitDungeon: (victory) => {
        if (victory) {
          get().winBattle();
        } else {
          get().loseBattle();
        }
      },

      addDamageNumber: (x, y, value, isCrit, isHeal = false) => {
        const id = generateId();
        set(state => ({
          damageNumbers: [...state.damageNumbers, { id, x, y, value, isCrit, isHeal }],
        }));

        // Auto remove after animation
        setTimeout(() => {
          get().removeDamageNumber(id);
        }, 1000);
      },

      removeDamageNumber: (id) => {
        set(state => ({
          damageNumbers: state.damageNumbers.filter(d => d.id !== id),
        }));
      },

      calculateOfflineProgress: () => {
        const state = get();
        const now = Date.now();
        const offlineSeconds = Math.min((now - state.lastOfflineTime) / 1000, 3600 * 8); // Max 8 hours

        if (offlineSeconds < 60) return; // Minimum 1 minute

        const idleBonus = 1 + state.getTechBonus('idleBonus');
        const stageData = getStageData(state.currentChapter, state.currentStage);
        
        // Calculate battles won (estimate based on stage)
        const battlesPerMinute = 2;
        const estimatedBattles = Math.floor((offlineSeconds / 60) * battlesPerMinute * idleBonus);
        
        const goldEarned = estimatedBattles * stageData.goldReward;
        const xpEarned = estimatedBattles * stageData.xpReward;

        let newXp = state.player.xp + xpEarned;
        let newLevel = state.player.level;
        let newXpToNext = state.player.xpToNextLevel;

        while (newXp >= newXpToNext && newLevel < 100) {
          newXp -= newXpToNext;
          newLevel++;
          newXpToNext = Math.floor(newXpToNext * 1.5);
        }

        set({
          currency: {
            ...state.currency,
            gold: state.currency.gold + goldEarned,
          },
          player: {
            ...state.player,
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNext,
          },
          lastOfflineTime: now,
        });
      },
    }),
    {
      name: 'ultra-forge-save',
    }
  )
);

// Initialize offline progress on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useGameStore.getState().calculateOfflineProgress();
  }, 100);
}
