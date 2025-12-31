import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

export const DungeonsScreen = () => {
  const { tickets, dungeonStages, enterDungeon, setScreen } = useGameStore();

  const handleEnterDungeon = (type: 'skill' | 'egg') => {
    enterDungeon(type);
    setScreen('battle');
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <h2 className="text-lg font-bold">Dungeons</h2>

      {/* Skill Dungeon */}
      <div className="game-card border-2 border-game-skill-currency bg-game-skill-currency-light">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">Crystal Dungeon</h3>
            <p className="text-xs text-muted-foreground mt-1">Defeat enemies to earn skill crystals</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">🎫 {tickets.skillDungeon}/{tickets.maxSkillDungeon}</div>
            <div className="text-xs text-muted-foreground">tickets</div>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          <p>Stage: {dungeonStages.skillDungeon.chapter}-{dungeonStages.skillDungeon.stage}</p>
          <p className="text-muted-foreground">Reward: ~{20 + dungeonStages.skillDungeon.chapter * 10 + dungeonStages.skillDungeon.stage * 2} 💎</p>
        </div>

        <Button 
          className="w-full mt-3"
          onClick={() => handleEnterDungeon('skill')}
          disabled={tickets.skillDungeon <= 0}
        >
          Enter Dungeon
        </Button>
      </div>

      {/* Egg Dungeon */}
      <div className="game-card border-2 border-rarity-rare bg-rarity-rare-light">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-semibold">Egg Dungeon</h3>
              <p className="text-xs text-muted-foreground mt-1">Win battles to collect eggs</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded hover:bg-muted">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xs">
                <DialogHeader>
                  <DialogTitle>Egg Drop Rates</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-rarity-common border" />
                      Common Egg
                    </span>
                    <span>70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-rarity-rare-light border border-rarity-rare" />
                      Rare Egg
                    </span>
                    <span>30%</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">🎫 {tickets.eggDungeon}/{tickets.maxEggDungeon}</div>
            <div className="text-xs text-muted-foreground">tickets</div>
          </div>
        </div>

        <div className="mt-3 text-sm">
          <p>Stage: {dungeonStages.eggDungeon.chapter}-{dungeonStages.eggDungeon.stage}</p>
          <p className="text-muted-foreground">Reward: 2 Eggs per win</p>
        </div>

        <Button 
          className="w-full mt-3"
          onClick={() => handleEnterDungeon('egg')}
          disabled={tickets.eggDungeon <= 0}
        >
          Enter Dungeon
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Tickets refresh daily at midnight (2 per dungeon)
      </p>
    </div>
  );
};
