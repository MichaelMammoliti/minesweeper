import clsx from "clsx";
import { chunk, shuffle } from "lodash";
import { useEffect, useState } from "react";

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

  const mines = [...Array(newMinesCount)].map(() => "x");
  const cells = [...Array(totalCells - newMinesCount)].map(() => 0);

  const shuffled = shuffle([...mines, ...cells]);
  const chunked = chunk(shuffled, columnSize);

  return chunked.map((row, rowIndex) => {
    return row.map((column, columnIndex) => {
      if (column === "x") {
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
        if (item === "x") {
          acc = acc + 1;
        }

        return acc;
      }, 0);

      return count;
    });
  });
};

interface MineCellProps {
  children: string;
  dark: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const MineCell = ({ onClick, children, dark }: MineCellProps) => {
  return (
    <button
      className={clsx(styles["mine-cell"], {
        [styles["mine-cell-visible"]]: !!children,
        [styles["mine-cell-dark"]]: dark,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const MineGrid = () => {
  const [visibleCells, setVisibleCells] = useState([]);
  const [mines, setMines] = useState<(string | number)[][]>([]);

  useEffect(() => {
    const builtMines = buildMine(undefined, "easy", 25, 25);
    const uncoveredCells = builtMines.map((row) => row.map(() => false));

    setVisibleCells(uncoveredCells);
    setMines(builtMines);
  }, []);

  const handleCellClick = (rowIndex: number, columnIndex: number) => () => {
    const newVisibleCells = JSON.parse(
      JSON.stringify(visibleCells)
    ) as boolean[][];

    newVisibleCells[rowIndex][columnIndex] = true;

    setVisibleCells(newVisibleCells);
  };

  return (
    <div className={styles["mine-grid"]}>
      {mines.map((row, rowIndex) => (
        <div key={rowIndex} className={styles["mine-grid-row"]}>
          {row.map((column, columnIndex) => (
            <div className={styles["mine-grid-column"]} key={columnIndex}>
              <MineCell
                onClick={handleCellClick(rowIndex, columnIndex)}
                dark={(rowIndex + columnIndex) % 2 === 0}
              >
                {Boolean(visibleCells?.[rowIndex]?.[columnIndex]) &&
                  `${column}`}
              </MineCell>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
