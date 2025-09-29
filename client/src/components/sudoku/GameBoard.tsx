import { useSudoku } from "@/lib/stores/useSudoku";
import { Card } from "@/components/ui/card";
import Cell from "./Cell";

export default function GameBoard() {
  const { currentGrid, selectedCell, selectCell } = useSudoku();

  if (!currentGrid.length) {
    return <div>Loading puzzle...</div>;
  }

  // Helper function to determine if cell is in the same row, column, or box as selected cell
  const isRelatedCell = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    
    const { row: selectedRow, col: selectedCol } = selectedCell;
    
    // Same row or column
    if (row === selectedRow || col === selectedCol) return true;
    
    // Same 3x3 box
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const selectedBoxRow = Math.floor(selectedRow / 3);
    const selectedBoxCol = Math.floor(selectedCol / 3);
    
    return boxRow === selectedBoxRow && boxCol === selectedBoxCol;
  };

  return (
    <Card className="p-4 lg:p-6 bg-white shadow-lg">
      {/* Sudoku Grid - Made responsive */}
      <div className="overflow-x-auto flex justify-center mb-6">
        <div className="grid grid-cols-9 gap-0 bg-gray-800 p-2 rounded-lg" style={{ minWidth: '320px' }}>
          {currentGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isRelated={isRelatedCell(rowIndex, colIndex)}
                onClick={() => selectCell(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Number input pad - Made responsive */}
      <div className="mt-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-3 text-center">
          Select a Number
        </h3>
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="h-10 lg:h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-sm lg:text-base"
              onClick={() => {
                if (selectedCell) {
                  const { makeMove } = useSudoku.getState();
                  makeMove(selectedCell.row, selectedCell.col, num);
                }
              }}
            >
              {num}
            </button>
          ))}
          <button
            className="h-10 lg:h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm lg:text-base"
            onClick={() => {
              if (selectedCell) {
                const { makeMove } = useSudoku.getState();
                makeMove(selectedCell.row, selectedCell.col, null);
              }
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </Card>
  );
}