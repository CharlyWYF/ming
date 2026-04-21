export const GRID_SIZE = 20;
export const CELL_COUNT = 20; // 20x20 grid

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION = 'UP';
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREMENT = 2;

export const OVERRIDE_DURATION_MS = 200; // 0.2 seconds of manual control before AI takes back

export const COLORS = {
  background: '#F4F7F2', 
  grid: '#EDF2F7',
  canvasBg: '#FFFFFF',
  snakeHead: '#2F855A',
  snakeBody: '#48BB78',
  snakeBorder: '#2F855A',
  food: '#F56565',
  foodBorder: '#C53030',
  text: '#2D3748',
  mutedText: '#A0AEC0',
  accent: '#4299E1', // Blue for primary actions
  pillActive: '#C6F6D5',
  pillActiveText: '#22543D',
  pillOverride: '#FEEBC8',
  pillOverrideText: '#744210',
};

export const STORAGE_KEY = 'snake-go-ai-data';
