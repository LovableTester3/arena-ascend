import { useGameStore } from '@/store/gameStore';
import { GameHeader } from '@/components/GameHeader';
import { BottomNav } from '@/components/BottomNav';
import { BattleArena } from '@/components/BattleArena';
import { ForgeSection } from '@/components/ForgeSection';
import { GearScreen } from '@/components/GearScreen';
import { SkillsScreen } from '@/components/SkillsScreen';
import { PetsScreen } from '@/components/PetsScreen';
import { DungeonsScreen } from '@/components/DungeonsScreen';
import { TechTreeScreen } from '@/components/TechTreeScreen';

const Index = () => {
  const currentScreen = useGameStore(s => s.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'battle':
        return (
          <>
            <BattleArena />
            <ForgeSection />
          </>
        );
      case 'gear':
        return <GearScreen />;
      case 'skills':
        return <SkillsScreen />;
      case 'pets':
        return <PetsScreen />;
      case 'dungeons':
        return <DungeonsScreen />;
      case 'techTree':
        return <TechTreeScreen />;
      default:
        return (
          <>
            <BattleArena />
            <ForgeSection />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background">
      <GameHeader />
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderScreen()}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
