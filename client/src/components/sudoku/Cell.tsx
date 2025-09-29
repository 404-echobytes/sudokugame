import { useSudoku } from "@/lib/stores/useSudoku";
import { cn } from "@/lib/utils";

interface CellProps {
  value: number | null;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  onClick: () => void;
}

export default function Cell({ value, row, col, isSelected, isRelated, onClick }: CellProps) {
  const { originalPuzzle, conflictingCells } = useSudoku();
  
  const isOriginalCell = originalPuzzle[row]?.[col] !== null;
  const hasConflict = conflictingCells.has(`${row}-${col}`);
  
  // Determine border classes for 3x3 box separation
  const getBorderClasses = () => {
    const classes = [];
    
    // Thick borders for 3x3 box separation
    if (row % 3 === 0 && row > 0) classes.push('border-t-2');
    if (col % 3 === 0 && col > 0) classes.push('border-l-2');
    if (row === 8) classes.push('border-b-2');
    if (col === 8) classes.push('border-r-2');
    
    return classes.join(' ');
  };

  return (
    <button
      className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border border-gray-300 flex items-center justify-center text-sm sm:text-base lg:text-lg font-semibold transition-all touch-manipulation",
        getBorderClasses(),
        {
          // Background colors
          "bg-blue-100": isSelected,
          "bg-blue-50": isRelated && !isSelected,
          "bg-gray-100": isOriginalCell && !isSelected && !isRelated,
          "bg-white": !isOriginalCell && !isSelected && !isRelated,
          "bg-red-100": hasConflict,
          
          // Text colors
          "text-black font-bold": isOriginalCell,
          "text-blue-600": !isOriginalCell && value !== null,
          "text-red-600": hasConflict,
          
          // Cursor
          "cursor-pointer": !isOriginalCell,
          "cursor-default": isOriginalCell,
          
          // Hover effects
          "hover:bg-blue-50": !isOriginalCell && !isSelected,
        }
      )}
      onClick={onClick}
      disabled={isOriginalCell}
    >
      {value || ''}
    </button>
  );
}
