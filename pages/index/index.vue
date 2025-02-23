<template>
	<view class="content">
		<view class="header">
			<view class="header-content">
				<view class="user-info">
					<image class="avatar" src="/static/avatar-default.png"></image>
					<text class="user-title">未登录</text>
					<!-- <view class="vip-tag">开通VIP</view> -->
				</view>
				<view class="quick-actions">
					<view class="action-item" @tap="startGame('/pages/game/truth-dare')">
						<view class="action-icon">⚡️</view>
						<text>真心话大冒险</text>
					</view>
					<view class="action-item" @tap="startGame('/pages/game/drink-dare')">
						<view class="action-icon">🍺</view>
						<text>喝酒认怂</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="game-categories">
			<view class="game-list">
				<view class="game-item neon-box" v-for="(game, gIndex) in games" :key="gIndex" @tap="startGame(game.path)">
					<image class="game-image" :src="game.image"></image>
					<text class="game-name">{{game.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				games: [
					{ name: '摇骰子', image: '/static/images/game1.png',path:'/pages/game/dice' },
					{ name: '幸运转盘', image: '/static/images/wheel.png', path:'/pages/game/lucky-wheel' },
					{ name: '左轮轮盘', image: '/static/images/revolver.png', path:'/pages/game/revolver' },
					{ name: '抽签', image: '/static/images/lots.png', path:'/pages/game/draw-lots' },
					{ name: '时间刚刚好', image: '/static/images/timer.png', path:'/pages/game/perfect-time' },
					{ name: '猜谜语', image: '/static/images/riddle.png', path:'/pages/game/riddle' },
				],
			}
		},

		onLoad() {

		},
		methods: {
			startGame(path) {
				// 跳转到游戏页面
				uni.navigateTo({
					url: path
				})

			},
			showRules() {
				// 显示规则弹窗
				uni.showModal({
					title: '游戏规则',
					content: '1. 玩家轮流参与游戏\n2. 根据游戏指示完成任务\n3. 未完成任务的玩家需要喝酒\n4. 注意适量，快乐游戏',
					showCancel: false
				})
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

	/* 添加背景动画效果 */
	.content::before {
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

	@keyframes pulse {
		0% { opacity: 0.5; }
		50% { opacity: 0.8; }
		100% { opacity: 0.5; }
	}

	.header {
		margin-bottom: 40rpx;
		background: rgba(26, 11, 46, 0.95);
		border-radius: 16px;
		padding: 20rpx;
		box-shadow: 0 0 20px #ff00de;
		border: 2px solid #ff00de;
		position: relative;
		z-index: 1;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 2px solid #00f7ff;
		box-shadow: 0 0 10px #00f7ff;
	}

	.user-title {
		color: #fff;
		margin-left: 20rpx;
		font-size: 32rpx;
		text-shadow: 0 0 5px #fff,
					 0 0 10px #fff,
					 0 0 20px #00f7ff;
	}

	.vip-tag {
		margin-left: 20rpx;
		padding: 4rpx 16rpx;
		background: linear-gradient(45deg, #ff00de, #00f7ff);
		border-radius: 24rpx;
		font-size: 24rpx;
		color: #fff;
		text-shadow: 0 0 5px #fff;
		animation: neon 1.5s ease-in-out infinite alternate;
	}

	.quick-actions {
		display: flex;
		gap: 30rpx;
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-size: 24rpx;
		background: rgba(26, 11, 46, 0.95);
		padding: 12rpx 24rpx;
		border-radius: 12rpx;
		box-shadow: 0 0 15px #ff00de;
		border: 1px solid #ff00de;
		backdrop-filter: blur(10px);
	}

	.action-icon {
		font-size: 40rpx;
		margin-bottom: 8rpx;
		text-shadow: 0 0 10px #00f7ff;
	}

	.game-categories {
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.game-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
	}

	.game-item {
		padding: 30rpx 20rpx;
		border-radius: 16rpx;
		text-align: center;
		background: rgba(26, 11, 46, 0.95);
		backdrop-filter: blur(10px);
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 0 15px #ff00de;
		border: 2px solid #ff00de;
		transition: all 0.3s ease;
	}

	.game-item:active {
		transform: scale(0.95);
		box-shadow: 0 0 25px #ff00de;
	}

	.game-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		margin-bottom: 16rpx;
		/* border: 1px solid #ff00de; */
	}

	.game-name {
		font-size: 28rpx;
		color: #fff;
		margin-bottom: 8rpx;
		display: block;
		/* text-shadow: 0 0 5px #fff, */
					 /* 0 0 10px #ff00de,
					 0 0 15px #ff00de; */
	}

	.game-desc {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.7);
		display: block;
		line-height: 1.4;
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
	}

	@keyframes neon {
		from {
			text-shadow: 0 0 5px #fff,
						 0 0 10px #fff,
						 0 0 20px #ff00de,
						 0 0 30px #ff00de;
		}
		to {
			text-shadow: 0 0 2px #fff,
						 0 0 5px #fff,
						 0 0 10px #ff00de,
						 0 0 15px #ff00de;
		}
	}
</style>
