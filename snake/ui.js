// UI 控制系统
import { GameStatus, ControlMode, ControlOwner } from './state.js';

export class UI {
    constructor(state) {
        this.state = state;

        // 获取 UI 元素
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('gameover-screen');
        this.pauseOverlay = document.getElementById('pause-overlay');

        // 按钮
        this.btnStart = document.getElementById('btn-start');
        this.btnPause = document.getElementById('btn-pause');
        this.btnResume = document.getElementById('btn-resume');
        this.btnRestart = document.getElementById('btn-restart');
        this.btnToggleAuto = document.getElementById('btn-toggle-auto');

        // 状态指示
        this.controlIndicator = document.getElementById('control-indicator');

        // 绑定按钮事件
        this.bindEvents();
    }

    bindEvents() {
        if (this.btnStart) {
            this.btnStart.addEventListener('click', () => {
                window.game.start();
            });
        }

        if (this.btnPause) {
            this.btnPause.addEventListener('click', () => {
                window.game.pause();
            });
        }

        if (this.btnResume) {
            this.btnResume.addEventListener('click', () => {
                window.game.resume();
            });
        }

        if (this.btnRestart) {
            this.btnRestart.addEventListener('click', () => {
                window.game.restart();
            });
        }

        if (this.btnToggleAuto) {
            this.btnToggleAuto.addEventListener('click', () => {
                window.game.toggleAutoMode();
            });
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                if (this.state.gameStatus === GameStatus.IDLE) {
                    window.game.start();
                } else if (this.state.gameStatus === GameStatus.RUNNING) {
                    window.game.pause();
                } else if (this.state.gameStatus === GameStatus.PAUSED) {
                    window.game.resume();
                }
            }
        });
    }

    // 显示开始屏幕
    showStartScreen() {
        if (this.startScreen) this.startScreen.style.display = 'flex';
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
        if (this.pauseOverlay) this.pauseOverlay.style.display = 'none';
    }

    // 隐藏开始屏幕
    hideStartScreen() {
        if (this.startScreen) this.startScreen.style.display = 'none';
    }

    // 显示游戏结束屏幕
    showGameOver() {
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'flex';
        if (this.pauseOverlay) this.pauseOverlay.style.display = 'none';
    }

    // 隐藏游戏结束屏幕
    hideGameOver() {
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
    }

    // 显示暂停覆盖层
    showPause() {
        if (this.pauseOverlay) this.pauseOverlay.style.display = 'flex';
    }

    // 隐藏暂停覆盖层
    hidePause() {
        if (this.pauseOverlay) this.pauseOverlay.style.display = 'none';
    }

    // 更新控制模式指示器
    updateControlIndicator() {
        if (!this.controlIndicator) return;

        let text = '';
        let className = '';

        if (this.state.controlMode === ControlMode.AUTO) {
            if (this.state.controlOwner === ControlOwner.AUTO_WITH_MANUAL_OVERRIDE) {
                text = '👤 手动控制中';
                className = 'manual';
            } else {
                text = '🤖 自动控制中';
                className = 'auto';
            }
        } else {
            text = '👤 手动控制';
            className = 'manual';
        }

        this.controlIndicator.textContent = text;
        this.controlIndicator.className = 'control-indicator ' + className;
    }

    // 更新自动模式按钮状态
    updateAutoButton() {
        if (!this.btnToggleAuto) return;

        if (this.state.controlMode === ControlMode.AUTO) {
            this.btnToggleAuto.textContent = '🤖 自动已开启';
            this.btnToggleAuto.classList.add('active');
        } else {
            this.btnToggleAuto.textContent = '🤖 开启自动';
            this.btnToggleAuto.classList.remove('active');
        }
    }

    // 更新所有 UI
    update() {
        this.updateControlIndicator();
        this.updateAutoButton();
    }
}