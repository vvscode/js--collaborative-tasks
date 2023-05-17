import { GameField, IGameField } from "./GameField";
import { GameView, IGameView } from "./GameView";
import { Cell } from "./types/Cell";

export interface IGame {}

export class Game implements IGame {
  private isGameRun: boolean;
  constructor(
    private gameField: IGameField | GameField,
    private gameView: IGameView | GameView,
    private stepDurationMs: number = 500
  ) {
    const state: Cell[][] = gameField.getState();

    gameView.updateGameField(state);
    gameView.updateGameState({
      isRunning: false,
      width: state[0].length,
      height: state.length
    });

    gameView.onCellClick((y: number, x: number) => {
      gameField.toggleCellState(y, x);
      gameView.updateGameField(gameField.getState());
    });

    gameView.onFieldSizeChange((width: number, heigth: number) => {
      gameField.setSize(width, heigth);
      const newState: Cell[][] = gameField.getState();
      gameView.updateGameField(newState);
      gameView.updateGameState({
        width: newState[0].length,
        height: newState.length
      });
    });

    gameView.onGameStateChange(this.onGameStateChange);

    const tick = () => {
      if (this.isGameRun) {
        this.gameField.nextGeneration();
        this.gameView.updateGameField(gameField.getState());
      }
    };

    setInterval(tick, stepDurationMs);
  }

  onGameStateChange = (gameRunState: boolean) => {
    this.gameView.updateGameState({
      isRunning: gameRunState
    });
    this.isGameRun = gameRunState;

    if (gameRunState) {
      this.gameField.nextGeneration();
    }
    this.gameView.updateGameField(this.gameField.getState());
  };
}
