/* 贪吃蛇小游戏 - UI 模块 */
const UI = {
    elements: {},

    init() {
        // 获取 DOM 元素
        this.elements = {
            startScreen: document.getElementById('startScreen'),
            gameContainer: document.getElementById('gameContainer'),
            score: document.getElementById('score'),
            highScore: document.getElementById('highScore'),
            finalScore: document.getElementById('finalScore'),
            pauseOverlay: document.getElementById('pauseOverlay'),
            gameOverOverlay: document.getElementById('gameOverOverlay'),
            historyList: document.getElementById('historyList'),

            // 按钮
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            restartBtn: document.getElementById('restartBtn'),
            restartBtn2: document.getElementById('restartBtn2'),
            resumeBtn: document.getElementById('resumeBtn'),
        };

        // 绑定事件
        this.bindEvents();
    },

    bindEvents() {
        const { startBtn, pauseBtn, restartBtn, restartBtn2, resumeBtn } = this.elements;

        // 开始按钮
        if (startBtn) {
            startBtn.addEventListener('click', () => ENGINE.start());
        }

        // 暂停按钮
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => ENGINE.pause());
        }

        // 继续按钮
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => ENGINE.resume());
        }

        // 重新开始按钮 (游戏结束界面)
        if (restartBtn) {
            restartBtn.addEventListener('click', () => ENGINE.restart());
        }

        // 重新开始按钮 (控制面板)
        if (restartBtn2) {
            restartBtn2.addEventListener('click', () => ENGINE.restart());
        }
    },

    // 显示开始界面
    showStartScreen() {
        this.elements.startScreen.style.display = 'flex';
        this.elements.gameContainer.style.display = 'none';
    },

    // 显示游戏界面
    showGameUI() {
        this.elements.startScreen.style.display = 'none';
        this.elements.gameContainer.style.display = 'block';
    },

    // 显示暂停遮罩
    showPauseOverlay() {
        this.elements.pauseOverlay.style.display = 'flex';
    },

    // 隐藏暂停遮罩
    hidePauseOverlay() {
        this.elements.pauseOverlay.style.display = 'none';
    },

    // 显示游戏结束
    showGameOver() {
        this.elements.finalScore.textContent = STATE.score;
        this.elements.gameOverOverlay.style.display = 'flex';
    },

    // 隐藏所有遮罩
    hideOverlays() {
        this.elements.pauseOverlay.style.display = 'none';
        this.elements.gameOverOverlay.style.display = 'none';
    },

    // 更新分数显示
    updateScoreDisplay() {
        this.elements.score.textContent = STATE.score;
        this.elements.highScore.textContent = STATE.highScore;
    },

    // 更新历史记录显示
    updateHistoryDisplay() {
        const { historyList } = this.elements;
        const { historyScores } = STATE;

        if (!historyList) return;

        if (historyScores.length === 0) {
            historyList.innerHTML = '<li class="empty-history">暂无记录</li>';
            return;
        }

        historyList.innerHTML = historyScores.map((record, index) => {
            const date = new Date(record.time);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

            return `
                <li class="history-item">
                    <span class="history-rank">#${index + 1}</span>
                    <span class="history-score">${record.score}分</span>
                    <span class="history-time">${dateStr}</span>
                </li>
            `;
        }).join('');
    }
};