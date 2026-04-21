// 渲染器 - Canvas 绘制
import { CONFIG } from './config.js';
import { GameStatus, ControlMode, ControlOwner } from './state.js';

export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // 设置 Canvas 尺寸
        this.canvas.width = CONFIG.GRID_SIZE * CONFIG.GRID_COUNT_X;
        this.canvas.height = CONFIG.GRID_SIZE * CONFIG.GRID_COUNT_Y;

        // 颜色配置
        this.colors = {
            background: '#f5f5dc',      // 奶油白
            grid: '#e8e8d0',            // 浅网格线
            snakeHead: '#2e8b57',       // 蛇头 - 深青绿
            snakeBody: '#3cb371',       // 蛇身 - 中海绿
            snakeBodyAlt: '#32cd32',    // 蛇身交替 - 酸橙绿
            food: '#ff6b6b',            // 食物 - 珊瑚红
            wall: '#8b4513'             // 墙壁 - 深棕色
        };
    }

    // 清空画布
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格线（可选）
        this.drawGrid();
    }

    // 绘制网格
    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x <= CONFIG.GRID_COUNT_X; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CONFIG.GRID_SIZE, 0);
            this.ctx.lineTo(x * CONFIG.GRID_SIZE, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= CONFIG.GRID_COUNT_Y; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CONFIG.GRID_SIZE);
            this.ctx.lineTo(this.canvas.width, y * CONFIG.GRID_SIZE);
            this.ctx.stroke();
        }
    }

    // 绘制蛇
    drawSnake(snake) {
        if (!snake || snake.length === 0) return;

        snake.forEach((segment, index) => {
            const x = segment.x * CONFIG.GRID_SIZE;
            const y = segment.y * CONFIG.GRID_SIZE;
            const size = CONFIG.GRID_SIZE - 2;

            // 蛇头和蛇身用不同颜色
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
            } else {
                // 交替颜色增加层次感
                this.ctx.fillStyle = index % 2 === 0 ? this.colors.snakeBody : this.colors.snakeBodyAlt;
            }

            // 绘制圆角矩形
            this.roundRect(x + 1, y + 1, size, size, 4);
            this.ctx.fill();
        });
    }

    // 绘制食物
    drawFood(food) {
        if (!food) return;

        const x = food.x * CONFIG.GRID_SIZE;
        const y = food.y * CONFIG.GRID_SIZE;
        const size = CONFIG.GRID_SIZE - 4;
        const centerX = x + CONFIG.GRID_SIZE / 2;
        const centerY = y + CONFIG.GRID_SIZE / 2;

        // 绘制圆形食物
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.food;
        this.ctx.fill();

        // 添加高光效果
        this.ctx.beginPath();
        this.ctx.arc(centerX - 2, centerY - 2, size / 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.fill();
    }

    // 绘制整个游戏画面
    render(state) {
        this.clear();
        this.drawFood(state.food);
        this.drawSnake(state.snake);
    }

    // 辅助方法：绘制圆角矩形
    roundRect(x, y, w, h, r) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
    }
}