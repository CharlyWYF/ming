/* 贪吃蛇小游戏 - 规则模块 */
const RULES = {
    // 检查方向是否允许变更
    canChangeDirection(newDir) {
        const { direction } = STATE;

        // 不能直接反向
        if (newDir.x === -direction.x && newDir.y === -direction.y) {
            return false;
        }
        if (newDir.x === direction.x && newDir.y === direction.y) {
            return false;
        }

        return true;
    },

    // 变更方向
    changeDirection(newDir) {
        if (STATE.gameStatus !== 'running') return;
        if (STATE.isAutoMode) return; // 自动模式下不响应手动输入

        if (this.canChangeDirection(newDir)) {
            STATE.nextDirection = { ...newDir };
        }
    },

    // 检查位置是否为空(无蛇)
    isPositionEmpty(x, y) {
        for (const part of STATE.snake) {
            if (part.x === x && part.y === y) {
                return false;
            }
        }
        return true;
    },

    // 检查位置是否在地图内
    isInBounds(x, y) {
        const { tileCount } = CONFIG;
        return x >= 0 && x < tileCount && y >= 0 && y < tileCount;
    },

    // 获取所有可用的移动方向
    getAvailableDirections(head) {
        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }, // 左
            { x: 1, y: 0 }   // 右
        ];

        return directions.filter(dir => {
            const newX = head.x + dir.x;
            const newY = head.y + dir.y;

            // 检查边界
            if (!this.isInBounds(newX, newY)) return false;

            // 检查是否撞自己
            if (!this.isPositionEmpty(newX, newY)) return false;

            // 不能直接反向
            if (dir.x === -STATE.direction.x && dir.y === -STATE.direction.y) return false;

            return true;
        });
    }
};