// 游戏状态管理
import { CONFIG } from './config.js';

export const GameStatus = {
    IDLE: 'idle',         // 初始状态
    RUNNING: 'running',   // 运行中
    PAUSED: 'paused',     // 暂停
    GAMEOVER: 'gameover'  // 结束
};

export const ControlMode = {
    MANUAL: 'manual',     // 手动模式
    AUTO: 'auto'          // 自动模式
};

export const ControlOwner = {
    MANUAL: 'manual',                     // 手动控制
    AUTO: 'auto',                         // 自动控制
    AUTO_WITH_MANUAL_OVERRIDE: 'auto_with_manual_override'  // 自动但手动临时接管
};

// 创建初始状态
export function createInitialState() {
    return {
        // 游戏状态
        gameStatus: GameStatus.IDLE,

        // 控制模式
        controlMode: ControlMode.MANUAL,
        controlOwner: ControlOwner.MANUAL,
        manualOverrideUntil: 0,

        // 分数
        score: 0,
        bestScore: parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_SCORE)) || 0,
        leaderboard: loadLeaderboard(),

        // 蛇
        snake: [],
        direction: 'right',
        nextDirection: 'right',

        // 食物
        food: null,

        // 速度
        speed: CONFIG.INITIAL_SPEED,

        // 布局
        isMobileLayout: false
    };
}

// 加载积分榜
function loadLeaderboard() {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// 保存积分榜
export function saveLeaderboard(leaderboard) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch (e) {
        console.error('Failed to save leaderboard:', e);
    }
}

// 更新最高分
export function updateBestScore(score, state) {
    if (score > state.bestScore) {
        state.bestScore = score;
        localStorage.setItem(CONFIG.STORAGE_KEYS.BEST_SCORE, score.toString());
    }
}

// 添加积分榜记录
export function addLeaderboardRecord(score, mode, state) {
    const record = {
        score: score,
        createdAt: Date.now(),
        mode: mode
    };

    state.leaderboard.push(record);

    // 排序：分数降序，同分最近优先
    state.leaderboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.createdAt - a.createdAt;
    });

    // 只保留前N条
    if (state.leaderboard.length > CONFIG.LEADERBOARD_SIZE) {
        state.leaderboard = state.leaderboard.slice(0, CONFIG.LEADERBOARD_SIZE);
    }

    saveLeaderboard(state.leaderboard);
}

// 重置游戏状态（保留最高分和积分榜）
export function resetGameState(state) {
    state.gameStatus = GameStatus.IDLE;
    state.score = 0;
    state.snake = [];
    state.direction = 'right';
    state.nextDirection = 'right';
    state.food = null;
    state.speed = CONFIG.INITIAL_SPEED;
    state.controlOwner = ControlOwner.MANUAL;
    state.manualOverrideUntil = 0;
}

// 检测布局
export function detectMobileLayout() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
}