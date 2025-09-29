import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/stores/useUser";
import { useSudoku } from "@/lib/stores/useSudoku";
import { Trophy, Target, Clock, User, Medal, TrendingUp, RotateCcw, ArrowLeft, Play } from "lucide-react";

interface UserDashboardProps {
  onBackToGame?: () => void;
}

export default function UserDashboard({ onBackToGame }: UserDashboardProps) {
  const { playerName, stats, setPlayerName, resetStats, getRankInfo } = useUser();
  const { startNewGame } = useSudoku();
  const rankInfo = getRankInfo();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getRankColor = (rank: string): string => {
    switch (rank) {
      case "Beginner": return "text-gray-600";
      case "Novice": return "text-green-600";
      case "Apprentice": return "text-blue-600";
      case "Skilled": return "text-purple-600";
      case "Expert": return "text-orange-600";
      case "Master": return "text-red-600";
      case "Grandmaster": return "text-yellow-600";
      case "Legend": return "text-pink-600";
      case "Sudoku God": return "text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold";
      default: return "text-gray-600";
    }
  };

  const getRankIcon = (rank: string) => {
    if (["Master", "Grandmaster", "Legend", "Sudoku God"].includes(rank)) {
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
    return <Medal className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4 pb-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="w-24"> {/* Spacer for center alignment */}
              {onBackToGame && (
                <Button
                  variant="outline"
                  onClick={onBackToGame}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Sudoku Master</h1>
              <p className="text-gray-600">Player Dashboard</p>
            </div>
            
            <div className="w-24 flex justify-end">
              <Button
                onClick={() => {
                  if (onBackToGame) {
                    onBackToGame();
                  } else {
                    startNewGame();
                  }
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="h-4 w-4" />
                <span>Play</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Player Info Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{playerName}</CardTitle>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {getRankIcon(stats.rank)}
                  <span className={`font-semibold ${getRankColor(stats.rank)}`}>
                    {stats.rank}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Level {stats.level}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
              
              {rankInfo.pointsToNext > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    Next Rank: <span className="font-semibold">{rankInfo.nextRank}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(10, (1 - rankInfo.pointsToNext / (rankInfo.pointsToNext + 100)) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {rankInfo.pointsToNext} points to go
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Puzzles Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.puzzlesCompleted}
                </div>
                <div className="text-sm text-gray-600">Total Puzzles</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">
                    {stats.classicPuzzlesCompleted}
                  </div>
                  <div className="text-gray-600">Classic</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-semibold text-orange-600">
                    {stats.timeTrialPuzzlesCompleted}
                  </div>
                  <div className="text-gray-600">Time Trial</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Time Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Total Time Played</div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatTime(stats.totalTimePlayed)}
                </div>
              </div>
              {stats.puzzlesCompleted > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Average Time</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {formatTime(Math.floor(stats.averageCompletionTime))}
                  </div>
                </div>
              )}
              {stats.bestTimeTrialScore > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Best Time Trial Score</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {stats.bestTimeTrialScore}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* First Puzzle */}
              <div className={`p-4 rounded-lg text-center ${stats.puzzlesCompleted >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold text-sm">First Solve</div>
                <div className="text-xs">Complete 1 puzzle</div>
              </div>

              {/* Speed Demon */}
              <div className={`p-4 rounded-lg text-center ${stats.timeTrialPuzzlesCompleted >= 5 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-400'}`}>
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold text-sm">Speed Demon</div>
                <div className="text-xs">Complete 5 time trials</div>
              </div>

              {/* Puzzle Master */}
              <div className={`p-4 rounded-lg text-center ${stats.puzzlesCompleted >= 25 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                <Medal className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold text-sm">Puzzle Master</div>
                <div className="text-xs">Complete 25 puzzles</div>
              </div>

              {/* High Scorer */}
              <div className={`p-4 rounded-lg text-center ${stats.totalScore >= 1000 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                <Target className="h-8 w-8 mx-auto mb-2" />
                <div className="font-semibold text-sm">High Scorer</div>
                <div className="text-xs">Earn 1000 points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => {
                  if (onBackToGame) {
                    onBackToGame();
                  } else {
                    startNewGame();
                  }
                }}
                className="flex flex-col items-center space-y-2 h-20 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="h-6 w-6" />
                <span>Play Sudoku</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  const name = prompt("Enter your player name:", playerName);
                  if (name && name.trim()) {
                    setPlayerName(name.trim());
                  }
                }}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <User className="h-6 w-6" />
                <span>Change Name</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all your statistics? This cannot be undone.")) {
                    resetStats();
                  }
                }}
                className="flex flex-col items-center space-y-2 h-20 text-red-600 border-red-300 hover:bg-red-50"
              >
                <RotateCcw className="h-6 w-6" />
                <span>Reset Stats</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <TrendingUp className="h-6 w-6" />
                <span>Refresh</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}