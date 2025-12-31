import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const PetsScreen = () => {
  const { pets, eggs, maxEggs, eggTimer, equippedPetId, equipPet, startHatchingEgg } = useGameStore();

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <h2 className="text-lg font-bold">Pets</h2>

      {/* Egg timer */}
      <div className="bg-card rounded-lg p-3 border">
        <div className="flex justify-between text-sm mb-1">
          <span>Next egg in:</span>
          <span>{Math.ceil(15 - eggTimer)}s</span>
        </div>
        <Progress value={(eggTimer / 15) * 100} className="h-2" />
      </div>

      {/* Eggs */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Eggs ({eggs.length}/{maxEggs})</h3>
        <div className="grid grid-cols-5 gap-2">
          {eggs.map(egg => (
            <button
              key={egg.id}
              onClick={() => !egg.isHatching && startHatchingEgg(egg.id)}
              className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-lg ${
                egg.rarity === 'rare' ? 'rarity-rare' : 'rarity-common'
              } ${egg.isHatching ? 'animate-hatch' : ''}`}
            >
              🥚
              {egg.isHatching && (
                <span className="text-[10px]">{Math.ceil(egg.hatchTimeRemaining)}s</span>
              )}
            </button>
          ))}
          {eggs.length === 0 && (
            <span className="col-span-5 text-xs text-muted-foreground text-center py-4">No eggs yet</span>
          )}
        </div>
      </div>

      {/* Owned pets */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Your Pets</h3>
        <div className="grid gap-3">
          {pets.filter(p => p.owned).map(pet => {
            const isEquipped = equippedPetId === pet.id;
            const hpBonus = pet.hpBonus + (pet.level - 1) * pet.hpBonusPerLevel;
            const atkBonus = pet.atkBonus + (pet.level - 1) * pet.atkBonusPerLevel;
            
            return (
              <div 
                key={pet.id}
                className={`game-card border-2 ${
                  pet.rarity === 'rare' ? 'rarity-rare' : 'rarity-common'
                } ${isEquipped ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{pet.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{pet.name}</span>
                      <span className="text-xs text-muted-foreground">Lv.{pet.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">+{hpBonus} HP, +{atkBonus} ATK</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isEquipped ? "default" : "outline"}
                    onClick={() => equipPet(pet.id)}
                  >
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </Button>
                </div>
              </div>
            );
          })}
          {pets.filter(p => p.owned).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Hatch eggs to get pets!</p>
          )}
        </div>
      </div>
    </div>
  );
};
