<template>
  <view class="page-container">
    <!-- 添加标题区域 -->
    <view class="game-header">
      <text class="title neon-text">左轮游戏</text>
      <text class="subtitle glow-text">生死一线 命运一转</text>
    </view>
    
    <view class="game-container">
      <!-- 左轮手枪区域 -->
      <view class="revolver-container glow-effect">
        <image class="revolver" :src="revolverImage" :class="{ 'firing': isFiring }" />
      </view>
      
      <!-- 结果显示 -->
      <view class="result neon-text" :class="{ 'danger': isDanger }">
        {{ resultText }}
      </view>
      
      <!-- 按钮区域 -->
      <view class="button-container">
        <view class="neon-button info" @tap="showBulletSelector">
          {{ bulletCount }}颗子弹
        </view>
        <view class="neon-button" @tap="spinCylinder" :class="{ 'disabled': isSpinning || isFiring }">
          旋转弹仓
        </view>
        <view class="neon-button danger" @tap="pullTrigger" :class="{ 'disabled': isSpinning || isFiring }">
          扣动扳机
        </view>
      </view>
    </view>

    <!-- 在 game-container 中添加 -->
    <view class="modal" v-if="showBulletOptions">
      <view class="modal-content">
        <text class="modal-title neon-text">选择子弹数量</text>
        <view class="modal-options-container">
          <view class="options-row">
            <view 
              v-for="n in 3" 
              :key="n" 
              class="modal-option"
              :class="{ 'active': bulletCount === n }"
              @tap="selectBulletCount(n)"
            >
              {{ n }}
            </view>
          </view>
          <view class="options-row">
            <view 
              v-for="n in 3" 
              :key="n + 3" 
              class="modal-option"
              :class="{ 'active': bulletCount === (n + 3) }"
              @tap="selectBulletCount(n + 3)"
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
      revolverImage: '/static/images/revolver-body.png',
      resultText: '准备开始游戏',
      chambers: Array(6).fill().map(() => ({ loaded: false })),
      currentChamber: 0,
      isSpinning: false,
      isFiring: false,
      isDanger: false,
      showBulletOptions: false,
      bulletCount: 1  // 默认1颗子弹
    }
  },
  
  mounted() {
    this.initGame()
  },
  
  methods: {
    initGame() {
      // 先清空所有弹仓
      this.chambers = Array(6).fill().map(() => ({ loaded: false }))
      
      // 随机装填指定数量的子弹
      let remainingBullets = this.bulletCount
      let availablePositions = [0, 1, 2, 3, 4, 5]
      
      while (remainingBullets > 0) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length)
        const position = availablePositions[randomIndex]
        this.chambers[position].loaded = true
        availablePositions.splice(randomIndex, 1)
        remainingBullets--
      }
      
      this.currentChamber = Math.floor(Math.random() * 6)
      this.resultText = '准备开始游戏'
      this.isDanger = false
    },
    
    async spinCylinder() {
      if (this.isSpinning || this.isFiring) return
      
      this.isSpinning = true
      this.resultText = '弹仓旋转中...'
      this.isDanger = false
      
      // 播放旋转音效
    //   await this.playSound('spin.mp3')
      
      // 震动反馈
      uni.vibrateShort()
      
      // 随机旋转时间：1-2秒
      const duration = 1000 + Math.random() * 1000
      
      setTimeout(() => {
        this.currentChamber = Math.floor(Math.random() * 6)
        this.isSpinning = false
        this.resultText = '弹仓已就绪'
        
        // 再次震动提示准备完成
        uni.vibrateShort()
      }, duration)
    },
    
    async pullTrigger() {
      if (this.isSpinning || this.isFiring) return
      
      this.isFiring = true
      
      // 检查当前弹仓是否有子弹
      const hasBullet = this.chambers[this.currentChamber].loaded
      
      if (hasBullet) {
        // 中弹效果
        // await this.playSound('gunshot.mp3')
        uni.vibrateLong()
        this.resultText = '💥 中弹！喝一杯！'
        this.isDanger = true
        
        // 消耗掉当前弹仓的子弹
        this.chambers[this.currentChamber].loaded = false
        // 更新剩余子弹数量
        this.bulletCount = this.chambers.filter(chamber => chamber.loaded).length
        
        // 如果没有子弹了，提示重新开始
        if (this.bulletCount === 0) {
          setTimeout(() => {
            this.resultText = '弹仓已空，请重新装填'
          }, 1500)
        }
      } else {
        // 空枪效果
        // await this.playSound('empty-click.mp3')
        uni.vibrateShort()
        this.resultText = '✅ 空枪！暂时安全～'
        this.isDanger = false
      }
      
      // 移动到下一个弹仓
      this.currentChamber = (this.currentChamber + 1) % 6
      
      setTimeout(() => {
        this.isFiring = false
      }, 500)
    },
    
    playSound(soundFile) {
      return new Promise((resolve) => {
        const innerAudioContext = uni.createInnerAudioContext()
        innerAudioContext.src = `/static/sounds/${soundFile}`
        innerAudioContext.onEnded(() => {
          innerAudioContext.destroy()
          resolve()
        })
        innerAudioContext.play()
      })
    },

    showBulletSelector() {
      if (!this.isSpinning && !this.isFiring) {
        this.showBulletOptions = true
      }
    },

    selectBulletCount(count) {
      this.bulletCount = count
      this.showBulletOptions = false
      this.initGame()  // 重新初始化游戏
    }
  }
}
</script>

<style>
/* 复用骰子游戏的基础样式 */
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

/* 左轮手枪容器样式 */
.revolver-container {
  width: 600rpx;
  height: 600rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.revolver {
  width: 400rpx;
  height: 400rpx;
  transition: transform 0.1s ease;
}

.revolver.firing {
  transform: rotate(-15deg) translateX(-20rpx);
}

/* 弹仓显示样式 */
.cylinder-display {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 40rpx;
}

.chamber {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2px solid #00f7ff;
  background: rgba(0, 247, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
  transition: all 0.3s ease;
}

.chamber.current {
  border-color: #ff00de;
  box-shadow: 0 0 15px #ff00de;
}

.chamber.loaded {
  background: rgba(255, 0, 0, 0.3);
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

.neon-button.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.neon-button:active {
  transform: scale(0.95);
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

.modal-option.active {
  border-color: #ff00de;
  color: #ff00de;
  box-shadow: 0 0 20px #ff00de;
}

/* 信息按钮样式 */
.neon-button.info {
  border-color: #00f7ff;
  color: #00f7ff;
  box-shadow: 0 0 10px #00f7ff,
              inset 0 0 10px #00f7ff;
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
</style>
  