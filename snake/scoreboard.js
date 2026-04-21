// 积分榜系统
import { CONFIG } from './config.js';

export class Scoreboard {
    constructor() {
        this.leaderboardEl = document.getElementById('leaderboard');
        this.scoreEl = document.getElementById('current-score');
        this.bestScoreEl = document.getElementById('best-score');
    }

    // 更新分数显示
    updateScore(score) {
        if (this.scoreEl) {
            this.scoreEl.textContent = score;
        }
    }

    // 更新最高分显示
    updateBestScore(bestScore) {
        if (this.bestScoreEl) {
            this.bestScoreEl.textContent = bestScore;
        }
    }

    // 渲染积分榜
    renderLeaderboard(leaderboard) {
        if (!this.leaderboardEl) return;

        if (!leaderboard || leaderboard.length === 0) {
            this.leaderboardEl.innerHTML = '<li class="empty">暂无记录</li>';
            return;
        }

        const html = leaderboard.map((record, index) => {
            const date = new Date(record.createdAt);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            const modeLabel = record.mode === 'auto' ? '🤖' : '👤';

            return `
                <li>
                    <span class="rank">#${index + 1}</span>
                    <span class="score">${record.score}</span>
                    <span class="mode">${modeLabel}</span>
                    <span class="date">${dateStr}</span>
                </li>
            `;
        }).join('');

        this.leaderboardEl.innerHTML = html;
    }

    // 高亮新记录
    highlightNewRecord() {
        if (!this.leaderboardEl) return;

        const firstItem = this.leaderboardEl.querySelector('li:first-child');
        if (firstItem) {
            firstItem.classList.add('new-record');
            setTimeout(() => {
                firstItem.classList.remove('new-record');
            }, 2000);
        }
    }
}