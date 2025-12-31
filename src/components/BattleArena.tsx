import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';

export const BattleArena = () => {
  const playerEntity = useGameStore(s => s.playerEntity);
  const enemies = useGameStore(s => s.enemies);
  const projectiles = useGameStore(s => s.projectiles);
  const damageNumbers = useGameStore(s => s.damageNumbers);
  const battleState = useGameStore(s => s.battleState);
  const currentChapter = useGameStore(s => s.currentChapter);
  const currentStage = useGameStore(s => s.currentStage);
  const skills = useGameStore(s => s.skills);
  const activeSkillIds = useGameStore(s => s.activeSkillIds);
  const autoSkills = useGameStore(s => s.autoSkills);
  const updateBattle = useGameStore(s => s.updateBattle);
  const updateSkillCooldowns = useGameStore(s => s.updateSkillCooldowns);
  const updateEggTimer = useGameStore(s => s.updateEggTimer);
  const updateHatchingEggs = useGameStore(s => s.updateHatchingEggs);
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
    }, 50);

    return () => clearInterval(gameLoop);
  }, [updateBattle, updateSkillCooldowns, updateEggTimer, updateHatchingEggs]);

  const activeSkills = useMemo(() => 
    skills.filter(s => activeSkillIds.includes(s.id)),
    [skills, activeSkillIds]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Stage indicator */}
      <div className="text-center py-2 bg-card border-b">
        <span className="font-semibold text-sm">Stage {currentChapter}-{currentStage}</span>
      </div>

      {/* Battle area */}
      <div className="flex-1 relative bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        {/* Player */}
        {playerEntity && (
          <div 
            className="absolute transition-all duration-100"
            style={{ left: playerEntity.x, top: playerEntity.y }}
          >
            <div className="w-10 h-10 bg-game-player rounded-lg flex items-center justify-center text-xl pixel-character animate-float">
              ⚔️
            </div>
            <div className="w-10 h-1.5 mt-1 bg-game-health-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-game-health transition-all"
                style={{ width: `${(playerEntity.hp / playerEntity.maxHp) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Enemies */}
        {enemies.map(enemy => (
          <div 
            key={enemy.id}
            className="absolute animate-spawn"
            style={{ left: enemy.x, top: enemy.y }}
          >
            <div className="w-8 h-8 bg-game-enemy rounded-lg flex items-center justify-center text-lg pixel-character">
              👹
            </div>
            <div className="w-8 h-1 mt-1 bg-game-health-light rounded-full overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <span className="text-2xl font-bold text-rarity-rare">Victory!</span>
          </div>
        )}
        {battleState === 'defeat' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <span className="text-2xl font-bold text-destructive">Defeat</span>
          </div>
        )}
      </div>

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
                  className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                    isReady ? 'border-primary animate-skill-ready' : 'border-muted opacity-60'
                  } ${skill.rarity === 'rare' ? 'bg-rarity-rare-light' : 'bg-card'}`}
                >
                  {skill.icon}
                  {!isReady && (
                    <div 
                      className="absolute inset-0 bg-foreground/30 rounded-lg"
                      style={{ height: `${cooldownPercent * 100}%`, top: 'auto', bottom: 0 }}
                    />
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
