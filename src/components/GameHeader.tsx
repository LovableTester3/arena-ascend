import { useGameStore } from '@/store/gameStore';
import { Settings, Trophy } from 'lucide-react';

export const GameHeader = () => {
  const player = useGameStore(s => s.player);
  const currency = useGameStore(s => s.currency);

  return (
    <header className="bg-card border-b px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">Lv.{player.level}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 text-sm">
            <span>💰</span>
            <span>{currency.gold}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span>💎</span>
            <span>{currency.skillCurrency}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Trophy className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-1.5">
        <div className="stat-bar stat-bar-xp">
          <div 
            className="stat-bar-xp-fill"
            style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
};
