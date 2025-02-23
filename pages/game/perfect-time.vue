<template>
	<view class="container">
		<view class="game-title">时间刚刚好</view>
		
		<view class="game-area">
			<view class="circle" :class="{ 'red': !isGreen, 'green': isGreen }"></view>
			<view class="timer" v-if="showTimer">{{ countdown }}s</view>
			<view class="result" v-if="showResult">
				反应时间: {{ reactionTime }}ms
			</view>
		</view>
		
		<view class="controls">
			<button class="neon-button" @tap="startGame" v-if="!gameStarted">开始游戏</button>
			<button class="neon-button" @tap="stopGame" v-if="gameStarted">点击暂停</button>
		</view>
		
		<view class="rules">
			<view class="rule-title">游戏规则：</view>
			<view class="rule-content">
				1. 点击开始后，屏幕上的红球将在3秒倒计时后变成绿色
				2. 在球变绿时立即点击暂停
				3. 反应时间越长，惩罚越重
				4. 反应时间超过1秒需要喝酒
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			gameStarted: false,
			isGreen: false,
			showTimer: false,
			countdown: 3,
			showResult: false,
			reactionTime: 0,
			startTime: 0,
			countdownTimer: null,
			changeTimer: null
		}
	},
	methods: {
		startGame() {
			this.resetGame()
			this.gameStarted = true
			this.showTimer = true
			this.countdown = 3
			
			// 开始3秒倒计时
			this.countdownTimer = setInterval(() => {
				this.countdown--
				if (this.countdown <= 0) {
					clearInterval(this.countdownTimer)
					this.showTimer = false
					// 随机延迟0.5-2秒后变绿
					const randomDelay = Math.random() * 1500 + 500
					this.changeTimer = setTimeout(() => {
						this.isGreen = true
						this.startTime = Date.now()
					}, randomDelay)
				}
			}, 1000)
		},
		
		stopGame() {
			if (!this.isGreen) {
				// 提前点击，判定失败
				uni.showToast({
					title: '太早了！要等到绿色才能点击',
					icon: 'none'
				})
				this.resetGame()
				return
			}
			
			const endTime = Date.now()
			this.reactionTime = endTime - this.startTime
			this.showResult = true
			this.gameStarted = false
			
			// 根据反应时间显示结果
			let message = ''
			if (this.reactionTime < 300) {
				message = '反应超快！'
			} else if (this.reactionTime < 500) {
				message = '不错的反应速度！'
			} else if (this.reactionTime < 1000) {
				message = '反应有点慢啦~'
			} else {
				message = '太慢了，该喝酒啦！'
			}
			
			uni.showModal({
				title: '游戏结果',
				content: `${message}\n反应时间：${this.reactionTime}ms`,
				showCancel: false
			})
		},
		
		resetGame() {
			this.gameStarted = false
			this.isGreen = false
			this.showTimer = false
			this.showResult = false
			this.reactionTime = 0
			clearInterval(this.countdownTimer)
			clearTimeout(this.changeTimer)
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	padding: 40rpx;
	background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.game-title {
	font-size: 48rpx;
	color: #fff;
	margin-bottom: 60rpx;
	text-shadow: 0 0 10px #00f7ff;
}

.game-area {
	width: 100%;
	height: 600rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.circle {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.red {
	background: #ff0000;
	box-shadow: 0 0 20px #ff0000;
}

.green {
	background: #00ff00;
	box-shadow: 0 0 20px #00ff00;
}

.timer {
	font-size: 72rpx;
	color: #fff;
	margin-top: 40rpx;
	text-shadow: 0 0 10px #00f7ff;
}

.result {
	font-size: 36rpx;
	color: #fff;
	margin-top: 40rpx;
	text-shadow: 0 0 10px #00f7ff;
}

.controls {
	margin-top: 60rpx;
	width: 100%;
}

.neon-button {
	background: rgba(26, 11, 46, 0.95);
	color: #fff;
	border: 2px solid #ff00de;
	box-shadow: 0 0 15px #ff00de;
	border-radius: 50rpx;
	padding: 20rpx 60rpx;
	font-size: 32rpx;
	text-shadow: 0 0 5px #fff;
}

.neon-button:active {
	transform: scale(0.95);
	box-shadow: 0 0 25px #ff00de;
}

.rules {
	margin-top: 80rpx;
	width: 100%;
	padding: 30rpx;
	background: rgba(26, 11, 46, 0.95);
	border-radius: 16rpx;
	border: 2px solid #ff00de;
	box-shadow: 0 0 15px #ff00de;
}

.rule-title {
	color: #fff;
	font-size: 32rpx;
	margin-bottom: 20rpx;
	text-shadow: 0 0 5px #fff;
}

.rule-content {
	color: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
	line-height: 1.6;
}
</style> 