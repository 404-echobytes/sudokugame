import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useSudoku } from "./lib/stores/useSudoku";
import { useUser } from "./lib/stores/useUser";
import GameModeSelector from "./components/sudoku/GameModeSelector";
import GameBoard from "./components/sudoku/GameBoard";
import GameControls from "./components/sudoku/GameControls";
import Timer from "./components/sudoku/Timer";
import CompletionModal from "./components/sudoku/CompletionModal";
import UserDashboard from "./components/dashboard/UserDashboard";
import { Button } from "./components/ui/button";
import { BarChart3, Play } from "lucide-react";
import "@fontsource/inter";

type ViewMode = 'game' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const { gameMode, isCompleted, initializeAudio } = useSudoku();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const { playerName, stats } = useUser();

  // Initialize audio on app start
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    initializeAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound, initializeAudio]);

  if (currentView === 'dashboard') {
    return <UserDashboard onBackToGame={() => setCurrentView('game')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 pb-8">
        <header className="text-center mb-6 sticky top-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-10 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 order-1 lg:order-none"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            
            <div className="text-center order-2 lg:order-none">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">Sudoku Master</h1>
              <p className="text-sm lg:text-base text-gray-600">Challenge your mind with classic and time trial modes</p>
            </div>
            
            <div className="text-center lg:text-right order-3 lg:order-none">
              <div className="text-sm text-gray-600">Welcome, {playerName}!</div>
              <div className="text-lg font-bold text-blue-600">{stats.totalScore} pts</div>
              <div className="text-xs text-gray-500">{stats.rank}</div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {!gameMode ? (
            <GameModeSelector />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 capitalize">
                  {gameMode.replace('_', ' ')} Mode
                </h2>
                {gameMode === 'time_trial' && <Timer />}
              </div>

              <GameBoard />
              <GameControls />
            </div>
          )}
        </main>

        {isCompleted && <CompletionModal />}
      </div>
    </div>
  );
}

export default App;
