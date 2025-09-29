import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSudoku } from "@/lib/stores/useSudoku";
import { Trophy, Clock, Target } from "lucide-react";

export default function CompletionModal() {
  const { 
    isCompleted, 
    gameMode, 
    score, 
    timeRemaining, 
    startNewGame, 
    generateNewPuzzle 
  } = useSudoku();

  useEffect(() => {
    if (isCompleted) {
      // Create confetti effect
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const confettiCount = 50;
      
      for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.zIndex = '9999';
          confetti.style.pointerEvents = 'none';
          
          document.body.appendChild(confetti);
          
          const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(360deg)`, opacity: 0 }
          ], {
            duration: 3000,
            easing: 'ease-out'
          });
          
          animation.onfinish = () => {
            document.body.removeChild(confetti);
          };
        }, i * 100);
      }
    }
  }, [isCompleted]);

  if (!isCompleted) return null;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const wasTimeTrialCompleted = gameMode === 'time_trial' && timeRemaining > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">
            {wasTimeTrialCompleted ? 'Congratulations!' : 
             gameMode === 'time_trial' ? 'Time\'s Up!' : 'Puzzle Solved!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Show score for all completed puzzles */}
          {score > 0 && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">+{score} Points Earned!</div>
              <div className="text-sm text-gray-600">
                {gameMode === 'classic' ? 'Classic Mode: 50 base points' : 
                 gameMode === 'time_trial' ? `Time Trial: 150 base + ${(timeRemaining * 2)} time bonus` : ''}
              </div>
            </div>
          )}

          {gameMode === 'time_trial' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>Time Remaining:</span>
                </div>
                <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
              
              {wasTimeTrialCompleted && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-600" />
                    <span>Total Score:</span>
                  </div>
                  <span className="font-bold text-green-600">{score} points</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={generateNewPuzzle}
              className="flex-1"
            >
              Play Again
            </Button>
            <Button 
              onClick={startNewGame}
              className="flex-1"
            >
              Change Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}