// 自动接管系统
import { CONFIG } from './config.js';

export class Autopilot {
    constructor() {
        // 可用的移动方向
        this.directions = ['up', 'down', 'left', 'right'];
    }

    // 获取自动建议方向
    getAutoDirection(state) {
        const snake = state.snake;
        const food = state.food;

        if (!snake || snake.length === 0 || !food) {
            return state.direction;
        }

        const head = snake[0];
        const currentDir = state.direction;

        // 1. 首先获取所有安全方向
        const safeDirections = this.getSafeDirections(state);

        if (safeDirections.length === 0) {
            // 没有安全方向，返回当前方向（等死）
            return currentDir;
        }

        // 2. 评估哪个方向能更好地接近食物
        let bestDirection = safeDirections[0];
        let bestScore = -Infinity;

        for (const dir of safeDirections) {
            const nextPos = this.getNextPosition(head, dir);
            const score = this.evaluateDirection(nextPos, food, snake);

            if (score > bestScore) {
                bestScore = score;
                bestDirection = dir;
            }
        }

        return bestDirection;
    }

    // 获取所有安全方向
    getSafeDirections(state) {
        const head = state.snake[0];
        const safeDirections = [];

        for (const dir of this.directions) {
            const nextPos = this.getNextPosition(head, dir);

            if (this.isSafe(nextPos, state)) {
                safeDirections.push(dir);
            }
        }

        return safeDirections;
    }

    // 检查位置是否安全（不撞墙不撞自己）
    isSafe(position, state) {
        const { GRID_COUNT_X, GRID_COUNT_Y } = CONFIG;
        const snake = state.snake;

        // 检查是否撞墙
        if (position.x < 0 || position.x >= GRID_COUNT_X ||
            position.y < 0 || position.y >= GRID_COUNT_Y) {
            return false;
        }

        // 检查是否撞自己
        for (let i = 0; i < snake.length - 1; i++) {
            if (position.x === snake[i].x && position.y === snake[i].y) {
                return false;
            }
        }

        return true;
    }

    // 获取下一个位置
    getNextPosition(head, direction) {
        switch (direction) {
            case 'up': return { x: head.x, y: head.y - 1 };
            case 'down': return { x: head.x, y: head.y + 1 };
            case 'left': return { x: head.x - 1, y: head.y };
            case 'right': return { x: head.x + 1, y: head.y };
            default: return { x: head.x, y: head.y };
        }
    }

    // 评估方向得分（离食物越近分数越高）
    evaluateDirection(position, food, snake) {
        const distance = Math.abs(position.x - food.x) + Math.abs(position.y - food.y);
        return -distance; // 距离越近分数越高
    }

    // 使用BFS检查是否有到食物的安全路径
    hasPathToFood(state) {
        const snake = state.snake;
        const food = state.food;
        if (!snake || !food) return false;

        const head = snake[0];
        const visited = new Set();
        const queue = [head];

        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            // 找到食物
            if (current.x === food.x && current.y === food.y) {
                return true;
            }

            // 探索邻居
            for (const dir of this.directions) {
                const nextPos = this.getNextPosition(current, dir);
                const nextKey = `${nextPos.x},${nextPos.y}`;

                if (!visited.has(nextKey) && this.isSafe(nextPos, state)) {
                    queue.push(nextPos);
                }
            }
        }

        return false;
    }

    // 增强版：更智能的路径评估
    getSmartAutoDirection(state) {
        const snake = state.snake;
        const food = state.food;

        if (!snake || snake.length === 0 || !food) {
            return state.direction;
        }

        const head = snake[0];
        const currentDir = state.direction;

        // 1. 获取安全方向
        const safeDirections = this.getSafeDirections(state);

        if (safeDirections.length === 0) {
            return currentDir;
        }

        // 2. 检查是否能到达食物
        const canReachFood = this.hasPathToFood(state);

        // 3. 如果能到达食物，优先选择能到达食物的方向
        if (canReachFood) {
            let bestDirection = safeDirections[0];
            let bestScore = -Infinity;

            for (const dir of safeDirections) {
                const nextPos = this.getNextPosition(head, dir);
                const score = this.evaluateDirection(nextPos, food, snake);

                if (score > bestScore) {
                    bestScore = score;
                    bestDirection = dir;
                }
            }

            return bestDirection;
        }

        // 4. 如果不能直接到达食物，选择最远离蛇身的方向（生存优先）
        let safestDirection = safeDirections[0];
        let maxDistance = -Infinity;

        for (const dir of safeDirections) {
            const nextPos = this.getNextPosition(head, dir);
            const avgDistance = this.getAverageDistanceFromSnake(nextPos, snake);

            if (avgDistance > maxDistance) {
                maxDistance = avgDistance;
                safestDirection = dir;
            }
        }

        return safestDirection;
    }

    // 计算到蛇身的平均距离
    getAverageDistanceFromSnake(position, snake) {
        let totalDistance = 0;
        for (const segment of snake) {
            totalDistance += Math.abs(position.x - segment.x) + Math.abs(position.y - segment.y);
        }
        return totalDistance / snake.length;
    }
}