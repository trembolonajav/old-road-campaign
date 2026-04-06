import { GameProvider, useGame } from '@/contexts/GameContext';
import TitleScreen from '@/components/game/TitleScreen';
import VillageScreen from '@/components/game/VillageScreen';
import RegionScreen from '@/components/game/RegionScreen';
import CombatScreen from '@/components/game/CombatScreen';
import VictoryScreen from '@/components/game/VictoryScreen';
import DefeatScreen from '@/components/game/DefeatScreen';
import ShopScreen from '@/components/game/ShopScreen';
import InventoryScreen from '@/components/game/InventoryScreen';
import AdventureMapScreen from '@/components/game/AdventureMapScreen';
import EncounterIntroScreen from '@/components/game/EncounterIntroScreen';

const GameRouter = () => {
  const { state } = useGame();

  switch (state.screen) {
    case 'title':
      return <TitleScreen />;
    case 'village':
      return <VillageScreen />;
    case 'adventure_map':
      return <AdventureMapScreen />;
    case 'region':
      return <RegionScreen />;
    case 'encounter_intro':
      return <EncounterIntroScreen />;
    case 'combat':
      return <CombatScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'defeat':
      return <DefeatScreen />;
    case 'shop':
      return <ShopScreen />;
    case 'inventory':
      return <InventoryScreen />;
    default:
      return <TitleScreen />;
  }
};

const Index = () => (
  <GameProvider>
    <GameRouter />
  </GameProvider>
);

export default Index;
