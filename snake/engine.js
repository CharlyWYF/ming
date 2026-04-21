/* 贪吃蛇小游戏 - 游戏引擎 */
const ENGINE = {
    // 初始化游戏
    init() {
        RENDERER.init();
        loadScoreData();
        UI.init();

        // 初始渲染
        RENDERER.render();
        UI.updateScoreDisplay();
        UI.updateHistoryDisplay();
    },

    // 开始游戏
    start() {
        if (STATE.gameStatus === 'running') return;

        initState();
        spawnFood();  // 来自 food.js
        STATE.gameStatus = 'running';

        if (STATE.gameLoop) {
            clearInterval(STATE.gameLoop);
        }

        STATE.gameLoop = setInterval(() => {
            this.update();
        }, STATE.speed);

        UI.showGameUI();
        UI.updateScoreDisplay();
        RENDERER.render();
    },

    // 游戏主循环
    update() {
        if (STATE.gameStatus !== 'running') return;

        // 1. 读取输入 (应用方向更新)
        STATE.direction = { ...STATE.nextDirection };

        // 2. 计算新蛇头位置
        const head = STATE.snake[0];
        const newHead = {
            x: head.x + STATE.direction.x,
            y: head.y + STATE.direction.y
        };

        // 3. 碰撞检测
        if (this.checkCollision(newHead)) {
            this.gameOver();
            return;
        }

        // 4. 吃食物判定
        let ateFood = false;
        if (newHead.x === STATE.food.x && newHead.y === STATE.food.y) {
            ateFood = true;
            STATE.growPending += 1;
            STATE.score += CONFIG.scorePerFood;
            STATE.foodEaten += 1;

            // 速度提升
            if (STATE.foodEaten % CONFIG.speedThreshold === 0) {
                STATE.speed = Math.max(50, STATE.speed - CONFIG.speedDecrease);
                this.restartLoop();
            }

            spawnFood();
        }

        // 5. 更新蛇身
        STATE.snake.unshift(newHead);

        if (!ateFood) {
            STATE.snake.pop();
        }

        // 6. 更新 UI
        UI.updateScoreDisplay();

        // 7. 渲染
        RENDERER.render();
    },

    // 碰撞检测
    checkCollision(head) {
        const { tileCount } = CONFIG;
        const { snake } = STATE;

        // 撞墙检测
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }

        // 撞自己检测
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    },

    // 游戏结束
    gameOver() {
        STATE.gameStatus = 'gameover';
        clearInterval(STATE.gameLoop);
        STATE.gameLoop = null;

        // 记录分数
        recordScore();

        // 更新 UI
        UI.showGameOver();
        UI.updateScoreDisplay();
        UI.updateHistoryDisplay();
    },

    // 暂停游戏
    pause() {
        if (STATE.gameStatus !== 'running') return;

        STATE.gameStatus = 'paused';
        clearInterval(STATE.gameLoop);
        STATE.gameLoop = null;

        UI.showPauseOverlay();
    },

    // 继续游戏
    resume() {
        if (STATE.gameStatus !== 'paused') return;

        STATE.gameStatus = 'running';
        STATE.gameLoop = setInterval(() => {
            this.update();
        }, STATE.speed);

        UI.hidePauseOverlay();
    },

    // 重新开始
    restart() {
        clearInterval(STATE.gameLoop);
        STATE.gameLoop = null;

        resetGame();
        spawnFood();  // 来自 food.js
        STATE.gameStatus = 'running';

        STATE.gameLoop = setInterval(() => {
            this.update();
        }, STATE.speed);

        UI.hideOverlays();
        UI.updateScoreDisplay();
        RENDERER.render();
    },

    // 重启游戏循环(速度变化时)
    restartLoop() {
        if (STATE.gameLoop) {
            clearInterval(STATE.gameLoop);
            STATE.gameLoop = setInterval(() => {
                this.update();
            }, STATE.speed);
        }
    },

    // 切换暂停/继续
    togglePause() {
        if (STATE.gameStatus === 'running') {
            this.pause();
        } else if (STATE.gameStatus === 'paused') {
            this.resume();
        }
    }
};