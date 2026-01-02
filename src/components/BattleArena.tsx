import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GearSlot } from '@/types/game';
import { formatNumber, formatTime } from '@/lib/utils';

const slotOrder: GearSlot[] = ['weapon', 'shield', 'armor', 'legs', 'boots'];

const slotIcons: Record<GearSlot, string> = {
  weapon: '⚔️',
  shield: '🛡️',
  armor: '🎽',
  legs: '👖',
  boots: '👢',
};

const EquippedGearGrid = () => {
  const equippedGear = useGameStore(s => s.equippedGear);
  const gearInventory = useGameStore(s => s.gearInventory);
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-rarity-rare';
      case 'epic': return 'border-rarity-epic';
      case 'legendary': return 'border-rarity-legendary';
      default: return 'border-rarity-common-border';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'bg-rarity-rare-light';
      case 'epic': return 'bg-rarity-epic-light';
      case 'legendary': return 'bg-rarity-legendary-light';
      default: return 'bg-rarity-common';
    }
  };

  // Get all gear to display (equipped + inventory)
  const allGear = [
    ...slotOrder.map(slot => equippedGear[slot]).filter(Boolean),
    ...gearInventory.slice(0, 10 - slotOrder.filter(slot => equippedGear[slot]).length)
  ];

  // Fill to 10 slots
  const displayGear = [...allGear];
  while (displayGear.length < 10) {
    displayGear.push(null);
  }

  const row1 = displayGear.slice(0, 5);
  const row2 = displayGear.slice(5, 10);

  const renderGearSlot = (gear: typeof displayGear[0], index: number) => {
    return (
      <div
        key={index}
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border-2 relative ${
          gear 
            ? `${getRarityBorder(gear.rarity)} ${getRarityBg(gear.rarity)}` 
            : 'border-dashed border-muted-foreground/20 bg-muted/20'
        }`}
      >
        {gear ? (
          <>
            <span>{gear.icon}</span>
            <span className="absolute bottom-0 left-0 text-[8px] font-bold bg-foreground/80 text-background px-1 rounded-tr rounded-bl">
              Lv.{gear.level}
            </span>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className="px-3 py-2 bg-muted/30 flex flex-col gap-1.5 items-center">
      <div className="flex gap-1.5">
        {row1.map((gear, i) => renderGearSlot(gear, i))}
      </div>
      <div className="flex gap-1.5">
        {row2.map((gear, i) => renderGearSlot(gear, i + 5))}
      </div>
    </div>
  );
};

export const BattleArena = () => {
  const playerEntity = useGameStore(s => s.playerEntity);
  const enemies = useGameStore(s => s.enemies);
  const projectiles = useGameStore(s => s.projectiles);
  const damageNumbers = useGameStore(s => s.damageNumbers);
  const battleState = useGameStore(s => s.battleState);
  const currentChapter = useGameStore(s => s.currentChapter);
  const currentStage = useGameStore(s => s.currentStage);
  const player = useGameStore(s => s.player);
  const lastOfflineTime = useGameStore(s => s.lastOfflineTime);
  const updateBattle = useGameStore(s => s.updateBattle);
  const updateSkillCooldowns = useGameStore(s => s.updateSkillCooldowns);
  const updateEggTimer = useGameStore(s => s.updateEggTimer);
  const updateHatchingEggs = useGameStore(s => s.updateHatchingEggs);
  const updateHammerTimer = useGameStore(s => s.updateHammerTimer);
  const startBattle = useGameStore(s => s.startBattle);
  
  const lastTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);

  const offlineSeconds = Math.floor((Date.now() - lastOfflineTime) / 1000);

  useEffect(() => {
    if (!hasStartedRef.current && battleState === 'idle') {
      hasStartedRef.current = true;
      startBattle();
    }
  }, [battleState, startBattle]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      updateBattle(delta);
      updateSkillCooldowns(delta);
      updateEggTimer(delta);
      updateHatchingEggs(delta);
      updateHammerTimer(delta);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [updateBattle, updateSkillCooldowns, updateEggTimer, updateHatchingEggs, updateHammerTimer]);

  const xpProgress = (player.xp / player.xpToNextLevel) * 100;
  const xpGain = Math.floor(player.xpToNextLevel * 0.06);

  return (
    <div className="flex flex-col flex-1">
      {/* Battle Stage Indicator */}
      <div className="text-center py-1.5 bg-background">
        <span className="font-bold text-base text-foreground">Battle {currentChapter}-{currentStage}</span>
      </div>

      {/* XP Progress Bar */}
      <div className="mx-4 h-6 bg-rarity-rare/30 rounded-full overflow-hidden relative border-2 border-rarity-rare">
        <div 
          className="h-full bg-gradient-to-r from-rarity-rare to-rarity-rare/80 transition-all duration-300"
          style={{ width: `${xpProgress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          <span className="text-sm">⚔️</span>
          <span className="text-xs font-bold text-foreground drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            +{formatNumber(xpGain)}
          </span>
        </div>
      </div>

      {/* Battle Area with Scenic Background */}
      <div className="flex-1 relative overflow-hidden mt-2">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100" />
        
        {/* Clouds */}
        <div className="absolute top-2 left-6 text-lg opacity-70">☁️</div>
        <div className="absolute top-4 right-10 text-xl opacity-50">☁️</div>
        <div className="absolute top-6 left-1/3 text-sm opacity-60">☁️</div>
        
        {/* Background trees (far) */}
        <div className="absolute bottom-20 left-4 text-2xl opacity-70">🌳</div>
        <div className="absolute bottom-22 left-16 text-xl opacity-60">🌲</div>
        <div className="absolute bottom-20 right-8 text-2xl opacity-70">🌳</div>
        <div className="absolute bottom-22 right-20 text-xl opacity-60">🌲</div>
        
        {/* Grass area (above road) */}
        <div className="absolute bottom-12 left-0 right-0 h-10 bg-gradient-to-b from-green-400 to-green-500" />
        
        {/* Road/Path */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700">
          {/* Road texture marks */}
          <div className="absolute top-2 left-8 w-2 h-1 bg-amber-800/30 rounded-full" />
          <div className="absolute top-4 left-20 w-3 h-1 bg-amber-800/30 rounded-full" />
          <div className="absolute top-3 right-12 w-2 h-1 bg-amber-800/30 rounded-full" />
          <div className="absolute top-5 right-28 w-2 h-1 bg-amber-800/30 rounded-full" />
        </div>
        
        {/* Grass edge below road */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-600" />

        {/* Foreground trees/bushes */}
        <div className="absolute bottom-14 left-1 text-lg">🌿</div>
        <div className="absolute bottom-14 right-2 text-lg">🌿</div>

        {/* Player Character */}
        {playerEntity && (
          <div 
            className="absolute transition-all duration-100"
            style={{ left: 30, bottom: 20 }}
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl pixel-character animate-float">
              🧑‍🌾
            </div>
            <div className="w-10 h-1.5 mt-0.5 bg-game-health-light rounded-full overflow-hidden border border-foreground/20">
              <div 
                className="h-full bg-game-health transition-all"
                style={{ width: `${(playerEntity.hp / playerEntity.maxHp) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Enemies */}
        {enemies.map((enemy, index) => (
          <div 
            key={enemy.id}
            className="absolute animate-spawn"
            style={{ right: 20 + index * 40, bottom: 20 }}
          >
            <div className="w-8 h-8 flex items-center justify-center text-xl pixel-character">
              👺
            </div>
            <div className="w-8 h-1 mt-0.5 bg-game-health-light rounded-full overflow-hidden border border-foreground/20">
              <div 
                className="h-full bg-game-health transition-all"
                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {/* Projectiles */}
        {projectiles.map(proj => {
          const currentX = proj.x + (proj.targetX - proj.x) * proj.progress;
          const currentY = proj.y + (proj.targetY - proj.y) * proj.progress;
          return (
            <div
              key={proj.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: currentX,
                top: currentY,
                backgroundColor: proj.isPlayerProjectile ? 'hsl(var(--gold))' : 'hsl(var(--destructive))',
                boxShadow: `0 0 6px ${proj.isPlayerProjectile ? 'hsl(var(--gold))' : 'hsl(var(--destructive))'}`,
              }}
            />
          );
        })}

        {/* Damage numbers */}
        {damageNumbers.map(dmg => (
          <div
            key={dmg.id}
            className="absolute font-bold text-sm animate-damage-number pointer-events-none"
            style={{ 
              left: dmg.x, 
              top: dmg.y,
              color: dmg.isHeal ? 'hsl(var(--rarity-rare))' : dmg.isCrit ? 'hsl(var(--accent))' : 'hsl(var(--destructive))',
            }}
          >
            {dmg.isHeal ? '+' : '-'}{dmg.value}
          </div>
        ))}

        {/* Offline Timer - Bottom Right */}
        <div className="absolute bottom-16 right-2 bg-background/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground flex items-center gap-1">
          <span>💎</span>
          <span>{formatTime(offlineSeconds)}</span>
        </div>

        {/* Battle state overlay */}
        {battleState === 'victory' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="text-2xl font-bold text-rarity-rare drop-shadow-lg">Victory!</span>
          </div>
        )}
        {battleState === 'defeat' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="text-2xl font-bold text-destructive drop-shadow-lg">Defeat</span>
          </div>
        )}
      </div>

      {/* Equipped Gear Grid */}
      <EquippedGearGrid />
    </div>
  );
};
