/* 贪吃蛇小游戏 - 输入控制 */
const INPUT = {
    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    },

    handleKeydown(e) {
        const key = e.key.toLowerCase();

        // 防止方向键和空格滚动页面
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
            e.preventDefault();
        }

        switch (key) {
            case 'arrowup':
            case 'w':
                RULES.changeDirection({ x: 0, y: -1 });
                break;
            case 'arrowdown':
            case 's':
                RULES.changeDirection({ x: 0, y: 1 });
                break;
            case 'arrowleft':
            case 'a':
                RULES.changeDirection({ x: -1, y: 0 });
                break;
            case 'arrowright':
            case 'd':
                RULES.changeDirection({ x: 1, y: 0 });
                break;
            case ' ':
                // 空格键暂停/继续
                if (STATE.gameStatus === 'running' || STATE.gameStatus === 'paused') {
                    ENGINE.togglePause();
                }
                break;
        }
    }
};