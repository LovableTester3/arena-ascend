import { useGameStore } from '@/store/gameStore';
import { formatNumber } from '@/lib/utils';

export const GameHeader = () => {
  const player = useGameStore(s => s.player);
  const currency = useGameStore(s => s.currency);

  // Generate a random guest ID for display
  const guestId = 95529;

  return (
    <header className="bg-card px-2 py-1.5 border-b">
      <div className="flex items-center justify-between">
        {/* Left: Avatar with guest info and gold */}
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-muted-foreground font-medium">Guest {guestId}</span>
            <div className="flex items-center gap-0.5">
              <span className="text-xs">🪙</span>
              <span className="text-[10px] font-bold text-game-gold">{formatNumber(currency.gold)}</span>
            </div>
          </div>
        </div>
        
        {/* Right: Gems and Diamonds as pill badges */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-rarity-rare/20 px-2 py-0.5 rounded-full border border-rarity-rare/30">
            <span className="text-sm">💎</span>
            <span className="text-[10px] font-bold text-rarity-rare">{formatNumber(currency.skillCurrency)}</span>
          </div>
          <div className="flex items-center gap-1 bg-rarity-epic/20 px-2 py-0.5 rounded-full border border-rarity-epic/30">
            <span className="text-sm">💜</span>
            <span className="text-[10px] font-bold text-rarity-epic">{formatNumber(currency.hammers * 1000000)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
