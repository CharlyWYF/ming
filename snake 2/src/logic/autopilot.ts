import { Point, Direction } from '../types';

/**
 * Simple autopilot logic for Snake.
 * Tries to move towards food while avoiding immediate collisions.
 */
export function getNextAutoDirection(
  snake: Point[],
  food: Point,
  gridCount: number
): Direction {
  const head = snake[0];
  
  // Directions to check in order of preference
  const possibleDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  
  // Calculate distance to food for each direction
  const scoredDirections = possibleDirections.map(dir => {
    const nextHead = getNextHead(head, dir);
    
    // Check for collisions
    const isCollision = 
      nextHead.x < 0 || 
      nextHead.x >= gridCount || 
      nextHead.y < 0 || 
      nextHead.y >= gridCount ||
      snake.some((segment, index) => index !== snake.length - 1 && segment.x === nextHead.x && segment.y === nextHead.y);

    if (isCollision) return { dir, score: Infinity };

    // Distance to food
    const dist = Math.abs(nextHead.x - food.x) + Math.abs(nextHead.y - food.y);
    return { dir, score: dist };
  });

  // Filter out collisions and sort by distance
  const validDirections = scoredDirections
    .filter(d => d.score !== Infinity)
    .sort((a, b) => a.score - b.score);

  if (validDirections.length > 0) {
    return validDirections[0].dir;
  }

  // If no valid direction found, just keep going or try anything
  return 'UP';
}

function getNextHead(head: Point, dir: Direction): Point {
  switch (dir) {
    case 'UP': return { x: head.x, y: head.y - 1 };
    case 'DOWN': return { x: head.x, y: head.y + 1 };
    case 'LEFT': return { x: head.x - 1, y: head.y };
    case 'RIGHT': return { x: head.x + 1, y: head.y };
  }
}
