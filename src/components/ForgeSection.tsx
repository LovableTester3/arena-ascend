import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

const gearTypes = ['Weapon', 'Shield', 'Armor', 'Legs', 'Boots'] as const;

export const ForgeSection = () => {
  const currency = useGameStore(s => s.currency);
  const forgeGear = useGameStore(s => s.forgeGear);
  const player = useGameStore(s => s.player);
  const [autoForge, setAutoForge] = useState(false);
  const [selectedGearIndex, setSelectedGearIndex] = useState(2); // Default to Armor

  const canForge = currency.hammers >= 1;
  const forgeLevel = Math.floor(player.level / 2) + 1;

  const handleForge = () => {
    if (canForge) {
      forgeGear();
    }
  };

  const cycleGearType = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGearIndex((prev) => (prev + 1) % gearTypes.length);
  };

  return (
    <div className="bg-muted/30 px-4 py-2">
      {/* Forge Area with Anvil */}
      <div className="relative flex items-center justify-center py-3">
        {/* Floating coins/sparkles */}
        <div className="absolute left-1/4 top-0 text-sm animate-float opacity-70" style={{ animationDelay: '0s' }}>🪙</div>
        <div className="absolute left-1/3 top-2 text-xs animate-float opacity-60" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute right-1/4 top-1 text-sm animate-float opacity-70" style={{ animationDelay: '0.6s' }}>🪙</div>
        <div className="absolute right-1/3 top-3 text-xs animate-float opacity-60" style={{ animationDelay: '0.9s' }}>✨</div>
        
        {/* Hammer and Anvil */}
        <div className="relative flex items-end justify-center">
          {/* Hammer */}
          <div className="absolute -top-2 -right-4 text-4xl transform -rotate-45 animate-float" style={{ animationDuration: '1.5s' }}>
            🔨
          </div>
          
          {/* Anvil base */}
          <div className="relative">
            <div className="text-4xl">⚒️</div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-game-gold/20 blur-lg rounded-full" />
          </div>
        </div>

        {/* Forge Level Badge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded">
          Forge
          <br />
          <span className="text-game-gold">Level {forgeLevel}</span>
        </div>

        {/* Auto Toggle - Right Side */}
        <button
          onClick={() => setAutoForge(!autoForge)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
            autoForge 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-muted text-muted-foreground border border-border'
          }`}
        >
          Auto
        </button>
      </div>

      {/* Forge Button - Red Ribbon Style */}
      <div className="relative mt-2">
        {/* Ribbon ends */}
        <div className="absolute -bottom-2 left-2 w-4 h-4 bg-red-800 transform rotate-45" />
        <div className="absolute -bottom-2 right-2 w-4 h-4 bg-red-800 transform rotate-45" />
        
        <button
          onClick={handleForge}
          disabled={!canForge}
          className={`w-full py-4 font-bold text-lg transition-all relative overflow-hidden rounded-sm ${
            canForge
              ? 'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1">
            <span className="font-black">Forge</span>
            <span className="font-medium" onClick={cycleGearType}>{gearTypes[selectedGearIndex]}</span>
          </span>
          {canForge && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent forge-shimmer" />
          )}
        </button>
      </div>
    </div>
  );
};
