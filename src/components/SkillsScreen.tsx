import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';

export const SkillsScreen = () => {
  const { skills, currency, activeSkillIds, purchaseSkill, upgradeSkill, toggleSkillActive } = useGameStore();

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Skills</h2>
        <div className="flex items-center gap-1 text-sm">
          <span>💎</span>
          <span className="font-medium">{currency.skillCurrency}</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">Select up to 2 skills to use in battle</p>

      <div className="grid gap-3">
        {skills.map(skill => {
          const isActive = activeSkillIds.includes(skill.id);
          const upgradeCost = Math.floor(skill.baseCost * Math.pow(1.5, skill.level));
          const effectValue = skill.effect.value + (skill.level - 1) * skill.effect.valuePerLevel;
          
          return (
            <div 
              key={skill.id}
              className={`game-card border-2 ${
                skill.rarity === 'rare' ? 'rarity-rare' : 'rarity-common'
              } ${isActive ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{skill.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{skill.name}</span>
                    {skill.purchased && <span className="text-xs text-muted-foreground">Lv.{skill.level}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                  <p className="text-xs mt-1">
                    {skill.effect.type === 'heal' 
                      ? `Heals ${Math.round(effectValue * 100)}% HP`
                      : `Damage: ${effectValue}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                {!skill.purchased ? (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => purchaseSkill(skill.id)}
                    disabled={currency.skillCurrency < skill.baseCost}
                  >
                    Buy ({skill.baseCost} 💎)
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => toggleSkillActive(skill.id)}
                      disabled={!isActive && activeSkillIds.length >= 2}
                      className="flex-1"
                    >
                      {isActive ? 'Equipped' : 'Equip'}
                    </Button>
                    {skill.level < skill.maxLevel && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => upgradeSkill(skill.id)}
                        disabled={currency.skillCurrency < upgradeCost}
                      >
                        +1 ({upgradeCost} 💎)
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
