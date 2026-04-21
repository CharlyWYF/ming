/* 贪吃蛇小游戏 - 配置文件 */
const CONFIG = {
    // 地图配置
    gridSize: 20,        // 单格像素大小
    tileCount: 20,       // 地图格子数量 (20x20)
    canvasSize: 400,     // 画布尺寸

    // 游戏速度
    baseSpeed: 150,      // 基础速度 (ms/帧)
    speedDecrease: 5,    // 每次加速减少的毫秒数
    speedThreshold: 50,  // 每吃多少食物加速一次

    // 分数
    scorePerFood: 10,    // 每个食物得分

    // 颜色主题 - 可爱治愈风格
    colors: {
        // 背景
        bgGradientStart: '#f0f4e8',    // 米白浅绿
        bgGradientEnd: '#e8f0e4',
        canvasBg: '#d4e4c8',           // 草地绿

        // 蛇
        snakeHead: '#7cb342',          // 草绿
        snakeHeadDark: '#558b2f',
        snakeBody: '#8bc34a',          // 薄荷绿
        snakeBodyDark: '#689f38',
        snakeEye: '#fff',
        snakeTongue: '#e91e63',

        // 食物 - 使用水果风格
        foodColors: [
            '#ff6b6b',  // 草莓红
            '#ffa502',  // 橘子橙
            '#ffdd59',  // 柠檬黄
            '#ff85a2',  // 樱花粉
            '#a55eea',  // 葡萄紫
        ],

        // UI
        primary: '#7cb342',            // 主题绿
        primaryDark: '#558b2f',
        secondary: '#ffa502',          // 橙色
        text: '#5d4037',               // 棕色文字
        textLight: '#8d6e63',
        border: '#c5e1a5',
        panelBg: 'rgba(255, 255, 255, 0.9)',
    }
};