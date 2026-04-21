/* 贪吃蛇小游戏 - 渲染器 */
const RENDERER = {
    canvas: null,
    ctx: null,

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    },

    // 清空画布
    clear() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    // 绘制背景
    drawBackground() {
        const { ctx, canvas } = this;
        const { colors, gridSize, tileCount } = CONFIG;

        // 绘制草地背景
        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制浅色网格
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= tileCount; i++) {
            // 竖线
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();

            // 横线
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    },

    // 绘制蛇
    drawSnake() {
        const { ctx } = this;
        const { snake } = STATE;
        const { gridSize, colors } = CONFIG;

        snake.forEach((part, index) => {
            const x = part.x * gridSize;
            const y = part.y * gridSize;
            const isHead = index === 0;

            // 创建径向渐变
            const gradient = ctx.createRadialGradient(
                x + gridSize / 2,
                y + gridSize / 2,
                0,
                x + gridSize / 2,
                y + gridSize / 2,
                gridSize / 2
            );

            if (isHead) {
                // 蛇头颜色
                gradient.addColorStop(0, colors.snakeHead);
                gradient.addColorStop(1, colors.snakeHeadDark);
            } else {
                // 蛇身颜色 - 渐变效果
                const bodyGradient = 1 - (index / snake.length) * 0.3;
                gradient.addColorStop(0, colors.snakeBody);
                gradient.addColorStop(bodyGradient, colors.snakeBodyDark);
            }

            ctx.fillStyle = gradient;

            // 绘制圆角矩形
            const padding = 1;
            this.roundRect(
                x + padding,
                y + padding,
                gridSize - padding * 2,
                gridSize - padding * 2,
                6
            );
            ctx.fill();

            // 绘制蛇头眼睛
            if (isHead) {
                this.drawEyes(x, y);
            }
        });
    },

    // 绘制眼睛
    drawEyes(headX, headY) {
        const { ctx } = this;
        const { gridSize, colors } = CONFIG;
        const { direction } = STATE;

        ctx.fillStyle = colors.snakeEye;
        const eyeSize = 3;
        const eyeOffset = 5;

        let eye1X, eye1Y, eye2X, eye2Y;

        if (direction.x === 1) { // 向右
            eye1X = headX + gridSize - eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + gridSize - eyeOffset;
            eye2Y = headY + gridSize - eyeOffset;
        } else if (direction.x === -1) { // 向左
            eye1X = headX + eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + eyeOffset;
            eye2Y = headY + gridSize - eyeOffset;
        } else if (direction.y === -1) { // 向上
            eye1X = headX + eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + gridSize - eyeOffset;
            eye2Y = headY + eyeOffset;
        } else { // 向下
            eye1X = headX + eyeOffset;
            eye1Y = headY + gridSize - eyeOffset;
            eye2X = headX + gridSize - eyeOffset;
            eye2Y = headY + gridSize - eyeOffset;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
    },

    // 绘制食物
    drawFood() {
        const { ctx } = this;
        const { food } = STATE;
        const { gridSize, colors } = CONFIG;

        const x = food.x * gridSize + gridSize / 2;
        const y = food.y * gridSize + gridSize / 2;
        const radius = gridSize / 2 - 2;

        // 食物颜色
        const foodColor = colors.foodColors[food.colorIndex % colors.foodColors.length];

        // 创建渐变
        const gradient = ctx.createRadialGradient(
            x - radius / 3,
            y - radius / 3,
            0,
            x,
            y,
            radius
        );
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.3, foodColor);
        gradient.addColorStop(1, this.darkenColor(foodColor, 0.3));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 高光效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(x - radius / 3, y - radius / 3, radius / 4, 0, Math.PI * 2);
        ctx.fill();
    },

    // 绘制高光效果
    drawHighlight() {
        const { ctx, canvas } = this;

        // 左上角高光
        const gradient = ctx.createLinearGradient(0, 0, canvas.width / 3, canvas.height / 3);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    },

    // 颜色变暗
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    },

    // 圆角矩形辅助函数
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    },

    // 完整渲染
    render() {
        this.clear();
        this.drawBackground();
        this.drawFood();
        this.drawSnake();
        this.drawHighlight();
    }
};