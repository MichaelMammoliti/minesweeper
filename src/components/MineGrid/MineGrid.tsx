import clsx from "clsx";
import { chunk, shuffle } from "lodash";
import { useEffect, useState } from "react";
import { Bomb } from "./bomb";
import { Flag } from "./flag";

import styles from "./styles.scss";

const getMinePercentage = (
  minesCount: number | undefined,
  difficulty: string,
  totalCells: number
) => {
  if (typeof minesCount !== "undefined") {
    return minesCount;
  }

  let percentageOfMines = 0;

  if (difficulty === "easy") {
    percentageOfMines = 10;
  }

  if (difficulty === "medium") {
    percentageOfMines = 15;
  }

  if (difficulty === "hard") {
    percentageOfMines = 20;
  }

  return Math.floor((totalCells / 100) * percentageOfMines);
};

const buildMine = (
  minesCount: number,
  difficulty: string,
  rowSize: number,
  columnSize: number
) => {
  const totalCells = rowSize * columnSize;
  const newMinesCount = getMinePercentage(minesCount, difficulty, totalCells);

  const mines = [...Array(newMinesCount)].map(() => "bomb");
  const cells = [...Array(totalCells - newMinesCount)].map(() => 0);

  const shuffled = shuffle([...mines, ...cells]);
  const chunked = chunk(shuffled, columnSize);

  return chunked.map((row, rowIndex) => {
    return row.map((column, columnIndex) => {
      if (column === "bomb") {
        return column;
      }

      const prevRow = chunked[rowIndex - 1];
      const nextRow = chunked[rowIndex + 1];

      const topLeft = prevRow?.[columnIndex - 1];
      const top = prevRow?.[columnIndex];
      const topRight = prevRow?.[columnIndex + 1];
      const left = chunked[rowIndex]?.[columnIndex - 1];
      const right = chunked[rowIndex]?.[columnIndex + 1];
      const bottomLeft = nextRow?.[columnIndex - 1];
      const bottom = nextRow?.[columnIndex];
      const bottomRight = nextRow?.[columnIndex + 1];

      const minesAround = {
        topLeft,
        top,
        topRight,
        left,
        right,
        bottomLeft,
        bottom,
        bottomRight,
      };

      const count = Object.values(minesAround).reduce((acc: number, item) => {
        if (item === "bomb") {
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

export const clone = (value: any) => {
  return JSON.parse(JSON.stringify(value));
};

export const MineCell = ({
  value,
  isGameOver,
  onClick,
  onRightClick,
  visible,
  dark,
}: MineCellProps) => {
  const isMine = value === "bomb";
  const isFlag = value === "flag";

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
      className={clsx(styles["mine-cell"], {
        [styles["mine-cell-visible"]]: visible,
        [styles["mine-cell-dark"]]: dark,
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

export const MineGrid = () => {
  const [visibleGrid, setVisibleGrid] = useState<string[][]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const newGame = () => {
    const newGrid = buildMine(undefined, "easy", 10, 10);
    const newVisibleGrid = newGrid.map((row) => row.map(() => ""));

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

    let newVisibleGrid = clone(visibleGrid) as string[][];
    const newIsGameOver = grid[rowIndex][columnIndex] === "bomb";

    newVisibleGrid[rowIndex][columnIndex] = `${grid[rowIndex][columnIndex]}`;

    if (newIsGameOver) {
      newVisibleGrid = newVisibleGrid.map((row, rowIndex) =>
        row.map((column, columnIndex) => {
          if (grid[rowIndex][columnIndex] === "bomb") {
            return "bomb";
          }

          return column;
        })
      );
    }

    setIsGameOver(newIsGameOver);
    setVisibleGrid(newVisibleGrid);
  };

  const handleRightClick = (rowIndex: number, columnIndex: number) => () => {
    if (visibleGrid[rowIndex][columnIndex]) {
      return;
    }

    const newVisibleGrid = clone(visibleGrid) as string[][];

    newVisibleGrid[rowIndex][columnIndex] = "flag";

    console.log(newVisibleGrid);

    setVisibleGrid(newVisibleGrid);
  };

  const handleRestartButtonClick = () => {
    newGame();
  };

  return (
    <div>
      <div className={styles["mine-grid"]}>
        <div className={`${styles["row"]} ${styles["row-direction-column"]}`}>
          {grid.map((row, rowIndex) => (
            <div className={styles["column"]} key={rowIndex}>
              <div className={styles["row"]}>
                {row.map((column, columnIndex) => (
                  <div className={styles["column"]} key={columnIndex}>
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
