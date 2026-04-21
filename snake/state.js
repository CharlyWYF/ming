/* 贪吃蛇小游戏 - 状态管理 */
const STATE = {
    // 游戏状态: idle(未开始) / running(运行中) / paused(暂停) / gameover(结束)
    gameStatus: 'idle',

    // 蛇的数据
    snake: [],
    direction: { x: 0, y: -1 },        // 当前移动方向
    nextDirection: { x: 0, y: -1 },    // 下一帧方向(防止快速按键导致反向)
    growPending: 0,                    // 需要增长的长度

    // 食物
    food: { x: 0, y: 0, colorIndex: 0 },

    // 分数
    score: 0,
    highScore: 0,
    historyScores: [],

    // 游戏控制
    speed: CONFIG.baseSpeed,
    foodEaten: 0,                      // 本局吃到的食物数量
    gameLoop: null,                    // 游戏循环定时器
    isAutoMode: false,                 // 是否自动模式
};

// 初始化状态
function initState() {
    STATE.gameStatus = 'idle';
    STATE.snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    STATE.direction = { x: 0, y: -1 };
    STATE.nextDirection = { x: 0, y: -1 };
    STATE.growPending = 0;
    STATE.score = 0;
    STATE.speed = CONFIG.baseSpeed;
    STATE.foodEaten = 0;
    STATE.isAutoMode = false;
}

// 重置游戏(保留最高分和历史记录)
function resetGame() {
    STATE.snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    STATE.direction = { x: 0, y: -1 };
    STATE.nextDirection = { x: 0, y: -1 };
    STATE.growPending = 0;
    STATE.score = 0;
    STATE.speed = CONFIG.baseSpeed;
    STATE.foodEaten = 0;
    STATE.gameStatus = 'idle';
    STATE.isAutoMode = false;
}

// 从 localStorage 加载数据
function loadScoreData() {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    const savedHistory = localStorage.getItem('snakeHistoryScores');

    STATE.highScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
    STATE.historyScores = savedHistory ? JSON.parse(savedHistory) : [];
}

// 保存最高分到 localStorage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', STATE.highScore.toString());
}

// 保存历史记录到 localStorage
function saveHistoryScores() {
    localStorage.setItem('snakeHistoryScores', JSON.stringify(STATE.historyScores));
}

// 记录本局分数
function recordScore() {
    const scoreRecord = {
        score: STATE.score,
        time: Date.now()
    };

    STATE.historyScores.push(scoreRecord);

    // 按分数降序排序，同分时最近时间优先
    STATE.historyScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.time - a.time;
    });

    // 只保留前 10 条
    if (STATE.historyScores.length > 10) {
        STATE.historyScores = STATE.historyScores.slice(0, 10);
    }

    // 更新最高分
    if (STATE.score > STATE.highScore) {
        STATE.highScore = STATE.score;
        saveHighScore();
    }

    saveHistoryScores();
}