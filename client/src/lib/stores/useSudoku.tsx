import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { generateSudokuPuzzle, isPuzzleComplete, getConflictingCells, copyGrid, type SudokuGrid, type GameMode } from "../sudoku";
import { getLocalStorage, setLocalStorage } from "../utils";

interface SudokuState {
  // Game state
  gameMode: GameMode | null;
  currentGrid: SudokuGrid;
  originalPuzzle: SudokuGrid;
  solution: SudokuGrid;
  isCompleted: boolean;
  conflictingCells: Set<string>;
  
  // Time trial specific
  timeRemaining: number;
  score: number;
  gameStartTime: number | null;
  
  // UI state
  selectedCell: { row: number; col: number } | null;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  generateNewPuzzle: () => void;
  makeMove: (row: number, col: number, value: number | null) => void;
  selectCell: (row: number, col: number) => void;
  resetGame: () => void;
  startNewGame: () => void;
  
  // Time trial actions
  decrementTime: () => void;
  endGame: () => void;
  
  // Persistence
  saveGameState: () => void;
  loadGameState: () => void;
  initializeAudio: () => void;
}

const INITIAL_TIME = 300; // 5 minutes for time trial
const STORAGE_KEY = 'sudoku_game_state';

export const useSudoku = create<SudokuState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameMode: null,
    currentGrid: [],
    originalPuzzle: [],
    solution: [],
    isCompleted: false,
    conflictingCells: new Set(),
    timeRemaining: INITIAL_TIME,
    score: 0,
    gameStartTime: null,
    selectedCell: null,
    
    setGameMode: (mode: GameMode) => {
      set({ gameMode: mode, gameStartTime: Date.now() });
      get().generateNewPuzzle();
    },
    
    generateNewPuzzle: () => {
      const puzzle = generateSudokuPuzzle();
      set({
        currentGrid: copyGrid(puzzle.puzzle),
        originalPuzzle: copyGrid(puzzle.puzzle),
        solution: copyGrid(puzzle.solution),
        isCompleted: false,
        conflictingCells: new Set(),
        timeRemaining: INITIAL_TIME,
        score: 0,
        selectedCell: null,
        gameStartTime: Date.now()
      });
      get().saveGameState();
    },
    
    makeMove: (row: number, col: number, value: number | null) => {
      const state = get();
      
      // Don't allow moves on original puzzle cells
      if (state.originalPuzzle[row][col] !== null) {
        return;
      }
      
      // Don't allow moves if game is completed
      if (state.isCompleted) {
        return;
      }
      
      const newGrid = copyGrid(state.currentGrid);
      newGrid[row][col] = value;
      
      const conflicts = getConflictingCells(newGrid);
      const completed = isPuzzleComplete(newGrid);
      
      let newScore = state.score;
      if (completed) {
        // Award points based on game mode
        if (state.gameMode === 'time_trial') {
          newScore = 150 + (state.timeRemaining * 2); // 150 base points + time bonus
        } else if (state.gameMode === 'classic') {
          newScore = 50; // 50 points for classic mode
        }
      }
      
      set({
        currentGrid: newGrid,
        conflictingCells: conflicts,
        isCompleted: completed,
        score: newScore
      });
      
      // Award points to user when puzzle is completed
      if (completed && newScore > 0) {
        // Calculate completion time for classic mode
        const completionTime = state.gameStartTime ? Math.floor((Date.now() - state.gameStartTime) / 1000) : 0;
        
        // Import user store dynamically to avoid circular imports
        import("./useUser").then(({ useUser }) => {
          useUser.getState().addScore(newScore, state.gameMode!, completionTime);
        });
      }
      
      get().saveGameState();
    },
    
    selectCell: (row: number, col: number) => {
      set({ selectedCell: { row, col } });
    },
    
    resetGame: () => {
      const state = get();
      set({
        currentGrid: copyGrid(state.originalPuzzle),
        isCompleted: false,
        conflictingCells: new Set(),
        selectedCell: null,
        timeRemaining: INITIAL_TIME,
        score: 0,
        gameStartTime: Date.now()
      });
      get().saveGameState();
    },
    
    startNewGame: () => {
      set({
        gameMode: null,
        currentGrid: [],
        originalPuzzle: [],
        solution: [],
        isCompleted: false,
        conflictingCells: new Set(),
        timeRemaining: INITIAL_TIME,
        score: 0,
        gameStartTime: null,
        selectedCell: null
      });
      localStorage.removeItem(STORAGE_KEY);
    },
    
    decrementTime: () => {
      const state = get();
      if (state.gameMode === 'time_trial' && state.timeRemaining > 0 && !state.isCompleted) {
        const newTime = state.timeRemaining - 1;
        set({ timeRemaining: newTime });
        
        if (newTime === 0) {
          get().endGame();
        }
      }
    },
    
    endGame: () => {
      set({ isCompleted: true });
      get().saveGameState();
    },
    
    saveGameState: () => {
      const state = get();
      const gameState = {
        gameMode: state.gameMode,
        currentGrid: state.currentGrid,
        originalPuzzle: state.originalPuzzle,
        solution: state.solution,
        isCompleted: state.isCompleted,
        timeRemaining: state.timeRemaining,
        score: state.score,
        gameStartTime: state.gameStartTime
      };
      setLocalStorage(STORAGE_KEY, gameState);
    },
    
    loadGameState: () => {
      const savedState = getLocalStorage(STORAGE_KEY);
      if (savedState && savedState.gameMode) {
        const conflicts = getConflictingCells(savedState.currentGrid);
        set({
          ...savedState,
          conflictingCells: conflicts,
          selectedCell: null
        });
      }
    },
    
    initializeAudio: () => {
      // Load saved game state on initialization
      get().loadGameState();
    }
  }))
);

// Subscribe to completion to play success sound
useSudoku.subscribe(
  (state) => state.isCompleted,
  (isCompleted) => {
    if (isCompleted) {
      // Import audio store dynamically to avoid circular imports
      import("./useAudio").then(({ useAudio }) => {
        useAudio.getState().playSuccess();
      });
    }
  }
);
