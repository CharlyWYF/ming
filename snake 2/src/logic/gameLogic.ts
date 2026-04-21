import { Point, Direction, GameStatus, GameState, ControlMode, ControlOwner } from '../types';
import { CELL_COUNT, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';

export const getRandomPoint = (exclude: Point[]): Point => {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };
  } while (exclude.some(p => p.x === point.x && p.y === point.y));
  return point;
};

export const getInitialState = (bestScore: number = 0): GameState => ({
  status: 'IDLE',
  controlMode: 'MANUAL',
  controlOwner: 'MANUAL',
  score: 0,
  bestScore,
  snake: INITIAL_SNAKE,
  direction: INITIAL_DIRECTION,
  nextDirection: INITIAL_DIRECTION,
  food: getRandomPoint(INITIAL_SNAKE),
  speed: INITIAL_SPEED,
});

export function isOpposite(dir1: Direction, dir2: Direction): boolean {
  if (dir1 === 'UP' && dir2 === 'DOWN') return true;
  if (dir1 === 'DOWN' && dir2 === 'UP') return true;
  if (dir1 === 'LEFT' && dir2 === 'RIGHT') return true;
  if (dir1 === 'RIGHT' && dir2 === 'LEFT') return true;
  return false;
}
