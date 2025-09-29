import { useEffect } from "react";
import { useSudoku } from "@/lib/stores/useSudoku";
import { Clock } from "lucide-react";

export default function Timer() {
  const { timeRemaining, decrementTime, isCompleted, gameMode } = useSudoku();

  useEffect(() => {
    if (gameMode === 'time_trial' && !isCompleted && timeRemaining > 0) {
      const interval = setInterval(() => {
        decrementTime();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining, isCompleted, gameMode, decrementTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (timeRemaining > 120) return "text-green-600";
    if (timeRemaining > 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-5 w-5 ${getTimeColor()}`} />
      <span className={`text-xl font-mono font-bold ${getTimeColor()}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}