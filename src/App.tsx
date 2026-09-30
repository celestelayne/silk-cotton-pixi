import { DebugHud } from './DebugHud';
import { WorldStage } from './world/WorldStage';
import { useViewportSize } from './world/useViewportSize';
import { INITIAL_PLAYER_POSITION, computeWorldOffset } from './world/world';

function App() {
  const viewport = useViewportSize();
  const offset = computeWorldOffset(viewport, INITIAL_PLAYER_POSITION);

  return (
    <>
      <WorldStage offset={offset} />
      <DebugHud viewport={viewport} offset={offset} />
    </>
  );
}

export default App;
