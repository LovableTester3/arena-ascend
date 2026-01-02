import { useGameStore } from '@/store/gameStore';
import { formatNumber, formatTime } from '@/lib/utils';
import { Settings } from 'lucide-react';

export const GameHeader = () => {
  const player = useGameStore(s => s.player);
  const currency = useGameStore(s => s.currency);
  const lastOfflineTime = useGameStore(s => s.lastOfflineTime);

  const offlineSeconds = Math.floor((Date.now() - lastOfflineTime) / 1000);

  return (
    <header className="bg-card px-3 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Avatar and level */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/30">
            <span className="text-xl">👤</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">GUEST</span>
            <span className="text-xs font-bold">Lv.{player.level}</span>
          </div>
        </div>
        
        {/* Center: Currencies */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-game-gold/20 px-2 py-1 rounded-full">
            <span className="text-sm">🪙</span>
            <span className="text-xs font-semibold text-game-gold">{formatNumber(currency.gold)}</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <span className="text-sm">💎</span>
            <span className="text-xs font-semibold text-primary">{formatNumber(currency.skillCurrency)}</span>
          </div>
        </div>
        
        {/* Right: Offline timer and settings */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            ⏱️ {formatTime(offlineSeconds)}
          </div>
          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};
