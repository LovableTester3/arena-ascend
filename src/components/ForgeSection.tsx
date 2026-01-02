import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

const gearTypes = ['Weapon', 'Shield', 'Armor', 'Legs', 'Boots'] as const;

export const ForgeSection = () => {
  const currency = useGameStore(s => s.currency);
  const forgeGear = useGameStore(s => s.forgeGear);
  const [autoForge, setAutoForge] = useState(false);
  const [selectedGearIndex, setSelectedGearIndex] = useState(0);

  const canForge = currency.hammers >= 1;

  const handleForge = () => {
    if (canForge) {
      forgeGear();
    }
  };

  const cycleGearType = () => {
    setSelectedGearIndex((prev) => (prev + 1) % gearTypes.length);
  };

  return (
    <div className="bg-card border-t px-4 py-3">
      {/* Forge Level and Auto Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Forge Level 1</span>
        </div>
        <button
          onClick={() => setAutoForge(!autoForge)}
          className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
            autoForge 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Auto
        </button>
      </div>

      {/* Anvil Visual */}
      <div className="relative flex items-center justify-center py-4">
        {/* Sparkle effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-pulse text-game-gold opacity-50">✨</div>
          <div className="absolute left-1/4 top-1/4 animate-pulse delay-100 text-game-gold opacity-30">⭐</div>
          <div className="absolute right-1/4 top-1/3 animate-pulse delay-200 text-game-gold opacity-40">✨</div>
        </div>
        
        {/* Anvil */}
        <div className="relative">
          <div className="text-5xl animate-float">🔨</div>
          {/* Hammer count badge */}
          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {currency.hammers}
          </div>
        </div>
      </div>

      {/* Forge Button */}
      <button
        onClick={handleForge}
        disabled={!canForge}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all relative overflow-hidden ${
          canForge
            ? 'bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <span className="relative z-10" onClick={cycleGearType}>
          Forge {gearTypes[selectedGearIndex]}
        </span>
        {canForge && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </button>
    </div>
  );
};
