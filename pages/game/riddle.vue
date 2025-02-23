<template>
  <view class="container">
    <view class="dealer-status" v-if="isDealer">
      <text class="dealer-badge">庄家</text>
      <text class="dealer-hint">正确答案: {{ currentRiddle.answer }}</text>
    </view>
    
    <view class="riddle-card">
      <text class="riddle-title">猜谜语</text>
      <view class="riddle-content">
        <text class="riddle-text">{{ currentRiddle.question }}</text>
      </view>
      <view class="timer" v-if="timeLeft > 0">
        剩余时间: {{ Math.floor(timeLeft / 60) }}分{{ timeLeft % 60 }}秒
      </view>
      <text class="answer-text" v-if="isAnswerVisible">答案: {{ currentRiddle.answer }}</text>
    </view>
    
    <view class="button-group">
      <button class="action-btn show-answer" @click="showAnswer" v-if="!isAnswerVisible">查看答案</button>
      <button class="action-btn next-riddle" @click="nextRiddle">换一题</button>
    </view>
    
    <!-- 新增游戏规则卡片 -->
    <view class="rules-card">
      <text class="rules-title">游戏规则</text>
      <view class="rules-content">
        <text class="rules-text">1. 每轮游戏时间为3分钟</text>
        <text class="rules-text">2. 庄家出题，其他玩家猜谜底</text>
        <text class="rules-text">3. 如果有玩家猜中：</text>
        <text class="rules-text rules-indent">- 猜中的玩家不用喝</text>
        <text class="rules-text rules-indent">- 其他所有玩家（包括庄家）都要喝</text>
        <text class="rules-text rules-indent">- 猜中的玩家成为新庄家</text>
        <text class="rules-text">4. 如果时间到没人猜中：</text>
        <text class="rules-text rules-indent">- 庄家不用喝</text>
        <text class="rules-text rules-indent">- 其他所有玩家都要喝</text>
        <text class="rules-text rules-indent">- 庄家继续坐庄</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isDealer: false,
      riddles: [
        {
          question: "说它是个宝，用它少不了，可是它偏偏一文不值。是什么？",
          answer: "零"
        },
        {
          question: "什么东西越热越爱出来，越冷越躲起来？",
          answer: "汗"
        },
        {
          question: "什么门永远关不上？",
          answer: "问门"
        },
        // 可以添加更多谜语
      ],
      currentRiddle: {},
      timeLeft: 180,
      timer: null,
      showResult: false,
      isAnswerVisible: false
    }
  },
  
  onLoad(options) {
    this.isDealer = options.dealer === 'true'
    this.initGame()
  },
  
  methods: {
    initGame() {
      this.showResult = false
      this.isAnswerVisible = false
      this.currentRiddle = this.riddles[Math.floor(Math.random() * this.riddles.length)]
      this.timeLeft = 180
      this.startTimer()
    },

    startTimer() {
      this.clearTimer()
      this.timer = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.timeUp()
        }
      }, 1000)
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    timeUp() {
      this.clearTimer()
      this.showResult = true
    },

    nextRiddle() {
      this.initGame()
    },

    showAnswer() {
      this.isAnswerVisible = true
    }
  },
  
  onUnload() {
    this.clearTimer()
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  padding: 30rpx;
  background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
}

.dealer-status {
  background: rgba(26, 11, 46, 0.95);
  border-radius: 16px;
  padding: 40rpx;
  margin-top: 60rpx;
  box-shadow: 0 0 20px #ff00de;
  border: 2px solid #ff00de;
  text-align: center;
}

.dealer-badge {
  font-size: 40rpx;
  color: #fff;
  text-align: center;
  margin-bottom: 40rpx;
  text-shadow: 0 0 10px #00f7ff;
}

.dealer-hint {
  font-size: 32rpx;
  color: #00f7ff;
  text-align: center;
}

.riddle-card {
  background: rgba(26, 11, 46, 0.95);
  border-radius: 16px;
  padding: 40rpx;
  margin-top: 60rpx;
  box-shadow: 0 0 20px #ff00de;
  border: 2px solid #ff00de;
}

.riddle-title {
  font-size: 40rpx;
  color: #fff;
  text-align: center;
  margin-bottom: 40rpx;
  text-shadow: 0 0 10px #00f7ff;
}

.riddle-content {
  padding: 40rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  background: rgba(0, 0, 0, 0.3);
}

.riddle-text {
  color: #fff;
  font-size: 32rpx;
  line-height: 1.6;
  text-align: center;
}

.timer {
  text-align: center;
  color: #fff;
  margin-top: 20rpx;
  font-size: 28rpx;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  background: rgba(26, 11, 46, 0.95);
  padding: 40rpx;
  border-radius: 16rpx;
  width: 80%;
  text-align: center;
  border: 2px solid #ff00de;
  box-shadow: 0 0 20px #ff00de;
}

.result-title {
  font-size: 36rpx;
  color: #fff;
  margin-bottom: 20rpx;
  display: block;
}

.result-answer {
  font-size: 32rpx;
  color: #00f7ff;
  margin-bottom: 40rpx;
  display: block;
}

.next-btn {
  background: linear-gradient(45deg, #ff00de, #00f7ff);
  color: #fff;
  border: none;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.button-group {
  margin-top: 40rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  max-width: 300rpx;
  background: linear-gradient(45deg, #ff00de, #00f7ff);
  color: #fff;
  border: none;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.answer-text {
  color: #00f7ff;
  font-size: 32rpx;
  text-align: center;
  margin: 20rpx 0;
}

.rules-card {
  background: rgba(26, 11, 46, 0.95);
  border-radius: 16px;
  padding: 40rpx;
  margin-top: 60rpx;
  box-shadow: 0 0 20px #ff00de;
  border: 2px solid #ff00de;
}

.rules-title {
  font-size: 40rpx;
  color: #fff;
  text-align: center;
  margin-bottom: 40rpx;
  text-shadow: 0 0 10px #00f7ff;
}

.rules-content {
  padding: 40rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  background: rgba(0, 0, 0, 0.3);
}

.rules-text {
  color: #fff;
  font-size: 28rpx;
  line-height: 1.8;
  display: block;
}

.rules-indent {
  padding-left: 40rpx;
  color: #00f7ff;
}
</style> 