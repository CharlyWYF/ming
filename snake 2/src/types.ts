export type Point = { x: number; y: number };

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'GAMEOVER';

export type ControlMode = 'MANUAL' | 'AUTO';

export type ControlOwner = 'MANUAL' | 'AUTO' | 'AUTO_OVERRIDE';

export interface LeaderboardEntry {
  id: string;
  score: number;
  mode: ControlMode;
  date: string;
}

export interface GameState {
  status: GameStatus;
  controlMode: ControlMode;
  controlOwner: ControlOwner;
  score: number;
  bestScore: number;
  snake: Point[];
  direction: Direction;
  nextDirection: Direction;
  food: Point;
  speed: number;
}
