/* 贪吃蛇小游戏 - 食物模块 */
function spawnFood() {
    const { tileCount } = CONFIG;
    const { snake } = STATE;

    let newFood;
    let isValidPosition = false;

    // 寻找合法位置
    while (!isValidPosition) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            colorIndex: Math.floor(Math.random() * CONFIG.colors.foodColors.length)
        };

        // 检查是否与蛇身重叠
        isValidPosition = true;
        for (const part of snake) {
            if (part.x === newFood.x && part.y === newFood.y) {
                isValidPosition = false;
                break;
            }
        }
    }

    STATE.food = newFood;
}

// 生成食物的别名
function generateFood() {
    spawnFood();
}