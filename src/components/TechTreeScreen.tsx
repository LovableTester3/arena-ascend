import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { TechCategory } from '@/types/game';

const categoryLabels: Record<TechCategory, string> = {
  combat: '⚔️ Combat',
  resource: '💰 Resources',
  automation: '⚡ Automation',
};

export const TechTreeScreen = () => {
  const { techUpgrades, currency, upgradeTech } = useGameStore();

  const categories: TechCategory[] = ['combat', 'resource', 'automation'];

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Tech Tree</h2>
        <div className="flex items-center gap-1 text-sm">
          <span>💰</span>
          <span className="font-medium">{currency.gold}</span>
        </div>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h3 className="font-semibold text-sm mb-2">{categoryLabels[category]}</h3>
          <div className="grid gap-2">
            {techUpgrades
              .filter(t => t.category === category)
              .map(tech => {
                const cost = Math.floor(tech.baseCost * Math.pow(tech.costMultiplier, tech.level));
                const canUpgrade = tech.level < tech.maxLevel && currency.gold >= cost;
                const currentValue = tech.level * tech.effect.valuePerLevel;
                
                return (
                  <div key={tech.id} className="game-card border flex items-center gap-3">
                    <div className="text-xl">{tech.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{tech.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {tech.level}/{tech.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tech.description}</p>
                      {tech.level > 0 && (
                        <p className="text-xs text-rarity-rare">
                          +{tech.effect.type.includes('Chance') || tech.effect.type.includes('Bonus') || tech.effect.type.includes('bonus') || tech.effect.type.includes('Gen') || tech.effect.type.includes('Speed') || tech.effect.type.includes('Cd')
                            ? `${Math.round(currentValue * 100)}%`
                            : currentValue}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => upgradeTech(tech.id)}
                      disabled={!canUpgrade}
                    >
                      {tech.level >= tech.maxLevel ? 'MAX' : `${cost} 💰`}
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
