export type SudokuGrid = (number | null)[][];
export type GameMode = 'classic' | 'time_trial';

export interface SudokuPuzzle {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
  difficulty: 'easy';
}

// Helper function to check if a number is valid in a specific position
export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && grid[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

// Check if the current grid state has any conflicts
export function hasConflicts(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== null && !isValidMove(grid, row, col, num)) {
        return true;
      }
    }
  }
  return false;
}

// Get conflicting cells for highlighting
export function getConflictingCells(grid: SudokuGrid): Set<string> {
  const conflicts = new Set<string>();
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== null && !isValidMove(grid, row, col, num)) {
        conflicts.add(`${row}-${col}`);
      }
    }
  }
  
  return conflicts;
}

// Check if puzzle is completed
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  
  // Check if there are no conflicts
  return !hasConflicts(grid);
}

// Solve sudoku using backtracking
function solveSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generate a complete valid sudoku grid
function generateCompleteGrid(): SudokuGrid {
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Fill diagonal 3x3 boxes first
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
  
  // Solve the rest
  solveSudoku(grid);
  return grid;
}

// Fill a 3x3 box with random valid numbers
function fillBox(grid: SudokuGrid, row: number, col: number): void {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Shuffle array
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  
  let index = 0;
  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      grid[i][j] = nums[index++];
    }
  }
}

// Remove numbers to create puzzle (easy difficulty - remove ~30-35 numbers)
function createPuzzle(solution: SudokuGrid): SudokuGrid {
  const puzzle = solution.map(row => [...row]);
  const cellsToRemove = 32; // Easy difficulty
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }
  
  return puzzle;
}

// Main function to generate a new sudoku puzzle
export function generateSudokuPuzzle(): SudokuPuzzle {
  const solution = generateCompleteGrid();
  const puzzle = createPuzzle(solution);
  
  return {
    puzzle,
    solution,
    difficulty: 'easy'
  };
}

// Deep copy grid utility
export function copyGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}
