// 触控控制系统 - 移动端方向按钮
import { ControlMode, ControlOwner, GameStatus } from './state.js';
import { CONFIG } from './config.js';

export class TouchControls {
    constructor(state, onDirectionChange) {
        this.state = state;
        this.onDirectionChange = onDirectionChange;

        // 获取方向按钮
        this.btnUp = document.getElementById('btn-up');
        this.btnDown = document.getElementById('btn-down');
        this.btnLeft = document.getElementById('btn-left');
        this.btnRight = document.getElementById('btn-right');

        // 绑定触摸事件
        this.bindEvents();
    }

    bindEvents() {
        // 为每个方向按钮绑定触摸事件
        const buttons = [
            { el: this.btnUp, dir: 'up' },
            { el: this.btnDown, dir: 'down' },
            { el: this.btnLeft, dir: 'left' },
            { el: this.btnRight, dir: 'right' }
        ];

        buttons.forEach(btn => {
            if (!btn.el) return;

            // 触摸开始
            btn.el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouch(btn.dir);
            }, { passive: false });

            // 鼠标点击（桌面端备用）
            btn.el.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTouch(btn.dir);
            });
        });
    }

    handleTouch(direction) {
        // 如果游戏不在运行状态，不处理输入
        if (this.state.gameStatus !== GameStatus.RUNNING) {
            return;
        }

        const currentDirection = this.state.direction;

        // 禁止直接反向移动
        if (this.isOppositeDirection(direction, currentDirection)) {
            return;
        }

        // 更新方向
        this.state.nextDirection = direction;

        // 如果是自动模式，触发手动接管
        if (this.state.controlMode === ControlMode.AUTO) {
            this.state.controlOwner = ControlOwner.AUTO_WITH_MANUAL_OVERRIDE;
            this.state.manualOverrideUntil = Date.now() + CONFIG.MANUAL_OVERRIDE_DURATION;
        }

        // 回调
        if (this.onDirectionChange) {
            this.onDirectionChange(direction);
        }

        // 移动端震动反馈
        if (navigator.vibrate) {
            navigator.vibrate(30);
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
}