<template>
    <view class="lucky-wheel-container">
        <!-- Header Section -->
        <view class="game-header">
            <text class="title neon-text">幸运转盘</text>
            <text class="subtitle glow-text">今晚 你就是主角</text>
        </view>

        <!-- Wheel Section -->
        <view class="wheel-section">
            <view class="wheel-container glow-effect">
                <canvas 
                    id="wheelCanvas" 
                    class="wheel-canvas"
                    style="width: 300px; height: 300px;"
                    canvas-id="wheelCanvas"
                    type="2d"
                    v-show="!showSettingsModal">
                </canvas>
            </view>
            
            <!-- Control Button -->
            <view class="control-section">
                <button 
                    class="spin-button neon-button" 
                    @tap="startSpin" 
                    :disabled="isSpinning || !ctx"
                    :class="{'spinning': isSpinning}">
                    {{ isSpinning ? 'HIGH起来...' : (ctx ? '开始狂欢' : '初始化中...') }}
                </button>
                <button 
                    class="settings-button neon-button-secondary" 
                    @tap="showSettings">
                    设置
                </button>
            </view>
        </view>

        <!-- History Section -->
        <view class="history-section" v-if="spinHistory.length > 0">
            <text class="history-title neon-text-small">派对记录</text>
            <view class="history-list">
                <view class="history-item glow-text" 
                      v-for="(item, index) in spinHistory" 
                      :key="index">
                    {{ item }}
                </view>
            </view>
        </view>

        <!-- Settings Modal -->
        <view class="modal" v-if="showSettingsModal">
            <view class="modal-content">
                <text class="modal-title neon-text-small">游戏设置</text>
                <view class="prize-list">
                    <view class="prize-item" v-for="(prize, index) in editablePrizes" :key="index">
                        <input 
                            type="text" 
                            v-model="editablePrizes[index]" 
                            class="prize-input"
                            :placeholder="'奖项 ' + (index + 1)"
                        />
                        <text class="delete-btn" @tap="deletePrize(index)" v-if="editablePrizes.length > 4">×</text>
                    </view>
                    <button class="add-btn neon-button-small" @tap="addPrize" v-if="editablePrizes.length < 12">
                        添加选项
                    </button>
                </view>
                <view class="modal-buttons">
                    <button class="neon-button-small" @tap="saveSettings">保存</button>
                    <button class="neon-button-small cancel" @tap="cancelSettings">取消</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isSpinning: false,
            wheelRotation: 0,
            spinHistory: [],
            prizes: [
                '喝一杯', '喝两杯', '指定一人', '大家喝',
                '讲个笑话', '真心话', '大冒险', '下局请客'
            ],
            ctx: null,
            sectorOffset: 0,
            lastRotation: 0, // 记录上一次的旋转角度
            showSettingsModal: false,
            editablePrizes: [], // 用于编辑的临时数组
        }
    },
    
    created() {
        this.sectorOffset = (360 / this.prizes.length) / 2
    },
    
    onReady() {
        console.log('Component ready, attempting to initialize canvas...')
        setTimeout(() => {
            this.initCanvas()
        }, 100)
    },
    
    methods: {
        initCanvas() {
            console.log('Initializing canvas...')
            const query = uni.createSelectorQuery()
            
            // #ifdef MP-WEIXIN
            query.select('#wheelCanvas')
                .fields({ node: true, size: true })
                .exec((res) => {
                    console.log('MP Canvas query result:', res)
                    if (res[0]) {
                        const canvas = res[0].node
                        this.ctx = canvas.getContext('2d')
                        const dpr = uni.getSystemInfoSync().pixelRatio
                        canvas.width = res[0].width * dpr
                        canvas.height = res[0].height * dpr
                        this.ctx.scale(dpr, dpr)
                        console.log('MP Canvas context obtained')
                        this.render()
                    } else {
                        console.error('Failed to get canvas node')
                    }
                })
            // #endif
            
            // #ifdef H5
            query.select('#wheelCanvas')
                .context((res) => {
                    console.log('H5 Canvas context result:', res)
                    if (res && res.context) {
                        this.ctx = res.context
                        console.log('H5 Canvas context obtained')
                        this.render()
                    } else {
                        console.error('Failed to get canvas context')
                    }
                })
                .exec()
            // #endif
        },
        
        render() {
            if (!this.ctx) return
            
            const renderFrame = () => {
                this.ctx.clearRect(0, 0, 300, 300)
                this.drawWheel()
                this.drawPointer()
            }
            
            // #ifdef H5
            requestAnimationFrame(renderFrame)
            // #endif
            
            // #ifdef MP-WEIXIN
            renderFrame()
            // #endif
        },
        
        drawWheel() {
            if (!this.ctx) {
                console.error('Canvas context not available')
                return
            }
            
            const ctx = this.ctx
            const centerX = 150
            const centerY = 150
            const radius = 140
            
            // 清空画布
            ctx.clearRect(0, 0, 300, 300)
            
            // 绘制外发光效果
            const outerGlow = ctx.createRadialGradient(
                centerX, centerY, radius - 10,
                centerX, centerY, radius + 10
            )
            outerGlow.addColorStop(0, 'rgba(255, 0, 222, 0.5)')
            outerGlow.addColorStop(1, 'rgba(255, 0, 222, 0)')
            
            ctx.fillStyle = outerGlow
            ctx.fillRect(0, 0, 300, 300)
            
            // 绘制转盘背景
            const bgGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            )
            bgGradient.addColorStop(0, '#2B0B3A')
            bgGradient.addColorStop(1, '#1A0B2E')
            
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = bgGradient
            ctx.fill()
            
            // 绘制外圈霓虹效果
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.strokeStyle = '#ff00de'
            ctx.lineWidth = 3
            ctx.shadowColor = '#ff00de'
            ctx.shadowBlur = 15
            ctx.stroke()
            
            // 绘制扇形
            this.prizes.forEach((prize, index) => {
                const startAngle = (index * 2 * Math.PI) / this.prizes.length
                const endAngle = ((index + 1) * 2 * Math.PI) / this.prizes.length
                
                // 扇形渐变
                const sectorGradient = ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, radius
                )
                if (index % 2 === 0) {
                    sectorGradient.addColorStop(0, 'rgba(255, 0, 222, 0.2)')
                    sectorGradient.addColorStop(1, 'rgba(255, 0, 222, 0.6)')
                } else {
                    sectorGradient.addColorStop(0, 'rgba(0, 247, 255, 0.2)')
                    sectorGradient.addColorStop(1, 'rgba(0, 247, 255, 0.6)')
                }
                
                ctx.beginPath()
                ctx.moveTo(centerX, centerY)
                ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle)
                ctx.fillStyle = sectorGradient
                ctx.fill()
                
                // 扇形分隔线
                ctx.beginPath()
                ctx.moveTo(centerX, centerY)
                ctx.lineTo(
                    centerX + Math.cos(startAngle) * radius,
                    centerY + Math.sin(startAngle) * radius
                )
                ctx.strokeStyle = index % 2 === 0 ? '#ff00de' : '#00f7ff'
                ctx.lineWidth = 2
                ctx.shadowColor = index % 2 === 0 ? '#ff00de' : '#00f7ff'
                ctx.shadowBlur = 10
                ctx.stroke()
                
                // 文字
                ctx.save()
                ctx.translate(centerX, centerY)
                ctx.rotate(startAngle + (Math.PI / this.prizes.length))
                
                // 文字发光效果
                ctx.fillStyle = '#FFFFFF'
                ctx.font = 'bold 16px sans-serif'
                ctx.textAlign = 'center'
                ctx.shadowColor = index % 2 === 0 ? '#ff00de' : '#00f7ff'
                ctx.shadowBlur = 15
                ctx.fillText(prize, radius * 0.65, 0)
                
                ctx.restore()
            })
        },
        
        drawPointer() {
            if (!this.ctx) return
            
            const ctx = this.ctx
            const centerX = 150
            const centerY = 150
            
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate((this.wheelRotation * Math.PI) / 180)
            
            // 指针发光效果
            ctx.shadowColor = '#00f7ff'
            ctx.shadowBlur = 20
            
            // 绘制指针主体，使用更优雅的形状
            const pointerGradient = ctx.createLinearGradient(0, 0, 70, 0)
            pointerGradient.addColorStop(0, 'rgba(0, 247, 255, 1)')
            pointerGradient.addColorStop(0.7, 'rgba(0, 247, 255, 0.8)')
            pointerGradient.addColorStop(1, 'rgba(0, 247, 255, 0.6)')
            
            // 绘制一个更细长的指针
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(75, 0)
            ctx.lineWidth = 3
            ctx.strokeStyle = pointerGradient
            ctx.stroke()
            
            // 绘制一个更优雅的指针头
            ctx.beginPath()
            ctx.moveTo(75, 0)
            ctx.lineTo(65, -6)
            ctx.lineTo(70, 0)
            ctx.lineTo(65, 6)
            ctx.closePath()
            ctx.fillStyle = '#00f7ff'
            ctx.fill()
            
            // 绘制中心装饰
            // 外圈光环
            ctx.beginPath()
            ctx.arc(0, 0, 12, 0, Math.PI * 2)
            ctx.strokeStyle = '#ff00de'
            ctx.lineWidth = 2
            ctx.shadowColor = '#ff00de'
            ctx.shadowBlur = 15
            ctx.stroke()
            
            // 内圈实心
            const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 10)
            centerGradient.addColorStop(0, '#ff00de')
            centerGradient.addColorStop(1, '#ff69b4')
            
            ctx.beginPath()
            ctx.arc(0, 0, 10, 0, Math.PI * 2)
            ctx.fillStyle = centerGradient
            ctx.fill()
            
            ctx.restore()
        },
        
        startSpin() {
            if (this.isSpinning || !this.ctx) return
            
            this.isSpinning = true
            const baseSpins = 5
            const randomSpins = Math.floor(Math.random() * 3) + 3
            const randomPrize = Math.floor(Math.random() * this.prizes.length)
            
            // 确保从当前角度继续顺时针旋转
            const currentRotation = this.wheelRotation % 360
            const targetSector = (360 / this.prizes.length) * randomPrize + this.sectorOffset
            let additionalRotation = 0
            
            // 计算需要额外旋转的角度，确保总是顺时针到达目标
            if (targetSector <= currentRotation) {
                additionalRotation = 360 - (currentRotation - targetSector)
            } else {
                additionalRotation = targetSector - currentRotation
            }
            
            // 计算总旋转角度
            const totalRotation = this.wheelRotation + // 当前累积角度
                                (baseSpins + randomSpins) * 360 + // 基础旋转
                                additionalRotation // 到达目标需要的额外角度
            
            const duration = 6000
            const start = Date.now()
            const startRotation = this.wheelRotation
            const rotationDiff = totalRotation - startRotation
            
            const animate = () => {
                const now = Date.now()
                const timePassed = now - start
                
                if (timePassed >= duration) {
                    this.isSpinning = false
                    this.wheelRotation = totalRotation
                    this.lastRotation = totalRotation
                    this.spinHistory.unshift(this.prizes[randomPrize])
                    if (this.spinHistory.length > 5) this.spinHistory.pop()
                    
                    this.render()
                    
                    setTimeout(() => {
                        uni.showToast({
                            title: `🎉 ${this.prizes[randomPrize]} 🎉`,
                            icon: 'none',
                            duration: 2000
                        })
                    }, 500)
                    return
                }
                
                // 优化缓动效果
                const progress = timePassed / duration
                let easeOut
                
                if (progress < 0.2) {
                    // 开始加速更平滑
                    easeOut = Math.pow(progress / 0.2, 2)
                } else if (progress < 0.6) {
                    // 中间匀速
                    easeOut = progress
                } else {
                    // 结尾减速更平滑
                    const p = (progress - 0.6) / 0.4
                    easeOut = 0.6 + (0.4 * (1 - Math.pow(p, 2)))
                }
                
                // 计算当前旋转角度
                this.wheelRotation = startRotation + (rotationDiff * easeOut)
                
                this.render()
                
                // #ifdef H5
                requestAnimationFrame(animate)
                // #endif
                
                // #ifdef MP-WEIXIN
                setTimeout(animate, 16)
                // #endif
            }
            
            animate()
        },
        
        showSettings() {
            this.editablePrizes = [...this.prizes]
            this.showSettingsModal = true
        },
        
        saveSettings() {
            // 过滤空值并保存
            this.prizes = this.editablePrizes.filter(prize => prize.trim() !== '')
            this.showSettingsModal = false
            // 重新渲染转盘
            this.render()
        },
        
        cancelSettings() {
            this.showSettingsModal = false
        },
        
        addPrize() {
            if (this.editablePrizes.length < 12) {
                this.editablePrizes.push('')
            }
        },
        
        deletePrize(index) {
            if (this.editablePrizes.length > 4) {
                this.editablePrizes.splice(index, 1)
            }
        }
    }
}
</script>

<style>
.lucky-wheel-container {
    padding: 30rpx;
    min-height: 100vh;
    background: linear-gradient(to bottom, #0D0D2B 0%, #1A1A3A 100%);
    position: relative;
    overflow: hidden;
}

/* 背景动画效果 */
.lucky-wheel-container::before {
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

.game-header {
    text-align: center;
    margin-bottom: 40rpx;
    position: relative;
    z-index: 1;
}

.title {
    font-size: 48rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
    text-transform: uppercase;
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

@keyframes neon {
    from {
        text-shadow: 0 0 5px #fff,
                     0 0 10px #fff,
                     0 0 20px #ff00de,
                     0 0 30px #ff00de,
                     0 0 40px #ff00de;
    }
    to {
        text-shadow: 0 0 2px #fff,
                     0 0 5px #fff,
                     0 0 10px #ff00de,
                     0 0 15px #ff00de,
                     0 0 20px #ff00de;
    }
}

.subtitle {
    font-size: 28rpx;
    color: #00f7ff;
    margin-top: 10rpx;
}

.glow-text {
    color: #00f7ff;
    text-shadow: 0 0 10px #00f7ff;
}

.wheel-section {
    position: relative;
    z-index: 1;
}

.wheel-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 40rpx auto;
    border-radius: 50%;
    box-shadow: 0 0 20px #ff00de,
                0 0 40px #ff00de,
                inset 0 0 20px #ff00de;
    z-index: 1;
}

.wheel-canvas {
    width: 300px !important;
    height: 300px !important;
    transition: transform 0.1s linear;
    position: relative;
    z-index: 1;
    visibility: visible; /* 默认可见 */
}

/* 当设置弹窗显示时，确保 canvas 隐藏 */
.wheel-canvas.hidden {
    visibility: hidden;
}

.control-section {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    gap: 2rpx;
}

.spin-button {
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
    min-width: 350rpx;
}

.neon-button:active {
    transform: scale(0.95);
    box-shadow: 0 0 20px #00f7ff,
                inset 0 0 20px #00f7ff;
}

.spinning {
    animation: buttonGlow 0.5s ease-in-out infinite alternate;
}

@keyframes buttonGlow {
    from {
        box-shadow: 0 0 10px #00f7ff,
                    inset 0 0 10px #00f7ff;
    }
    to {
        box-shadow: 0 0 20px #00f7ff,
                    inset 0 0 20px #00f7ff;
    }
}

.settings-button {
    background: transparent;
    border: 2px solid #ff00de;
    color: #ff00de;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
    border-radius: 50rpx;
    font-weight: bold;
    box-shadow: 0 0 10px #ff00de,
                inset 0 0 10px #ff00de;
    min-width: 300rpx;
}

.history-section {
    margin-top: 60rpx;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20rpx;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
}

.neon-text-small {
    font-size: 28rpx;
    color: #00f7ff;
    text-shadow: 0 0 5px #00f7ff,
                 0 0 10px #00f7ff;
}

.history-list {
    margin-top: 20rpx;
}

.history-item {
    padding: 10rpx 0;
    border-bottom: 1px solid rgba(0, 247, 255, 0.3);
    font-size: 24rpx;
    transition: all 0.3s ease;
}

.history-item:hover {
    background: rgba(0, 247, 255, 0.1);
}

/* 添加结果展示动画 */
.history-item:first-child {
    animation: newResult 0.5s ease-in-out;
}

@keyframes newResult {
    from {
        transform: scale(1.1);
        background: rgba(0, 247, 255, 0.3);
    }
    to {
        transform: scale(1);
        background: transparent;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: rgba(26, 11, 46, 0.95);
    border-radius: 20rpx;
    padding: 40rpx;
    width: 80%;
    max-width: 600rpx;
    border: 2px solid #ff00de;
    box-shadow: 0 0 20px #ff00de;
    position: relative;
    z-index: 100000;
}

.modal-title {
    text-align: center;
    margin-bottom: 30rpx;
}

.prize-list {
    margin: 20rpx 0;
}

.prize-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.prize-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #ff00de;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    color: #fff;
    margin-right: 10rpx;
}

.delete-btn {
    color: #ff00de;
    font-size: 40rpx;
    padding: 0 20rpx;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    margin-top: 30rpx;
}

.neon-button-small {
    background: transparent;
    border: 1px solid #00f7ff;
    color: #00f7ff;
    padding: 10rpx 30rpx;
    font-size: 28rpx;
    border-radius: 30rpx;
    box-shadow: 0 0 5px #00f7ff;
}

.neon-button-small.cancel {
    border-color: #ff00de;
    color: #ff00de;
    box-shadow: 0 0 5px #ff00de;
}

.add-btn {
    width: 100%;
    margin-top: 20rpx;
}
</style> 