<template>
    <view class="page-container">
      <!-- 标题区域 -->
      <view class="game-header">
        <text class="title neon-text">炸弹游戏</text>
        <text class="subtitle glow-text">九宫格 生死局</text>
      </view>
      
      <view class="game-container">
        <!-- 游戏状态显示 -->
        <view class="result neon-text" :class="{ 'danger': isDanger }">
          {{ resultText }}
        </view>
        
        <!-- 九宫格区域 -->
        <view class="grid-container glow-effect">
          <view 
            v-for="(cell, index) in grid" 
            :key="index"
            class="grid-cell"
            :class="{
              'revealed': cell.isRevealed,
              'bomb': cell.isRevealed && cell.hasBomb,
              'safe': cell.isRevealed && !cell.hasBomb
            }"
            @tap="revealCell(index)"
          >
            <text v-if="cell.isRevealed" class="cell-content">
              {{ cell.hasBomb ? '💣' : '✨' }}
            </text>
          </view>
        </view>
        
        <!-- 按钮区域 -->
        <view class="button-container">
          <view class="neon-button info" @tap="showBombSelector">
            {{ bombCount }}颗炸弹
          </view>
          <view class="neon-button danger" @tap="resetGame">
            重新开始
          </view>
        </view>
      </view>
  
      <!-- 炸弹数量选择弹窗 -->
      <view class="modal" v-if="showBombOptions">
        <view class="modal-content">
          <text class="modal-title neon-text">选择炸弹数量</text>
          <view class="modal-options-container">
            <view class="options-row">
              <view 
                v-for="n in 3" 
                :key="n" 
                class="modal-option"
                :class="{ 'active': bombCount === n }"
                @tap="selectBombCount(n)"
              >
                {{ n }}
              </view>
            </view>
            <view class="options-row">
              <view 
                v-for="n in 3" 
                :key="n + 3" 
                class="modal-option"
                :class="{ 'active': bombCount === (n + 3) }"
                @tap="selectBombCount(n + 3)"
              >
                {{ n + 3 }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        grid: Array(9).fill().map(() => ({
          hasBomb: false,
          isRevealed: false
        })),
        bombCount: 2,
        showBombOptions: false,
        resultText: '准备开始游戏',
        isDanger: false,
        isGameOver: false
      }
    },
    
    mounted() {
      this.initGame()
    },
    
    methods: {
      initGame() {
        // 重置九宫格
        this.grid = Array(9).fill().map(() => ({
          hasBomb: false,
          isRevealed: false
        }))
        
        // 随机放置炸弹
        let remainingBombs = this.bombCount
        let availablePositions = Array.from({length: 9}, (_, i) => i)
        
        while (remainingBombs > 0) {
          const randomIndex = Math.floor(Math.random() * availablePositions.length)
          const position = availablePositions[randomIndex]
          this.grid[position].hasBomb = true
          availablePositions.splice(randomIndex, 1)
          remainingBombs--
        }
        
        this.resultText = '准备开始游戏'
        this.isDanger = false
        this.isGameOver = false
      },
      
      async revealCell(index) {
        if (this.isGameOver || this.grid[index].isRevealed) return
        
        this.grid[index].isRevealed = true
        
        if (this.grid[index].hasBomb) {
          // 炸弹爆炸效果
          uni.vibrateLong()
          this.resultText = '💥 爆炸！喝一杯！'
          this.isDanger = true
          this.isGameOver = true
          
          // 显示所有炸弹
          this.revealAllBombs()
        } else {
          // 安全格子效果
          uni.vibrateShort()
          
          // 检查是否获胜
          const unrevealedSafeCells = this.grid.filter(
            cell => !cell.isRevealed && !cell.hasBomb
          ).length
          
          if (unrevealedSafeCells === 0) {
            this.resultText = '🎉 恭喜获胜！'
            this.isGameOver = true
          } else {
            this.resultText = '✅ 安全！继续～'
          }
        }
      },
      
      revealAllBombs() {
        this.grid.forEach(cell => {
          if (cell.hasBomb) {
            cell.isRevealed = true
          }
        })
      },
      
      showBombSelector() {
        if (!this.isGameOver) {
          this.showBombOptions = true
        }
      },
      
      selectBombCount(count) {
        if (count >= 1 && count <= 6) {
          this.bombCount = count
          this.showBombOptions = false
          this.initGame()
        }
      },
      
      resetGame() {
        this.initGame()
      }
    }
  }
  </script>
  
  <style>
  /* 复用左轮游戏的基础样式 */
  .page-container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
    position: relative;
    overflow: hidden;
  }
  
  .page-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, #0D0D2B 70%);
    animation: pulse 4s ease-in-out infinite;
    z-index: 0;
  }
  
  .game-header {
    text-align: center;
    padding-top: 80rpx;
    margin-bottom: 40rpx;
    position: relative;
    z-index: 1;
  }
  
  .title {
    font-size: 48rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
  }
  
  .neon-text {
    color: #fff;
    text-shadow: 0 0 5px #fff,
                 0 0 10px #fff,
                 0 0 20px #ff00de,
                 0 0 30px #ff00de,
                 0 0 40px #ff00de;
    animation: neon 1.5s ease-in-out infinite alternate;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #00f7ff;
    margin-top: 10rpx;
  }
  
  .game-container {
    width: 100%;
    height: calc(100vh - 200rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  /* 九宫格样式 */
  .grid-container {
    width: 600rpx;
    height: 600rpx;
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding: 20rpx;
    margin-bottom: 40rpx;
    background: rgba(26, 26, 58, 0.95);
    border-radius: 20rpx;
    border: 2px solid #ff00de;
    box-shadow: 0 0 30px rgba(255, 0, 222, 0.3),
                inset 0 0 20px rgba(255, 0, 222, 0.2);
  }
  
  .grid-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 247, 255, 0.1);
    border: 2px solid #00f7ff;
    border-radius: 10rpx;
    box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
    transition: all 0.3s ease;
    font-size: 60rpx;
  }
  
  .grid-cell.revealed {
    transform: rotateY(180deg);
  }
  
  .grid-cell.bomb {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.2);
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  }
  
  .grid-cell.safe {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  }
  
  .cell-content {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  /* 结果显示样式 */
  .result {
    font-size: 36rpx;
    margin: 40rpx 0;
    text-align: center;
    min-height: 50rpx;
  }
  
  .result.danger {
    color: #ff0000;
    text-shadow: 0 0 5px #ff0000,
                 0 0 10px #ff0000,
                 0 0 20px #ff0000;
  }
  
  /* 按钮样式 */
  .button-container {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-top: 40rpx;
  }
  
  .neon-button {
    background: transparent;
    border: 2px solid #00f7ff;
    color: #00f7ff;
    padding: 20rpx 60rpx;
    font-size: 32rpx;
    border-radius: 50rpx;
    text-transform: uppercase;
    font-weight: bold;
    box-shadow: 0 0 10px #00f7ff,
                inset 0 0 10px #00f7ff;
    transition: all 0.3s ease;
  }
  
  .neon-button.danger {
    border-color: #ff00de;
    color: #ff00de;
    box-shadow: 0 0 10px #ff00de,
                inset 0 0 10px #ff00de;
  }
  
  .neon-button.info {
    border-color: #00f7ff;
    color: #00f7ff;
    box-shadow: 0 0 10px #00f7ff,
                inset 0 0 10px #00f7ff;
  }
  
  .neon-button.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .neon-button:active {
    transform: scale(0.95);
  }
  
  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(13, 13, 43, 0.95);
    backdrop-filter: blur(10px);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: modalFadeIn 0.3s ease;
  }
  
  .modal-content {
    background: rgba(26, 26, 58, 0.95);
    border-radius: 30rpx;
    padding: 60rpx 40rpx;
    width: 85%;
    max-width: 600rpx;
    border: 2px solid #ff00de;
    box-shadow: 0 0 30px rgba(255, 0, 222, 0.3),
                inset 0 0 20px rgba(255, 0, 222, 0.2);
  }
  
  .modal-title {
    text-align: center;
    margin-bottom: 50rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 5px #fff,
                 0 0 10px #fff,
                 0 0 20px #ff00de,
                 0 0 30px #ff00de;
  }
  
  .modal-options-container {
    display: flex;
    flex-direction: column;
    gap: 40rpx;
  }
  
  .options-row {
    display: flex;
    justify-content: center;
    gap: 60rpx;
  }
  
  .modal-option {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #00f7ff;
    border-radius: 50%;
    color: #00f7ff;
    font-size: 36rpx;
    font-weight: bold;
    background: rgba(0, 247, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 247, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .modal-option:active {
    transform: scale(0.95);
  }
  
  .modal-option.active {
    border-color: #ff00de;
    color: #ff00de;
    box-shadow: 0 0 20px #ff00de;
  }
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }
  
  @keyframes neon {
    from {
      text-shadow: 0 0 5px #fff,
                   0 0 10px #fff,
                   0 0 20px #ff00de,
                   0 0 30px #ff00de;
    }
    to {
      text-shadow: 0 0 5px #fff,
                   0 0 10px #fff,
                   0 0 20px #ff00de,
                   0 0 30px #ff00de,
                   0 0 40px #ff00de;
    }
  }
  </style>