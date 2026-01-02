import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GearSlot } from '@/types/game';
import { formatNumber } from '@/lib/utils';

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
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-rarity-rare';
      case 'epic': return 'border-rarity-epic';
      case 'legendary': return 'border-rarity-legendary';
      default: return 'border-border';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'bg-rarity-rare-light';
      case 'epic': return 'bg-rarity-epic-light';
      case 'legendary': return 'bg-rarity-legendary-light';
      default: return 'bg-card';
    }
  };

  // Create two rows of gear slots
  const row1 = slotOrder.slice(0, 3); // weapon, shield, armor
  const row2 = slotOrder.slice(3);    // legs, boots + empty slots

  const renderGearSlot = (slot: GearSlot) => {
    const gear = equippedGear[slot];
    return (
      <div
        key={slot}
        className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center text-lg border-2 relative ${
          gear 
            ? `${getRarityBorder(gear.rarity)} ${getRarityBg(gear.rarity)}` 
            : 'border-dashed border-muted-foreground/30 bg-muted/30'
        }`}
      >
        {gear ? (
          <>
            <span>{gear.icon}</span>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-foreground text-background px-1 rounded">
              Lv.{gear.level}
            </span>
          </>
        ) : (
          <span className="opacity-30 text-sm">{slotIcons[slot]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="px-3 py-2 bg-card/90 flex flex-col gap-1.5 items-center">
      <div className="flex gap-1.5">
        {row1.map(renderGearSlot)}
      </div>
      <div className="flex gap-1.5">
        {row2.map(renderGearSlot)}
        {/* Fill remaining slots */}
        {[...Array(3 - row2.length)].map((_, i) => (
          <div key={`empty-${i}`} className="w-11 h-11 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20" />
        ))}
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
  const skills = useGameStore(s => s.skills);
  const activeSkillIds = useGameStore(s => s.activeSkillIds);
  const autoSkills = useGameStore(s => s.autoSkills);
  const updateBattle = useGameStore(s => s.updateBattle);
  const updateSkillCooldowns = useGameStore(s => s.updateSkillCooldowns);
  const updateEggTimer = useGameStore(s => s.updateEggTimer);
  const updateHatchingEggs = useGameStore(s => s.updateHatchingEggs);
  const updateHammerTimer = useGameStore(s => s.updateHammerTimer);
  const useSkill = useGameStore(s => s.useSkill);
  const setAutoSkills = useGameStore(s => s.setAutoSkills);
  const startBattle = useGameStore(s => s.startBattle);
  
  const lastTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);

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

  const activeSkills = useMemo(() => 
    skills.filter(s => activeSkillIds.includes(s.id)),
    [skills, activeSkillIds]
  );

  const xpProgress = (player.xp / player.xpToNextLevel) * 100;
  const xpGain = player.xpToNextLevel * 0.05; // Simulated XP gain display

  return (
    <div className="flex flex-col h-full">
      {/* Stage indicator */}
      <div className="bg-gradient-to-r from-rarity-rare/80 to-rarity-rare/60 text-center py-2 mx-3 mt-2 rounded-lg shadow-sm">
        <span className="font-bold text-sm text-rarity-rare-light drop-shadow-sm">
          Battle {currentChapter}-{currentStage}
        </span>
      </div>

      {/* XP Progress Bar */}
      <div className="mx-3 mt-2 h-5 bg-muted rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-rarity-rare to-rarity-rare/70 transition-all duration-300"
          style={{ width: `${xpProgress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground drop-shadow-sm">
          +{formatNumber(xpGain)} XP
        </span>
      </div>

      {/* Battle area with scenic background */}
      <div className="flex-1 relative overflow-hidden mx-3 mt-2 rounded-xl">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100" />
        
        {/* Clouds */}
        <div className="absolute top-4 left-4 text-2xl opacity-60 animate-float">☁️</div>
        <div className="absolute top-8 right-8 text-xl opacity-40 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        
        {/* Trees background */}
        <div className="absolute bottom-16 left-2 text-3xl">🌲</div>
        <div className="absolute bottom-16 left-10 text-2xl">🌳</div>
        <div className="absolute bottom-16 right-4 text-3xl">🌲</div>
        <div className="absolute bottom-16 right-12 text-2xl">🌳</div>
        
        {/* Ground/Road */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-green-600 to-green-500" />

        {/* Player */}
        {playerEntity && (
          <div 
            className="absolute transition-all duration-100"
            style={{ left: 40, bottom: 50 }}
          >
            <div className="w-12 h-12 bg-game-player rounded-lg flex items-center justify-center text-2xl pixel-character animate-float shadow-lg">
              🧙
            </div>
            <div className="w-12 h-2 mt-1 bg-game-health-light rounded-full overflow-hidden">
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
            style={{ right: 30 + index * 50, bottom: 50 }}
          >
            <div className="w-10 h-10 bg-game-enemy rounded-lg flex items-center justify-center text-xl pixel-character shadow-lg">
              👹
            </div>
            <div className="w-10 h-1.5 mt-1 bg-game-health-light rounded-full overflow-hidden">
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
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: currentX,
                top: currentY,
                backgroundColor: proj.isPlayerProjectile ? 'hsl(var(--gold))' : 'hsl(var(--destructive))',
                boxShadow: `0 0 8px ${proj.isPlayerProjectile ? 'hsl(var(--gold))' : 'hsl(var(--destructive))'}`,
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

      {/* Skills bar */}
      <div className="p-2 bg-card border-t">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSkills(!autoSkills)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              autoSkills ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Auto
          </button>
          <div className="flex gap-2 flex-1 justify-center">
            {activeSkills.map(skill => {
              const isReady = skill.currentCooldown <= 0;
              const cooldownPercent = skill.currentCooldown / skill.baseCooldown;
              return (
                <button
                  key={skill.id}
                  onClick={() => useSkill(skill.id)}
                  disabled={!isReady}
                  className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all overflow-hidden ${
                    isReady ? 'border-primary animate-skill-ready' : 'border-muted opacity-70'
                  } ${skill.rarity === 'rare' ? 'bg-rarity-rare-light' : 'bg-card'}`}
                >
                  {skill.icon}
                  {!isReady && (
                    <>
                      <div 
                        className="absolute inset-0 bg-foreground/40 rounded-md transition-all"
                        style={{ height: `${cooldownPercent * 100}%`, top: 'auto', bottom: 0 }}
                      />
                      <span className="absolute text-[10px] font-bold text-foreground drop-shadow-sm">
                        {Math.ceil(skill.currentCooldown)}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
            {activeSkills.length === 0 && (
              <span className="text-xs text-muted-foreground">No skills equipped</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
