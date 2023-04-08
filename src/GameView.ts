import { Cell } from "./types/Cell";

export interface IGameView {
  updateGameField(field: Cell[][]);
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  });
  onCellClick(cb: (x: number, y: number) => void);
  onGameStateChange(cb: (newState: boolean) => void);
  onFieldSizeChange(cb: (width: number, height: number) => void);
}

export class GameView implements IGameView {
  private element: HTMLElement;
  private gameRunState: boolean;

  constructor(element: HTMLElement) {
    const gameField: HTMLElement = document.createElement("table");
    gameField.classList.add("gameField");

    const gameComtrols: HTMLElement = document.createElement("div");
    gameComtrols.classList.add("gameControls");

    const inputWidth: HTMLInputElement = document.createElement("input");
    inputWidth.type = "number";
    inputWidth.classList.add("field-size", "field-size--width");

    const inputHeight: HTMLInputElement = document.createElement("input");
    inputHeight.type = "number";
    inputHeight.classList.add("field-size", "field-size--height");

    const runButton: HTMLButtonElement = document.createElement("button");
    runButton.classList.add("run-button", "run-button--stopped");
    runButton.innerHTML = `Play`;

    gameComtrols.append(runButton, inputWidth, inputHeight);

    element.append(gameField, gameComtrols);
    this.element = element;
  }

  public updateGameField(field: Cell[][]) {
    const tableElem: HTMLTableElement = this.element.querySelector(
      ".gameField"
    );
    while (tableElem.rows.length > 0) {
      tableElem.deleteRow(-1);
    }
    field.map((row: Cell[], x) => {
      const newRow: HTMLTableRowElement = tableElem.insertRow(-1);
      row.map((item: Cell, y) => {
        const newCell: HTMLTableCellElement = newRow.insertCell(-1);
        newCell.classList.add("cell");
        newCell.classList.add(field[x][y] === 0 ? "cell--dead" : "cell--alive");
        return null;
      });
      return null;
    });
  }

  public updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  }) {
    if (!(state.isRunning === undefined)) {
      this.gameRunState = state.isRunning;
      const runButton: HTMLButtonElement = this.element.querySelector(
        ".run-button"
      );
      runButton.classList.remove(runButton.classList[1]);
      if (state.isRunning) {
        runButton.classList.add("run-button--runned");
        runButton.innerHTML = "Stop";
      } else {
        runButton.classList.add("run-button--stopped");
        runButton.innerHTML = "Play";
      }
    }
    if (!(state.width === undefined || state.height === undefined)) {
      const inputWidth: HTMLInputElement = this.element.querySelector(
        ".field-size--width"
      );
      inputWidth.value = String(state.width);
      const inputHeight: HTMLInputElement = this.element.querySelector(
        ".field-size--height"
      );
      inputHeight.value = String(state.height);
    }
  }

  public onCellClick(cb: (x: number, y: number) => void) {
    const tableELem: HTMLTableElement = this.element.querySelector(
      ".gameField"
    );

    function callCbWithArgs(element): void {
      const y: number = element.target.cellIndex;
      const x: number = element.target.closest("tr").rowIndex;
      cb(y, x);
    }

    tableELem.addEventListener("click", callCbWithArgs, true);
  }

  public onGameStateChange(cb: (newState: boolean) => void) {
    const runButton: HTMLButtonElement = this.element.querySelector(
      ".run-button"
    );

    function callCbWithArgs(element): void {
      const gameState: string = element.target.innerHTML;
      cb(gameState !== "Stop");
    }
    runButton.addEventListener("click", callCbWithArgs);
  }

  public onFieldSizeChange(cb: (width: number, height: number) => void) {
    const inputWidth: HTMLInputElement = this.element.querySelector(
      ".field-size--width"
    );
    const inputHeight: HTMLInputElement = this.element.querySelector(
      ".field-size--height"
    );

    function callCb(element): void {
      let width: number;
      let height: number;
      if (element.target.classList[1] === "field-size--width") {
        width = Number(element.target.value);
        height = Number(
          element.target
            .closest(".gameControls")
            .querySelector(".field-size--height").value
        );
      } else {
        height = Number(element.target.value);
        width = Number(
          element.target
            .closest(".gameControls")
            .querySelector(".field-size--width").value
        );
      }
      cb(width, height);
    }

    inputWidth.addEventListener("change", callCb);
    inputHeight.addEventListener("change", callCb);
  }
}
