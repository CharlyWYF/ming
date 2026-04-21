// 游戏食物系统
import { CONFIG } from './config.js';

export class Food {
    constructor() {
        this.position = null;
    }

    // 随机生成食物位置
    generate(snake) {
        const { GRID_COUNT_X, GRID_COUNT_Y } = CONFIG;
        let newPosition;
        let attempts = 0;
        const maxAttempts = 100;

        // 尝试找到不与蛇身重叠的位置
        do {
            newPosition = {
                x: Math.floor(Math.random() * GRID_COUNT_X),
                y: Math.floor(Math.random() * GRID_COUNT_Y)
            };
            attempts++;
        } while (this.isOnSnake(newPosition, snake) && attempts < maxAttempts);

        // 如果找不到空位，返回 null（游戏胜利或结束）
        if (attempts >= maxAttempts) {
            this.position = null;
            return null;
        }

        this.position = newPosition;
        return newPosition;
    }

    // 检查食物是否在蛇身上
    isOnSnake(position, snake) {
        if (!snake) return false;
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }

    // 获取食物位置
    getPosition() {
        return this.position;
    }

    // 重置食物
    reset() {
        this.position = null;
    }
}