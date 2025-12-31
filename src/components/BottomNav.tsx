import { useGameStore } from '@/store/gameStore';
import { Swords, Sparkles, Dog, Castle, GitBranch } from 'lucide-react';
import { GameScreen } from '@/types/game';

const navItems: { screen: GameScreen; icon: typeof Swords; label: string }[] = [
  { screen: 'battle', icon: Swords, label: 'Battle' },
  { screen: 'skills', icon: Sparkles, label: 'Skills' },
  { screen: 'pets', icon: Dog, label: 'Pets' },
  { screen: 'dungeons', icon: Castle, label: 'Dungeons' },
  { screen: 'techTree', icon: GitBranch, label: 'Tech' },
];

export const BottomNav = () => {
  const { currentScreen, setScreen } = useGameStore();

  return (
    <nav className="bg-card border-t safe-area-bottom">
      <div className="flex justify-around">
        {navItems.map(({ screen, icon: Icon, label }) => (
          <button
            key={screen}
            onClick={() => setScreen(screen)}
            className={`nav-button flex-1 py-2 ${
              currentScreen === screen ? 'nav-button-active' : ''
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
