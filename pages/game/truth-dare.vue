<template>
  <view class="content">
    <view class="game-container">
      <!-- 转盘容器 -->
      <view class="bottle-container">
        <image 
          class="bottle-image" 
          src="/static/images/bottle.png"
          :style="{ transform: `rotate(${rotation}deg)` }"
          @tap="spinBottle"
        ></image>
      </view>
    </view>

    <!-- 选择弹窗 -->
    <view class="choice-modal" v-if="showChoiceModal">
      <view class="modal-content neon-box">
        <view class="tabs">
          <view 
            class="tab" 
            :class="{ active: activeTab === 'truth' }"
            @tap="activeTab = 'truth'"
          >真心话</view>
          <view 
            class="tab" 
            :class="{ active: activeTab === 'dare' }"
            @tap="activeTab = 'dare'"
          >大冒险</view>
        </view>
        <view class="content-area">
          <text class="question">{{ currentQuestion }}</text>
          <view class="refresh-btn" @tap="refreshQuestion">换一批</view>
        </view>
        <view class="action-btn" @tap="confirmChoice">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      rotation: 0,
      isSpinning: false,
      showChoiceModal: false,
      activeTab: 'truth',
      currentQuestion: '',
      truthQuestions: [
        '你的初恋是几岁？',
        '你最难忘的一次旅行是哪次？',
        '你最喜欢的一道菜是什么？',
        // 添加更多真心话问题...
      ],
      dareQuestions: [
        '模仿一种动物叫声',
        '做10个俯卧撑',
        '唱一首歌的副歌部分',
        // 添加更多大冒险内容...
      ]
    }
  },
  methods: {
    spinBottle() {
      if (this.isSpinning) return;
      
      this.isSpinning = true;
      const randomRotation = 1800 + Math.random() * 1800; // 5-10圈
      const duration = 3000; // 3秒
      
      this.rotation = 0;
      setTimeout(() => {
        this.rotation = randomRotation;
      }, 50);

      setTimeout(() => {
        this.isSpinning = false;
        this.showChoiceModal = true;
      }, duration);
    },
    
    refreshQuestion() {
      const questions = this.activeTab === 'truth' ? this.truthQuestions : this.dareQuestions;
      const randomIndex = Math.floor(Math.random() * questions.length);
      this.currentQuestion = questions[randomIndex];
    },
    
    confirmChoice() {
      this.showChoiceModal = false;
    }
  },
  
  watch: {
    showChoiceModal(newVal) {
      if (newVal) {
        this.refreshQuestion();
      }
    },
    
    activeTab() {
      this.refreshQuestion();
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.bottle-container {
  width: 600rpx;
  height: 600rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.bottle-image {
  width: 400rpx;
  height: 800rpx;
  transition: transform 3s cubic-bezier(0.2, 0.8, 0.3, 1);
  cursor: pointer;
}

.choice-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: rgba(26, 11, 46, 0.95);
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 0 20px #ff00de;
  border: 2px solid #ff00de;
}

.modal-title {
  color: #fff;
  font-size: 36rpx;
  text-align: center;
  margin-bottom: 30rpx;
  text-shadow: 0 0 10px #00f7ff;
}

.choice-buttons {
  display: flex;
  gap: 20rpx;
}

.choice-btn {
  flex: 1;
  padding: 20rpx 40rpx;
  text-align: center;
  color: #fff;
  border-radius: 10rpx;
  font-size: 32rpx;
  transition: all 0.3s ease;
}

.truth {
  background: rgba(0, 247, 255, 0.2);
  border: 2px solid #00f7ff;
  box-shadow: 0 0 15px #00f7ff;
}

.dare {
  background: rgba(255, 0, 222, 0.2);
  border: 2px solid #ff00de;
  box-shadow: 0 0 15px #ff00de;
}

.choice-btn:active {
  transform: scale(0.95);
}

.tabs {
  display: flex;
  margin-bottom: 30rpx;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  color: #fff;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.tab.active {
  opacity: 1;
  border-bottom: 2px solid #00f7ff;
}

.content-area {
  padding: 30rpx 0;
  min-height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question {
  color: #fff;
  font-size: 32rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.refresh-btn {
  padding: 15rpx 30rpx;
  background: rgba(0, 247, 255, 0.2);
  border: 1px solid #00f7ff;
  border-radius: 30rpx;
  color: #fff;
  font-size: 28rpx;
}

.action-btn {
  background: rgba(255, 0, 222, 0.2);
  border: 2px solid #ff00de;
  color: #fff;
  padding: 20rpx;
  text-align: center;
  border-radius: 10rpx;
  margin-top: 20rpx;
}
</style> 