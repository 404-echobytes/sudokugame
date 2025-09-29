import { Button } from "@/components/ui/button";
import { useSudoku } from "@/lib/stores/useSudoku";
import { useAudio } from "@/lib/stores/useAudio";
import { RotateCcw, Home, Volume2, VolumeX, Lightbulb } from "lucide-react";

export default function GameControls() {
  const { resetGame, startNewGame, gameMode, selectedCell, solution, makeMove } = useSudoku();
  const { isMuted, toggleMute } = useAudio();

  const handleHint = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const correctValue = solution[row][col];
    
    if (correctValue) {
      makeMove(row, col, correctValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      <Button 
        variant="outline" 
        onClick={resetGame}
        className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        size="sm"
      >
        <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Reset</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleHint}
        disabled={!selectedCell}
        className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        size="sm"
      >
        <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Hint</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={toggleMute}
        className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        size="sm"
      >
        {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
        <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
      </Button>
      
      <Button 
        variant="destructive" 
        onClick={startNewGame}
        className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
        size="sm"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>New Game</span>
      </Button>
    </div>
  );
}