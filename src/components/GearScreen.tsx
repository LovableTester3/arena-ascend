import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GearSlot } from '@/types/game';

const slotOrder: GearSlot[] = ['weapon', 'shield', 'armor', 'legs', 'boots'];

const slotLabels: Record<GearSlot, string> = {
  weapon: 'Weapon',
  shield: 'Shield',
  armor: 'Armor',
  legs: 'Legs',
  boots: 'Boots',
};

const slotIcons: Record<GearSlot, string> = {
  weapon: '⚔️',
  shield: '🛡️',
  armor: '🎽',
  legs: '👖',
  boots: '👢',
};

export const GearScreen = () => {
  const currency = useGameStore(s => s.currency);
  const gearInventory = useGameStore(s => s.gearInventory);
  const equippedGear = useGameStore(s => s.equippedGear);
  const forgeGear = useGameStore(s => s.forgeGear);
  const equipGear = useGameStore(s => s.equipGear);
  const unequipGear = useGameStore(s => s.unequipGear);
  const sellGear = useGameStore(s => s.sellGear);

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'rarity-rare border-2';
      case 'epic': return 'rarity-epic border-2';
      case 'legendary': return 'rarity-legendary border-2';
      default: return 'rarity-common border';
    }
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      {/* Forge Button */}
      <div className="bg-card rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-lg">Forge</h2>
            <p className="text-sm text-muted-foreground">Use hammers to craft gear</p>
          </div>
          <div className="flex items-center gap-1 text-lg">
            <span>🔨</span>
            <span className="font-bold">{currency.hammers}</span>
          </div>
        </div>
        <Button 
          onClick={forgeGear}
          disabled={currency.hammers < 1}
          className="w-full"
          size="lg"
        >
          <span className="text-xl mr-2">⚒️</span>
          Forge Gear (1 🔨)
        </Button>
      </div>

      {/* Equipped Gear */}
      <div className="bg-card rounded-xl p-3 border">
        <h3 className="font-semibold mb-2 text-sm">Equipped Gear</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {slotOrder.map(slot => {
            const gear = equippedGear[slot];
            return (
              <button
                key={slot}
                onClick={() => gear && unequipGear(slot)}
                className={`p-2 rounded-lg text-center transition-all ${
                  gear ? getRarityClass(gear.rarity) : 'bg-muted border border-dashed border-border'
                }`}
              >
                <div className="text-lg">{gear ? gear.icon : slotIcons[slot]}</div>
                <div className="text-[9px] text-muted-foreground truncate">
                  {gear ? `+${gear.attackBonus}⚔ +${gear.hpBonus}❤️` : slotLabels[slot]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory */}
      <div className="flex-1 bg-card rounded-xl p-3 border min-h-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Inventory ({gearInventory.length})</h3>
        </div>
        <ScrollArea className="h-[calc(100%-24px)]">
          {gearInventory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              No gear in inventory. Forge some!
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {gearInventory.map(gear => (
                <div
                  key={gear.id}
                  className={`game-card ${getRarityClass(gear.rarity)} flex items-center gap-2`}
                >
                  <div className="text-2xl">{gear.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{gear.name}</div>
                    <div className="text-xs text-muted-foreground">
                      +{gear.attackBonus} ⚔️ ATK | +{gear.hpBonus} ❤️ HP
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => equipGear(gear.id)}
                    >
                      Equip
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => sellGear(gear.id)}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
