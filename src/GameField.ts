import { Cell } from "./types/Cell";

export interface IGameField {
  getState(): Cell[][];
  toggleCellState(x: number, y: number);
  nextGeneration();
  setSize(width: number, height: number);
}

export class GameField implements IGameField {
  private field: Cell[][];
  constructor(width?: number, heigth: number = 1) {
    let result = [];

    for (let i = 0; i < heigth; i++) {
      result.push([]);
      for (let z = 0; z < width; z++) {
        result[i].push(0);
      }
    }
    this.field = result;
  }
  public getState(): Cell[][] {
    return this.field;
  }

  public toggleCellState(x: number, y: number) {
    this.field[y][x] = this.field[y][x] === 0 ? 1 : 0;
  }

  public nextGeneration() {
    // next generation
    this.field = this.getNextGeneration(this.field);
  }

  private getNextGeneration(field: Cell[][]): Cell[][] {
    return field.map((row: Cell[], y: number) =>
      row.map((cell: Cell, x: number) => {
        const aliveNum = this.getNumberOfAliveNeighbours(x, y);
        let cellState;
        // в пустой (мёртвой) клетке, рядом с которой ровно три живые клетки, зарождается жизнь;
        //  если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить; в противном случае, если соседей меньше двух или больше трёх, клетка умирает («от одиночества» или «от перенаселённости»)
        if (aliveNum === 3 && field[y][x] === 0) {
          cellState = 1;
        } else if ((aliveNum === 2 || aliveNum === 3) && field[y][x] === 1) {
          cellState = 1;
        } else {
          cellState = 0;
        }
        return cellState;
      })
    );
  }

  private getNumberOfAliveNeighbours(x: number, y: number): number {
    let ret = 0;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        if (i === y && j === x) {
          continue;
        }
        if (this.field[i] && this.field[i][j]) {
          ret += 1;
        }
      }
    }
    return ret;
  }

  public setSize(width: number, height: number) {
    let newField = [];

    for (let i = 0; i < height; i++) {
      newField.push([]);
      for (let j = 0; j < width; j++) {
        newField[i].push(
          this.field[i] && this.field[i][j] ? this.field[i][j] : 0
        );
      }
    }

    this.field = newField;
  }
}
