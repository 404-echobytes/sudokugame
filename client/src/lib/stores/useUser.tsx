import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

export interface UserStats {
  totalScore: number;
  puzzlesCompleted: number;
  classicPuzzlesCompleted: number;
  timeTrialPuzzlesCompleted: number;
  bestTimeTrialScore: number;
  totalTimePlayed: number; // in seconds
  averageCompletionTime: number; // in seconds
  rank: string;
  level: number;
}

interface UserState {
  playerName: string;
  stats: UserStats;
  
  // Actions
  setPlayerName: (name: string) => void;
  addScore: (points: number, gameMode: 'classic' | 'time_trial', completionTime?: number) => void;
  resetStats: () => void;
  getRankInfo: () => { rank: string; nextRank: string; pointsToNext: number };
}

const INITIAL_STATS: UserStats = {
  totalScore: 0,
  puzzlesCompleted: 0,
  classicPuzzlesCompleted: 0,
  timeTrialPuzzlesCompleted: 0,
  bestTimeTrialScore: 0,
  totalTimePlayed: 0,
  averageCompletionTime: 0,
  rank: "Beginner",
  level: 1
};

// Ranking system based on total score
const RANKS = [
  { name: "Beginner", minScore: 0, level: 1 },
  { name: "Novice", minScore: 500, level: 2 },
  { name: "Apprentice", minScore: 1200, level: 3 },
  { name: "Skilled", minScore: 2000, level: 4 },
  { name: "Expert", minScore: 3500, level: 5 },
  { name: "Master", minScore: 5500, level: 6 },
  { name: "Grandmaster", minScore: 8000, level: 7 },
  { name: "Legend", minScore: 12000, level: 8 },
  { name: "Sudoku God", minScore: 20000, level: 9 }
];

const calculateRank = (totalScore: number) => {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (totalScore >= rank.minScore) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
};

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      playerName: "Player",
      stats: INITIAL_STATS,
      
      setPlayerName: (name: string) => {
        set({ playerName: name });
      },
      
      addScore: (points: number, gameMode: 'classic' | 'time_trial', completionTime = 0) => {
        const currentStats = get().stats;
        const newTotalScore = currentStats.totalScore + points;
        const newPuzzlesCompleted = currentStats.puzzlesCompleted + 1;
        
        const newStats: UserStats = {
          ...currentStats,
          totalScore: newTotalScore,
          puzzlesCompleted: newPuzzlesCompleted,
          classicPuzzlesCompleted: gameMode === 'classic' 
            ? currentStats.classicPuzzlesCompleted + 1 
            : currentStats.classicPuzzlesCompleted,
          timeTrialPuzzlesCompleted: gameMode === 'time_trial' 
            ? currentStats.timeTrialPuzzlesCompleted + 1 
            : currentStats.timeTrialPuzzlesCompleted,
          bestTimeTrialScore: gameMode === 'time_trial' && points > currentStats.bestTimeTrialScore
            ? points
            : currentStats.bestTimeTrialScore,
          totalTimePlayed: currentStats.totalTimePlayed + completionTime,
          averageCompletionTime: (currentStats.totalTimePlayed + completionTime) / newPuzzlesCompleted
        };
        
        // Calculate new rank
        const rankInfo = calculateRank(newTotalScore);
        newStats.rank = rankInfo.name;
        newStats.level = rankInfo.level;
        
        set({ stats: newStats });
      },
      
      resetStats: () => {
        set({ stats: INITIAL_STATS });
      },
      
      getRankInfo: () => {
        const currentStats = get().stats;
        const currentRankIndex = RANKS.findIndex(rank => rank.name === currentStats.rank);
        const nextRankIndex = currentRankIndex + 1;
        
        if (nextRankIndex >= RANKS.length) {
          return {
            rank: currentStats.rank,
            nextRank: "Max Rank Achieved",
            pointsToNext: 0
          };
        }
        
        const nextRank = RANKS[nextRankIndex];
        const pointsToNext = nextRank.minScore - currentStats.totalScore;
        
        return {
          rank: currentStats.rank,
          nextRank: nextRank.name,
          pointsToNext: Math.max(0, pointsToNext)
        };
      }
    }),
    {
      name: "sudoku-user-stats"
    }
  )
);