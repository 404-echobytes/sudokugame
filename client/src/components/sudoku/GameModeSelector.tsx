import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSudoku } from "@/lib/stores/useSudoku";
import { Clock, Puzzle } from "lucide-react";

export default function GameModeSelector() {
  const { setGameMode } = useSudoku();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Challenge</h2>
        <p className="text-gray-600">Select a game mode to start playing</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
              <Puzzle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Classic Mode</CardTitle>
            <CardDescription>
              Take your time and enjoy solving the puzzle at your own pace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• No time pressure</li>
              <li>• Perfect for beginners</li>
              <li>• Relaxed gameplay</li>
              <li>• Save and continue anytime</li>
            </ul>
            <Button 
              className="w-full" 
              onClick={() => setGameMode('classic')}
              variant="outline"
            >
              Start Classic Game
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit group-hover:bg-orange-200 transition-colors">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Time Trial</CardTitle>
            <CardDescription>
              Race against the clock to solve the puzzle and earn points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• 5 minute time limit</li>
              <li>• Score based on time remaining</li>
              <li>• Adrenaline-pumping challenge</li>
              <li>• Perfect for experienced players</li>
            </ul>
            <Button 
              className="w-full"
              onClick={() => setGameMode('time_trial')}
            >
              Start Time Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
