import clsx from 'clsx';
import { chunk, shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { Bomb } from './bomb';
import { Flag } from './flag';

import styles from './styles.scss';

type Difficulty = 'easy' | 'medium' | 'hard';

const minesMap = {
  easy: 15,
  medium: 25,
  hard: 40,
};

const getMineCount = (
  minesCount: number | undefined,
  difficulty: Difficulty,
  totalCells: number
) => {
  if (typeof minesCount !== 'undefined') {
    return minesCount;
  }

  return Math.floor((totalCells / 100) * minesMap[difficulty]);
};

type CellValue = string | number;

const getCellSurroundings = (grid: CellValue[][], coordinates: number[]) => {
  const [row, column] = coordinates;
  const prevRow = grid[row - 1];
  const nextRow = grid[row + 1];

  const topLeft = prevRow?.[column - 1];
  const top = prevRow?.[column];
  const topRight = prevRow?.[column + 1];
  const left = grid[row]?.[column - 1];
  const right = grid[row]?.[column + 1];
  const bottomLeft = nextRow?.[column - 1];
  const bottom = nextRow?.[column];
  const bottomRight = nextRow?.[column + 1];

  return {
    topLeft: { coordinates: [row - 1, column - 1], value: topLeft },
    top: { coordinates: [row - 1, column], value: top },
    topRight: { coordinates: [row - 1, column + 1], value: topRight },
    left: { coordinates: [row, column - 1], value: left },
    right: { coordinates: [row, column + 1], value: right },
    bottomLeft: { coordinates: [row + 1, column - 1], value: bottomLeft },
    bottom: { coordinates: [row + 1, column], value: bottom },
    bottomRight: { coordinates: [row + 1, column + 1], value: bottomRight },
  };
};

const buildMine = (
  minesCount: number,
  difficulty: Difficulty,
  rowSize: number,
  columnSize: number
) => {
  const totalCells = rowSize * columnSize;
  const newMinesCount = getMineCount(minesCount, difficulty, totalCells);

  const mines = [...Array(newMinesCount)].map(() => 'bomb');
  const cells = [...Array(totalCells - newMinesCount)].map(() => 0);

  const shuffled = shuffle([...mines, ...cells]);
  const chunked = chunk(shuffled, columnSize);

  return chunked.map((row, rowIndex) => {
    return row.map((column, columnIndex) => {
      if (column === 'bomb') {
        return column;
      }

      const surroundings = getCellSurroundings(chunked, [
        rowIndex,
        columnIndex,
      ]);

      const count = Object.values(surroundings).reduce((acc: number, item) => {
        if (item.value === 'bomb') {
          acc = acc + 1;
        }

        return acc;
      }, 0);

      return `${count}`;
    });
  });
};

interface MineCellProps {
  dark: boolean;
  onClick: () => void;
  onRightClick: () => void;
  value: string;
  visible: boolean;
  isGameOver: boolean;
}

export const MineCell = ({
  value,
  isGameOver,
  onClick,
  onRightClick,
  visible,
  dark,
}: MineCellProps) => {
  const isMine = value === 'bomb';
  const isFlag = value === 'flag';

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    onRightClick();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    onClick();
  };

  return (
    <button
      className={clsx(styles['mine-cell'], {
        [styles['mine-cell-visible']]: visible,
        [styles['mine-cell-dark']]: dark,
        [styles[`mine-cell-${value}`]]: visible && !!value,
        [styles[`mine-cell-bomb`]]: isGameOver && isMine,
        [styles[`mine-cell-flag`]]: visible && isFlag,
      })}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {isMine && isGameOver && <Bomb />}

      {isFlag && <Flag />}

      {!isMine && !isFlag && visible && value}
    </button>
  );
};

interface FreeCellsMap {
  [key: string]: CellValue;
}

const recursivelyFindEmptySpaces = (
  grid: string[][],
  coordinates: number[],
  freeCellsMap: FreeCellsMap = {}
) => {
  const cell = grid[coordinates[0]][coordinates[1]];

  if (cell === 'bomb') {
    return;
  }

  if (cell === undefined) {
    return;
  }

  freeCellsMap[`${coordinates[0]}_${coordinates[1]}`] = cell;

  const surroundings = getCellSurroundings(grid, coordinates);

  const surroundingsValues = Object.values(surroundings);
  const surroundingSafeCells = surroundingsValues.filter(
    (item) => Boolean(item.value) && item.value !== 'bomb'
  );

  // const newFreeCellsMap = surroundingSafeCells.reduce((acc, item) => {
  //   acc[`${item.coordinates[0]}_${item.coordinates[1]}`] = item.value;

  //   return acc;
  // }, freeCellsMap);

  surroundingSafeCells.forEach((item) => {
    if (freeCellsMap[`${item.coordinates[0]}_${item.coordinates[1]}`]) {
      return;
    }

    if (cell !== '0') {
      return;
    }

    recursivelyFindEmptySpaces(grid, item.coordinates, freeCellsMap);
  });

  return freeCellsMap;
};

export const MineGrid = () => {
  const [visibleGrid, setVisibleGrid] = useState<string[][]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const newGame = () => {
    const newGrid = buildMine(undefined, 'easy', 10, 10);
    const newVisibleGrid = newGrid.map((row) => row.map(() => ''));

    setVisibleGrid(newVisibleGrid);
    setIsGameOver(false);
    setGrid(newGrid);
  };

  useEffect(() => {
    newGame();
  }, []);

  const handleCellClick = (rowIndex: number, columnIndex: number) => () => {
    if (isGameOver) {
      return;
    }

    if (visibleGrid[rowIndex][columnIndex]) {
      return;
    }

    let newVisibleGrid = structuredClone(visibleGrid);
    const newIsGameOver = grid[rowIndex][columnIndex] === 'bomb';

    newVisibleGrid[rowIndex][columnIndex] = `${grid[rowIndex][columnIndex]}`;

    if (newIsGameOver) {
      newVisibleGrid = newVisibleGrid.map((row, rowIndex) =>
        row.map((column, columnIndex) => {
          if (grid[rowIndex][columnIndex] === 'bomb') {
            return 'bomb';
          }

          return column;
        })
      );
    } else {
      const freeCells = recursivelyFindEmptySpaces(grid, [
        rowIndex,
        columnIndex,
      ]);

      Object.keys(freeCells).forEach((key) => {
        const coordinates = key.split('_').map(Number);

        newVisibleGrid[coordinates[0]][coordinates[1]] = String(freeCells[key]);
      });
    }

    setIsGameOver(newIsGameOver);
    setVisibleGrid(newVisibleGrid);
  };

  const handleRightClick = (rowIndex: number, columnIndex: number) => () => {
    const cell = visibleGrid[rowIndex][columnIndex];

    if (cell && cell !== 'flag') {
      return;
    }

    const newVisibleGrid = structuredClone(visibleGrid);

    newVisibleGrid[rowIndex][columnIndex] = cell === 'flag' ? '' : 'flag';

    setVisibleGrid(newVisibleGrid);
  };

  const handleRestartButtonClick = () => {
    newGame();
  };

  return (
    <div>
      <div className={styles['mine-grid']}>
        <div className={`${styles['row']} ${styles['row-direction-column']}`}>
          {grid.map((row, rowIndex) => (
            <div className={styles['column']} key={rowIndex}>
              <div className={styles['row']}>
                {row.map((column, columnIndex) => (
                  <div className={styles['column']} key={columnIndex}>
                    <MineCell
                      onClick={handleCellClick(rowIndex, columnIndex)}
                      onRightClick={handleRightClick(rowIndex, columnIndex)}
                      dark={(rowIndex + columnIndex) % 2 === 0}
                      value={visibleGrid?.[rowIndex]?.[columnIndex]}
                      visible={!!visibleGrid?.[rowIndex]?.[columnIndex]}
                      isGameOver={isGameOver}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isGameOver && (
        <div>
          <div>game over</div>
          <button onClick={handleRestartButtonClick}>restart</button>
        </div>
      )}
    </div>
  );
};
