<template>
  <view class="draw-lots">
    <view class="lots-container">
      <view class="bamboo-tube" :class="{ 'shaking': isDrawing }">
        <view class="tube-top"></view>
        <view class="tube-body">
          <view class="lots-sticks">
            <view class="stick" v-for="i in 10" :key="i"></view>
          </view>
        </view>
      </view>
      
      <view class="drawn-lot" v-if="showResult && !isDrawing">
        <view class="stick-result">
          <view class="stick-head"></view>
          <view class="stick-body"></view>
        </view>
        <text class="result-number">第 {{resultNumber}} 签</text>
        <text class="result-text" @click="editLot(resultNumber - 1)">{{resultText}}</text>
      </view>
      
      <button class="draw-button" 
              :disabled="isDrawing"
              @click="drawLot">
        {{ isDrawing ? '正在抽签...' : '抽签' }}
      </button>

      <button class="settings-button" @click="openSettings">
        设置签内容
      </button>
    </view>

    <!-- 设置弹窗 -->
    <popup 
      ref="settingsPopup" 
      type="center" 
      @change="popupChange" 
      v-if="showSettings"
    >
      <view class="settings-popup">
        <view class="settings-header">
          <text class="settings-title">设置签内容</text>
          <text class="close-btn" @click="closeSettings">×</text>
        </view>
        <scroll-view scroll-y class="lots-list">
          <view v-for="(lot, index) in editableLots" :key="index" class="lot-item">
            <view class="lot-item-header">
              <text class="lot-number">第{{lot.number}}签</text>
              <text class="delete-btn" @click="deleteLot(index)">删除</text>
            </view>
            <input 
              class="lot-input"
              v-model="lot.text"
              placeholder="请输入签的内容"
              @blur="updateLot(index, lot.text)"
            />
          </view>
        </scroll-view>
        <view class="popup-footer">
          <button class="add-button" @click="addNewLot">新增签</button>
          <button class="save-button" @click="saveLots">保存设置</button>
        </view>
      </view>
    </popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isDrawing: false,
      showResult: false,
      resultNumber: 0,
      resultText: '',
      lots: [
        { number: 1, text: '大吉 - 指定一人喝一杯，自己免喝' },
        { number: 2, text: '中吉 - 与左边的人对饮一杯' },
        { number: 3, text: '小吉 - 讲一个笑话，讲得不好喝一杯' },
        { number: 4, text: '平签 - 猜拳决定喝酒人选' },
        { number: 5, text: '末吉 - 自罚一杯，大家陪饮' },
        { number: 6, text: '上吉 - 玩真心话大冒险，输者喝酒' },
        { number: 7, text: '中平 - 与右边的人石头剪刀布，输者喝' },
        { number: 8, text: '下签 - 表演节目，大家满意则免喝' },
        { number: 9, text: '吉签 - 选择两人PK喝酒' },
        { number: 10, text: '特签 - 所有人一起干杯！' }
      ],
      showSettings: false,
      editableLots: [],
      popupReady: false,
    }
  },
  watch: {
    showSettings(val) {
      if (!this.popupReady) return
      
      if (val) {
        this.editableLots = JSON.parse(JSON.stringify(this.lots))
        this.$nextTick(() => {
          if (this.$refs.settingsPopup) {
            this.$refs.settingsPopup.open()
          }
        })
      } else {
        this.$refs.settingsPopup.close()
      }
    }
  },
  methods: {
    drawLot() {
      if (this.isDrawing) return
      
      this.isDrawing = true
      this.showResult = false
      
      // 添加抽签动画延迟
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * this.lots.length)
        this.resultNumber = this.lots[randomIndex].number
        this.resultText = this.lots[randomIndex].text
        
        this.isDrawing = false
        this.showResult = true
      }, 1500)
    },
    editLot(index) {
      this.editableLots[index].text = this.lots[index].text
      this.showSettings = true
    },
    
    openSettings() {
      this.editableLots = JSON.parse(JSON.stringify(this.lots))
      this.showSettings = true
      this.$nextTick(() => {
        if (this.$refs.settingsPopup) {
          this.$refs.settingsPopup.open()
        }
      })
    },
    
    closeSettings() {
      if (this.$refs.settingsPopup) {
        this.$refs.settingsPopup.close()
      }
      this.showSettings = false
    },
    
    updateLot(index, text) {
      this.editableLots[index].text = text
    },
    
    addNewLot() {
      const newNumber = this.editableLots.length + 1
      this.editableLots.push({
        number: newNumber,
        text: ''
      })
    },

    deleteLot(index) {
      this.editableLots.splice(index, 1)
      // 重新编号
      this.editableLots.forEach((lot, idx) => {
        lot.number = idx + 1
      })
    },

    saveLots() {
      if (this.editableLots.length === 0) {
        uni.showToast({
          title: '至少需要一个签',
          icon: 'none'
        })
        return
      }
      this.lots = JSON.parse(JSON.stringify(this.editableLots))
      this.closeSettings()
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },
    
    popupChange(e) {
      if (!e.show) {
        this.showSettings = false
      }
    }
  },
  onReady() {
    this.popupReady = true
  }
}
</script>

<style>
.draw-lots {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40rpx;
  background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
  position: relative;
}

.draw-lots::before {
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

.lots-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600rpx;
  position: relative;
  z-index: 1;
}

.bamboo-tube {
  width: 160rpx;
  height: 400rpx;
  margin: 60rpx 0;
  position: relative;
  background: rgba(26, 11, 46, 0.95);
  border: 2px solid #ff00de;
  box-shadow: 0 0 20px #ff00de;
  border-radius: 80rpx;
}

.tube-top {
  width: 160rpx;
  height: 30rpx;
  background: rgba(26, 11, 46, 0.95);
  border-radius: 80rpx 80rpx 0 0;
  border-top: 2px solid #ff00de;
  border-left: 2px solid #ff00de;
  border-right: 2px solid #ff00de;
  box-shadow: 0 0 10px #ff00de;
}

.tube-body {
  width: 160rpx;
  height: 370rpx;
  background: rgba(26, 11, 46, 0.95);
  position: relative;
  overflow: hidden;
}

.lots-sticks {
  position: absolute;
  top: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6rpx;
}

.stick {
  width: 8rpx;
  height: 300rpx;
  background: #00f7ff;
  border-radius: 4rpx;
  box-shadow: 0 0 5px #00f7ff;
}

.shaking {
  animation: tubeShake 0.15s ease-in-out infinite;
}

@keyframes tubeShake {
  0%, 100% { 
    transform: rotate(0deg); 
  }
  25% { 
    transform: rotate(-5deg); 
  }
  75% { 
    transform: rotate(5deg); 
  }
}

.drawn-lot {
  margin: 40rpx 0;
  padding: 30rpx;
  width: 100%;
  background: rgba(26, 11, 46, 0.95);
  border: 2px solid #ff00de;
  box-shadow: 0 0 15px #ff00de;
  border-radius: 16rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stick-result {
  width: 8rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.stick-head {
  width: 16rpx;
  height: 16rpx;
  background: #00f7ff;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 0 5px #00f7ff;
}

.stick-body {
  width: 8rpx;
  height: 184rpx;
  background: #00f7ff;
  border-radius: 4rpx;
  margin: 0 auto;
  box-shadow: 0 0 5px #00f7ff;
}

.result-number {
  font-size: 36rpx;
  color: #fff;
  margin: 20rpx 0;
  text-shadow: 0 0 5px #fff,
               0 0 10px #00f7ff,
               0 0 15px #00f7ff;
}

.result-text {
  font-size: 32rpx;
  color: #fff;
  line-height: 1.5;
  text-decoration: underline;
  text-shadow: 0 0 5px #fff,
               0 0 10px #00f7ff;
}

.draw-button {
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: rgba(26, 11, 46, 0.95);
  color: #fff;
  font-size: 32rpx;
  border: 2px solid #ff00de;
  box-shadow: 0 0 15px #ff00de;
  margin-top: 40rpx;
  text-shadow: 0 0 5px #fff;
}

.draw-button:active {
  transform: scale(0.98);
  box-shadow: 0 0 25px #ff00de;
}

.draw-button[disabled] {
  opacity: 0.7;
  box-shadow: none;
}

.settings-button {
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: rgba(26, 11, 46, 0.95);
  color: #fff;
  font-size: 32rpx;
  border: 2px solid #00f7ff;
  box-shadow: 0 0 15px #00f7ff;
  margin-top: 20rpx;
  text-shadow: 0 0 5px #fff;
}

.settings-popup {
  width: 600rpx;
  background: rgba(26, 11, 46, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  border: 2px solid #ff00de;
  box-shadow: 0 0 20px #ff00de;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.settings-title {
  color: #fff;
  font-size: 36rpx;
  text-shadow: 0 0 5px #fff,
               0 0 10px #00f7ff;
}

.close-btn {
  color: #fff;
  font-size: 48rpx;
  padding: 0 20rpx;
  text-shadow: 0 0 5px #fff;
  cursor: pointer;
}

.close-btn:active {
  opacity: 0.7;
}

.lots-list {
  max-height: 800rpx;
}

.lot-item {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: rgba(26, 11, 46, 0.95);
  border: 1px solid #00f7ff;
  box-shadow: 0 0 10px #00f7ff;
  border-radius: 10rpx;
}

.lot-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.lot-number {
  display: block;
  color: #fff;
  font-size: 28rpx;
  margin-bottom: 10rpx;
  text-shadow: 0 0 5px #fff,
               0 0 10px #00f7ff;
}

.delete-btn {
  color: #ff4444;
  font-size: 28rpx;
  padding: 4rpx 12rpx;
  border: 1px solid #ff4444;
  border-radius: 6rpx;
  text-shadow: 0 0 5px #ff4444;
}

.lot-input {
  width: 100%;
  height: 70rpx;
  background: rgba(26, 11, 46, 0.95);
  border: 1px solid #ff00de;
  box-shadow: 0 0 5px #ff00de;
  border-radius: 8rpx;
  padding: 0 20rpx;
  color: #fff;
  font-size: 28rpx;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.add-button {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: rgba(26, 11, 46, 0.95);
  color: #fff;
  font-size: 32rpx;
  border: 2px solid #00f7ff;
  box-shadow: 0 0 15px #00f7ff;
  text-shadow: 0 0 5px #fff;
}

.save-button {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: rgba(26, 11, 46, 0.95);
  color: #fff;
  font-size: 32rpx;
  border: 2px solid #ff00de;
  box-shadow: 0 0 15px #ff00de;
  text-shadow: 0 0 5px #fff;
}

.save-button:active {
  transform: scale(0.98);
  box-shadow: 0 0 25px #ff00de;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 0.8; }
  100% { opacity: 0.5; }
}
</style> 