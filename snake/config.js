// 游戏配置
export const CONFIG = {
    // 网格设置
    GRID_SIZE: 20,           // 格子大小（像素）
    GRID_COUNT_X: 20,        // 横向格子数
    GRID_COUNT_Y: 15,        // 纵向格子数

    // 游戏速度（毫秒/帧）
    INITIAL_SPEED: 150,
    MIN_SPEED: 50,
    SPEED_DECREASE: 5,       // 每次吃完食物速度减少

    // 食物得分
    FOOD_SCORE: 10,

    // 自动接管设置
    MANUAL_OVERRIDE_DURATION: 1000,  // 手动接管窗口时长（毫秒）

    // 存储键名
    STORAGE_KEYS: {
        BEST_SCORE: 'snake_best_score',
        LEADERBOARD: 'snake_leaderboard'
    },

    // 积分榜显示数量
    LEADERBOARD_SIZE: 10
};