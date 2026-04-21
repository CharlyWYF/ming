// 游戏引擎核心
import { CONFIG } from './config.js';
import { GameStatus, ControlMode, ControlOwner, updateBestScore, addLeaderboardRecord } from './state.js';
import { Renderer } from './renderer.js';
import { InputSystem } from './input.js';
import { TouchControls } from './touch-controls.js';
import { Autopilot } from './autopilot.js';
import { Scoreboard } from './scoreboard.js';
import { UI } from './ui.js';
import { Food } from './food.js';

export class Game {
    constructor() {
        // 创建状态
        this.state = {
            gameStatus: GameStatus.IDLE,
            controlMode: ControlMode.MANUAL,
            controlOwner: ControlOwner.MANUAL,
            manualOverrideUntil: 0,
            score: 0,
            bestScore: parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_SCORE)) || 0,
            leaderboard: this.loadLeaderboard(),
            snake: [],
            direction: 'right',
            nextDirection: 'right',
            food: null,
            speed: CONFIG.INITIAL_SPEED,
            isMobileLayout: false
        };

        // 创建各模块
        this.renderer = new Renderer('game-canvas');
        this.autopilot = new Autopilot();
        this.food = new Food();
        this.scoreboard = new Scoreboard();
        this.ui = new UI(this.state);
        this.input = null;
        this.touchControls = null;

        // 游戏循环
        this.gameLoop = null;
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;

        // 初始化
        this.init();
    }

    init() {
        // 检测移动端布局
        this.state.isMobileLayout = this.detectMobileLayout();
        window.addEventListener('resize', () => {
            this.state.isMobileLayout = this.detectMobileLayout();
        });

        // 初始化输入系统
        this.input = new InputSystem(this.state);
        this.touchControls = new TouchControls(this.state);

        // 初始化 UI
        this.ui.showStartScreen();
        this.scoreboard.updateBestScore(this.state.bestScore);
        this.scoreboard.renderLeaderboard(this.state.leaderboard);
        this.ui.update();

        // 初始渲染
        this.renderer.clear();
    }

    loadLeaderboard() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    detectMobileLayout() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }

    // 开始游戏
    start() {
        if (this.state.gameStatus === GameStatus.RUNNING) return;

        // 重置游戏状态
        this.resetGame();

        this.state.gameStatus = GameStatus.RUNNING;
        this.ui.hideStartScreen();
        this.ui.hideGameOver();

        // 生成初始食物
        this.spawnFood();

        // 立即渲染一次（游戏循环启动前需要先显示）
        this.renderer.render(this.state);

        // 开始游戏循环
        this.startGameLoop();
    }

    // 暂停游戏
    pause() {
        if (this.state.gameStatus !== GameStatus.RUNNING) return;

        this.state.gameStatus = GameStatus.PAUSED;
        this.ui.showPause();
    }

    // 继续游戏
    resume() {
        if (this.state.gameStatus !== GameStatus.PAUSED) return;

        this.state.gameStatus = GameStatus.RUNNING;
        this.ui.hidePause();
        this.lastFrameTime = performance.now();
    }

    // 重新开始
    restart() {
        this.ui.hideGameOver();
        this.ui.hideStartScreen();
        this.start();
    }

    // 切换自动模式
    toggleAutoMode() {
        if (this.state.controlMode === ControlMode.MANUAL) {
            this.state.controlMode = ControlMode.AUTO;
            this.state.controlOwner = ControlOwner.AUTO;
        } else {
            this.state.controlMode = ControlMode.MANUAL;
            this.state.controlOwner = ControlOwner.MANUAL;
        }
        this.ui.update();
    }

    // 重置游戏状态
    resetGame() {
        this.state.score = 0;
        this.state.snake = this.createInitialSnake();
        this.state.direction = 'right';
        this.state.nextDirection = 'right';
        this.state.speed = CONFIG.INITIAL_SPEED;
        this.state.controlOwner = ControlOwner.MANUAL;
        this.state.manualOverrideUntil = 0;

        // 保留自动模式设置
        if (this.state.controlMode !== ControlMode.AUTO) {
            this.state.controlMode = ControlMode.MANUAL;
        }

        this.food.reset();
        this.scoreboard.updateScore(0);
    }

    // 创建初始蛇
    createInitialSnake() {
        const startX = Math.floor(CONFIG.GRID_COUNT_X / 2);
        const startY = Math.floor(CONFIG.GRID_COUNT_Y / 2);

        return [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
    }

    // 生成食物
    spawnFood() {
        const newFood = this.food.generate(this.state.snake);
        if (newFood) {
            this.state.food = newFood;
        } else {
            // 地图已满，游戏胜利
            this.gameOver(true);
        }
    }

    // 开始游戏循环
    startGameLoop() {
        this.lastFrameTime = performance.now();
        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    // 游戏主循环
    update(currentTime) {
        if (this.state.gameStatus !== GameStatus.RUNNING) {
            return;
        }

        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        this.accumulatedTime += deltaTime;

        // 按照速度间隔更新游戏
        if (this.accumulatedTime >= this.state.speed) {
            this.accumulatedTime -= this.state.speed;
            this.gameTick();
        }

        // 继续循环
        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    // 游戏帧更新
    gameTick() {
        // 1. 处理控制权
        this.processControl();

        // 2. 应用方向
        this.state.direction = this.state.nextDirection;

        // 3. 计算新蛇头
        const head = this.state.snake[0];
        const newHead = this.getNextPosition(head, this.state.direction);

        // 4. 碰撞检测
        if (this.checkCollision(newHead)) {
            this.gameOver();
            return;
        }

        // 5. 添加新蛇头
        this.state.snake.unshift(newHead);

        // 6. 检查是否吃到食物
        if (this.state.food &&
            newHead.x === this.state.food.x &&
            newHead.y === this.state.food.y) {
            // 吃到食物
            this.state.score += CONFIG.FOOD_SCORE;
            this.scoreboard.updateScore(this.state.score);

            // 加速
            if (this.state.speed > CONFIG.MIN_SPEED) {
                this.state.speed -= CONFIG.SPEED_DECREASE;
            }

            // 生成新食物
            this.spawnFood();
        } else {
            // 没吃到食物，移除蛇尾
            this.state.snake.pop();
        }

        // 7. 渲染
        this.renderer.render(this.state);
    }

    // 处理控制权
    processControl() {
        const now = Date.now();

        // 如果处于手动接管状态，检查是否过期
        if (this.state.controlOwner === ControlOwner.AUTO_WITH_MANUAL_OVERRIDE) {
            if (now > this.state.manualOverrideUntil) {
                // 手动接管过期，恢复自动控制
                this.state.controlOwner = ControlOwner.AUTO;
                this.ui.update();
            }
        }

        // 如果是自动模式且当前控制权是 auto，获取自动方向
        if (this.state.controlMode === ControlMode.AUTO &&
            this.state.controlOwner === ControlOwner.AUTO) {
            const autoDirection = this.autopilot.getSmartAutoDirection(this.state);

            // 检查自动方向是否会导致直接反向
            if (!this.isOppositeDirection(autoDirection, this.state.direction)) {
                this.state.nextDirection = autoDirection;
            }
        }
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

    // 检查碰撞
    checkCollision(position) {
        const { GRID_COUNT_X, GRID_COUNT_Y } = CONFIG;

        // 撞墙
        if (position.x < 0 || position.x >= GRID_COUNT_X ||
            position.y < 0 || position.y >= GRID_COUNT_Y) {
            return true;
        }

        // 撞自己
        for (let i = 0; i < this.state.snake.length - 1; i++) {
            if (position.x === this.state.snake[i].x &&
                position.y === this.state.snake[i].y) {
                return true;
            }
        }

        return false;
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

    // 游戏结束
    gameOver(isWin = false) {
        this.state.gameStatus = GameStatus.GAMEOVER;

        // 更新最高分
        updateBestScore(this.state.score, this.state);

        // 添加积分榜记录
        addLeaderboardRecord(
            this.state.score,
            this.state.controlMode,
            this.state
        );

        // 更新显示
        this.scoreboard.updateBestScore(this.state.bestScore);
        this.scoreboard.renderLeaderboard(this.state.leaderboard);

        // 更新最终分数显示
        const finalScoreEl = document.getElementById('final-score');
        if (finalScoreEl) {
            finalScoreEl.textContent = this.state.score;
        }

        // 显示结束画面
        this.ui.showGameOver();

        // 取消动画帧
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
    }

    // 销毁游戏
    destroy() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        if (this.input) {
            this.input.destroy();
        }
    }
}