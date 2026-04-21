/* 贪吃蛇小游戏 - 主入口 */
// 按依赖顺序加载各模块
// 1. config.js - 配置 (已通过 script 标签在 html 中先加载)
// 2. state.js - 状态管理
// 3. food.js - 食物生成
// 4. rules.js - 游戏规则
// 5. renderer.js - 渲染器
// 6. input.js - 输入控制
// 7. ui.js - UI 模块
// 8. engine.js - 游戏引擎

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ENGINE.init();
    INPUT.init();

    // 初始显示开始界面
    UI.showStartScreen();
    UI.updateScoreDisplay();
    UI.updateHistoryDisplay();
});

// 导出供外部使用
window.SNAKE_GAME = {
    ENGINE,
    STATE,
    CONFIG,
    RULES,
    RENDERER,
    INPUT,
    UI
};