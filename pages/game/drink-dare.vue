<template>
    <view class="container">
        <view class="header">
            <text class="title">认怂声明书</text>
            <text class="subtitle">庄重宣告，实属无奈</text>
        </view>
        
        <view class="challenge-card neon-box" ref="cardRef">
            <text class="declaration-title">认怂声明</text>
            <view class="input-group">
                <text>姓名：</text>
                <input v-model="name" class="input-field" placeholder="请输入姓名"/>
            </view>
            <view class="input-group">
                <text>内容：</text>
                <textarea v-model="content" class="input-area" placeholder="请输入认怂内容"/>
            </view>
            <text class="declaration-date">日期：{{ currentDate }}</text>
            <text class="declaration-signature">认怂者签名：____________</text>
        </view>
        
        <view class="actions">
            <button class="btn save-btn" @tap="saveToAlbum">保存到相册</button>
            <button class="btn share-btn" @tap="shareToWechat">分享到微信</button>
        </view>
        <canvas 
            canvas-id="shareCanvas" 
            style="width: 600px; height: 800px; position: fixed; left: -9999px;"
        ></canvas>
    </view>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
    data() {
        return {
            name: '张三',
            content: '因本人酒量实在有限，在与王大侠的酒桌比拼中完全不是对手。' +
                    '现本着对身体负责的态度，主动认怂，甘愿接受惩罚。' +
                    '特此声明，以示诚意。',
            currentDate: new Date().toLocaleDateString('zh-CN'),
            imagePath: ''
        }
    },
    methods: {
        async generateImage() {
            try {
                const element = this.$refs.cardRef
                
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: null
                })
                
                const tempFilePath = canvas.toDataURL('image/png')
                
                const [error, res] = await uni.base64ToTempFilePath({
                    base64: tempFilePath.split(',')[1],
                    success: (res) => {
                        this.imagePath = res.tempFilePath
                        return res.tempFilePath
                    },
                    fail: (error) => {
                        throw error
                    }
                })
                
                if (error) {
                    throw error
                }
                
                return res.tempFilePath
            } catch (error) {
                uni.showToast({
                    title: '生成图片失败',
                    icon: 'none'
                })
                throw error
            }
        },
        
        async saveToAlbum() {
            try {
                const [error, res] = await uni.authorize({
                    scope: 'scope.writePhotosAlbum'
                })
                
                if (error) {
                    throw error
                }
                
                const filePath = await this.generateImage()
                
                await uni.saveImageToPhotosAlbum({
                    filePath: filePath,
                    success: () => {
                        uni.showToast({
                            title: '保存成功',
                            icon: 'success'
                        })
                    },
                    fail: (err) => {
                        throw err
                    }
                })
            } catch (error) {
                uni.showToast({
                    title: '保存失败',
                    icon: 'none'
                })
            }
        },
        
        async shareToWechat() {
            try {
                const filePath = await this.generateImage()
                
                await uni.share({
                    provider: 'weixin',
                    scene: 'WXSceneSession',
                    type: 2,
                    imageUrl: filePath,
                    success: () => {
                        uni.showToast({
                            title: '分享成功',
                            icon: 'success'
                        })
                    },
                    fail: (err) => {
                        throw err
                    }
                })
            } catch (error) {
                uni.showToast({
                    title: '分享失败',
                    icon: 'none'
                })
            }
        }
    }
}
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 40rpx;
    background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
}

.header {
    text-align: center;
    margin-bottom: 60rpx;
}

.title {
    font-size: 48rpx;
    color: #fff;
    text-shadow: 0 0 10px #ff00de;
    margin-bottom: 20rpx;
    display: block;
}

.subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    display: block;
}

.challenge-card {
    width: 90%;
    padding: 40rpx;
    background: rgba(26, 11, 46, 0.95);
    border-radius: 20rpx;
    margin-bottom: 60rpx;
    box-shadow: 0 0 20px #ff00de;
    border: 2px solid #ff00de;
}

.challenge-text {
    color: #fff;
    font-size: 36rpx;
    text-align: center;
    line-height: 1.4;
    display: block;
}

.actions {
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30rpx;
}

.btn {
    flex: 1;
    padding: 30rpx;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #fff;
    border: none;
    text-shadow: 0 0 5px #fff;
}

.dare-btn {
    background: linear-gradient(45deg, #ff00de, #00f7ff);
    box-shadow: 0 0 15px #00f7ff;
}

.chicken-btn {
    background: linear-gradient(45deg, #ff6b6b, #ffc107);
    box-shadow: 0 0 15px #ffc107;
}

.btn:active {
    transform: scale(0.98);
    opacity: 0.9;
}

.declaration-title {
    color: #ff00de;
    font-size: 40rpx;
    text-align: center;
    margin-bottom: 40rpx;
    font-weight: bold;
    display: block;
}

.declaration-text {
    color: #fff;
    font-size: 32rpx;
    margin-bottom: 20rpx;
    display: block;
}

.declaration-content {
    color: #fff;
    font-size: 32rpx;
    line-height: 1.6;
    margin-bottom: 40rpx;
    display: block;
    text-align: justify;
}

.declaration-date {
    color: #fff;
    font-size: 28rpx;
    margin-bottom: 30rpx;
    display: block;
    text-align: right;
}

.declaration-signature {
    color: #fff;
    font-size: 28rpx;
    margin-top: 20rpx;
    display: block;
    text-align: right;
}

.input-group {
    margin-bottom: 30rpx;
}

.input-field {
    width: 100%;
    height: 70rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8rpx;
    color: #fff;
    padding: 0 20rpx;
    margin-top: 10rpx;
}

.input-area {
    width: 100%;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8rpx;
    color: #fff;
    padding: 20rpx;
    margin-top: 10rpx;
}

.save-btn {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    box-shadow: 0 0 15px #4CAF50;
}

.share-btn {
    background: linear-gradient(45deg, #2196F3, #1976D2);
    box-shadow: 0 0 15px #2196F3;
}
</style> 