// 输入系统 - 键盘控制
import { GameStatus, ControlMode, ControlOwner } from './state.js';
import { CONFIG } from './config.js';

export class InputSystem {
    constructor(state, onDirectionChange) {
        this.state = state;
        this.onDirectionChange = onDirectionChange;

        // 绑定键盘事件
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        // 如果游戏在空闲状态，方向键可以开始游戏
        if (this.state.gameStatus === GameStatus.IDLE) {
            const key = e.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(key)) {
                window.game.start();
                return;
            }
        }

        // 如果游戏不在运行或暂停状态，不处理输入
        if (this.state.gameStatus !== GameStatus.RUNNING &&
            this.state.gameStatus !== GameStatus.PAUSED) {
            return;
        }

        // 暂停时按空格或Enter可以继续/暂停
        if (this.state.gameStatus === GameStatus.PAUSED) {
            if (e.code === 'Space' || e.code === 'Enter') {
                return; // 让UI处理
            }
        }

        const key = e.key;
        let newDirection = null;

        // 方向键映射
        switch (key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                newDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                newDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                newDirection = 'right';
                break;
            default:
                return;
        }

        if (newDirection) {
            e.preventDefault();
            this.processInput(newDirection);
        }
    }

    // 处理方向输入
    processInput(newDirection) {
        const currentDirection = this.state.direction;

        // 禁止直接反向移动
        if (this.isOppositeDirection(newDirection, currentDirection)) {
            return;
        }

        // 更新方向
        this.state.nextDirection = newDirection;

        // 如果是自动模式，触发手动接管
        if (this.state.controlMode === ControlMode.AUTO) {
            this.state.controlOwner = ControlOwner.AUTO_WITH_MANUAL_OVERRIDE;
            this.state.manualOverrideUntil = Date.now() + CONFIG.MANUAL_OVERRIDE_DURATION;
        }

        // 回调
        if (this.onDirectionChange) {
            this.onDirectionChange(newDirection);
        }
    }

    // 检查是否为相反方向
    isOppositeDirection(dir1, dir2) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        return opposites[dir1] === dir2;
    }

    // 清理事件监听
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
}