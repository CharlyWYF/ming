import streamlit as st
import random

# --- 1. 游戏核心逻辑与设置 ---

# 定义花色和点数
SUITS = ['♠️', '♥️', '♣️', '♦️']
RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

def create_deck():
    """创建一个一副牌的全新洗好的牌堆"""
    deck = []
    for suit in SUITS:
        for rank in RANKS:
            deck.append((suit, rank))
    random.shuffle(deck)
    return deck

def calculate_score(hand):
    """计算手牌点数 (Blackjack 规则)"""
    score = 0
    aces = 0
    
    for card in hand:
        rank = card[1]
        if rank in ['J', 'Q', 'K']:
            score += 10
        elif rank == 'A':
            aces += 1
            score += 11
        else:
            score += int(rank)
            
    # 处理A的情况 (如果总分超过21，A算作1)
    while score > 21 and aces:
        score -= 10
        aces -= 1
        
    return score

# --- 2. Streamlit 页面配置 ---

st.set_page_config(page_title="Streamlit 21点", page_icon="🃏")

st.title("🃏 简单的 21点 (Blackjack) 游戏")
st.markdown("目标：点数尽可能接近 **21点**，但不能超过。打败庄家！")
st.markdown("---")

# --- 3. 状态管理 (Session State) ---

# 初始化游戏状态
if 'deck' not in st.session_state:
    st.session_state.deck = create_deck()
if 'player_hand' not in st.session_state:
    st.session_state.player_hand = []
if 'dealer_hand' not in st.session_state:
    st.session_state.dealer_hand = []
if 'game_over' not in st.session_state:
    st.session_state.game_over = False
if 'message' not in st.session_state:
    st.session_state.message = ""

def start_new_game():
    """重置游戏"""
    st.session_state.deck = create_deck()
    st.session_state.player_hand = [st.session_state.deck.pop(), st.session_state.deck.pop()]
    st.session_state.dealer_hand = [st.session_state.deck.pop(), st.session_state.deck.pop()]
    st.session_state.game_over = False
    st.session_state.message = ""

# 如果手牌为空（第一次运行），自动开始新游戏
if not st.session_state.player_hand:
    start_new_game()

# --- 4. 按钮回调函数 ---

def hit():
    """玩家要牌"""
    st.session_state.player_hand.append(st.session_state.deck.pop())
    score = calculate_score(st.session_state.player_hand)
    if score > 21:
        st.session_state.message = "💥 你爆牌了！庄家获胜。"
        st.session_state.game_over = True

def stand():
    """玩家停牌 (结算轮)"""
    player_score = calculate_score(st.session_state.player_hand)
    
    # 庄家逻辑：只要小于17点就必须要牌
    while calculate_score(st.session_state.dealer_hand) < 17:
        st.session_state.dealer_hand.append(st.session_state.deck.pop())
        
    dealer_score = calculate_score(st.session_state.dealer_hand)
    
    # 胜负判定
    if dealer_score > 21:
        st.session_state.message = "🎉 庄家爆牌！你赢了！"
    elif dealer_score > player_score:
        st.session_state.message = "💻 庄家点数更高，庄家赢了。"
    elif dealer_score < player_score:
        st.session_state.message = "🏆 你的点数更高，你赢了！"
    else:
        st.session_state.message = "🤝 平局 (Push)。"
        
    st.session_state.game_over = True

# --- 5. UI 界面渲染 ---

# 辅助函数：美化卡牌显示
def display_hand(hand, hide_first=False):
    cards_html = ""
    for i, card in enumerate(hand):
        if hide_first and i == 0:
            cards_html += '<div style="display:inline-block; border:1px solid #ccc; border-radius:5px; padding:10px; margin:5px; background-color:#eee; width:60px; text-align:center;">❓</div>'
        else:
            color = "red" if card[0] in ['♥️', '♦️'] else "black"
            cards_html += f'<div style="display:inline-block; border:1px solid #ccc; border-radius:5px; padding:10px; margin:5px; background-color:white; color:{color}; width:60px; text-align:center;">{card[0]}<br>{card[1]}</div>'
    return cards_html

col1, col2 = st.columns(2)

with col1:
    st.subheader("💻 庄家的牌")
    # 如果游戏没结束，隐藏庄家第一张牌
    dealer_html = display_hand(st.session_state.dealer_hand, hide_first=not st.session_state.game_over)
    st.markdown(dealer_html, unsafe_allow_html=True)
    
    if st.session_state.game_over:
        st.metric("庄家点数", calculate_score(st.session_state.dealer_hand))
    else:
        st.text("庄家点数: ?")

with col2:
    st.subheader("👤 你的牌")
    player_html = display_hand(st.session_state.player_hand)
    st.markdown(player_html, unsafe_allow_html=True)
    st.metric("你的点数", calculate_score(st.session_state.player_hand))

st.markdown("---")

# --- 6. 游戏控制区 ---

if st.session_state.game_over:
    if st.session_state.message:
        if "赢" in st.session_state.message:
            st.success(st.session_state.message)
        elif "平" in st.session_state.message:
            st.warning(st.session_state.message)
        else:
            st.error(st.session_state.message)
    
    st.button("🔄 开始新一局", on_click=start_new_game, type="primary")

else:
    # 游戏进行中
    col_act1, col_act2 = st.columns(2)
    with col_act1:
        st.button("👊 要牌 (Hit)", on_click=hit, use_container_width=True)
    with col_act2:
        st.button("✋ 停牌 (Stand)", on_click=stand, use_container_width=True)