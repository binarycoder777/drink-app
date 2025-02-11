<template>
    <view class="container">
        <canvas type="webgl" id="webgl" class="webgl-canvas"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd">
        </canvas>
        <view class="controls">
            <button class="spin-btn" @tap="spinCylinder">旋转弹仓</button>
            <button class="fire-btn" @tap="pullTrigger">开火</button>
        </view>
    </view>
</template>

<script>
import { createScopedThreejs } from 'threejs-miniprogram'
import { markRaw } from 'vue'

export default {
    data() {
        return {
            THREE: null,
            scene: null,
            camera: null,
            renderer: null,
            canvas: null,
            revolver: null,
            cylinder: null,
            bullets: [true, false, false, false, false, false],
            currentChamber: 0,
            isSpinning: false,
            animationFrameId: null,
            canvasWidth: 0,
            canvasHeight: 0,
            isDragging: false,
            previousTouch: {
                x: 0,
                y: 0
            },
            rotationSpeed: 0.01,
            currentRotation: {
                x: 0,
                y: Math.PI / 12
            }
        }
    },
    
    async mounted() {
        try {
            // 增加延迟确保 canvas 节点已经准备好
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const sysInfo = uni.getSystemInfoSync();
            this.canvasWidth = sysInfo.windowWidth;
            this.canvasHeight = sysInfo.windowHeight;
            
            // 获取 canvas 上下文
            const query = uni.createSelectorQuery().in(this);
            const canvas = await new Promise((resolve, reject) => {
                query.select('#webgl')
                    .node()
                    .exec((res) => {
                        if (res[0] && res[0].node) {
                            resolve(res[0].node);
                        } else {
                            reject(new Error('Canvas element not found'));
                        }
                    });
            });
            
            this.canvas = markRaw(canvas);
            const gl = canvas.getContext('webgl', {
                alpha: true,
                antialias: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
            });
            
            if (!gl) {
                throw new Error('WebGL context not available');
            }
            
            await this.initThree();
            this.animate();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    },
    
    methods: {
        async initThree() {
            const canvas = this.canvas;
            const sysInfo = uni.getSystemInfoSync();
            const pixelRatio = sysInfo.pixelRatio || 1;
            
            canvas.width = this.canvasWidth * pixelRatio;
            canvas.height = this.canvasHeight * pixelRatio;
            
            try {
                this.THREE = markRaw(createScopedThreejs(canvas));
                this.scene = markRaw(new this.THREE.Scene());
                
                // 创建相机
                this.camera = markRaw(new this.THREE.PerspectiveCamera(
                    45,
                    this.canvasWidth / this.canvasHeight,
                    0.1,
                    1000
                ));
                this.camera.position.set(0, 0.1, 2);
                this.camera.lookAt(0, 0, 0);
                
                // 创建渲染器
                this.renderer = markRaw(new this.THREE.WebGLRenderer({
                    canvas,
                    context: canvas.getContext('webgl'),
                    antialias: true,
                    alpha: true
                }));
                
                this.renderer.setPixelRatio(pixelRatio);
                this.renderer.setSize(this.canvasWidth, this.canvasHeight);
                this.renderer.setClearColor(0xdddddd, 0);
                
                // 添加灯光
                const ambientLight = markRaw(new this.THREE.AmbientLight(0xffffff, 0.4));
                this.scene.add(ambientLight);
                
                const mainLight = markRaw(new this.THREE.DirectionalLight(0xffffff, 0.8));
                mainLight.position.set(2, 2, 2);
                this.scene.add(mainLight);
                
                const fillLight = markRaw(new this.THREE.DirectionalLight(0xffffff, 0.4));
                fillLight.position.set(-2, -1, 2);
                this.scene.add(fillLight);
                
                // 添加背景色
                this.scene.background = new this.THREE.Color(0xdddddd);
                
                // 创建左轮手枪模型
                this.createRevolver();
                
            } catch (error) {
                console.error('THREE.js initialization error:', error);
                throw error;
            }
        },
        
        createRevolver() {
            // 材质定义
            const blackMetalMaterial = markRaw(new this.THREE.MeshPhongMaterial({
                color: 0x2a2a2a,
                shininess: 30,
                specular: 0x222222
            }));
            
            const silverMetalMaterial = markRaw(new this.THREE.MeshPhongMaterial({
                color: 0xdddddd,
                shininess: 50,
                specular: 0x444444
            }));

            // 确保正确初始化 revolver 组
            this.revolver = markRaw(new this.THREE.Group());

            // 顶部导轨
            const createRailSystem = () => {
                const railGroup = new this.THREE.Group();
                
                // 主导轨
                const railBaseGeometry = markRaw(new this.THREE.BoxGeometry(0.8, 0.05, 0.2));
                const railBase = markRaw(new this.THREE.Mesh(railBaseGeometry, silverMetalMaterial));
                railBase.position.set(0.4, 0.35, 0);

                // 导轨齿
                for(let i = 0; i < 12; i++) {
                    const toothGeometry = markRaw(new this.THREE.BoxGeometry(0.03, 0.03, 0.2));
                    const tooth = markRaw(new this.THREE.Mesh(toothGeometry, silverMetalMaterial));
                    tooth.position.set(0.1 + (i * 0.05), 0.38, 0);
                    railGroup.add(tooth);
                }
                
                railGroup.add(railBase);
                return railGroup;
            };

            // 改进弹仓设计
            const createCylinder = () => {
                const cylinderGroup = new this.THREE.Group();
                
                // 主弹仓 - 更现代的设计
                const cylinderGeometry = markRaw(new this.THREE.CylinderGeometry(0.2, 0.2, 0.35, 24));
                const cylinder = markRaw(new this.THREE.Mesh(cylinderGeometry, silverMetalMaterial));
                cylinder.rotation.z = Math.PI / 2;
                cylinder.position.set(0.3, 0.12, 0);

                // 弹仓花纹
                for(let i = 0; i < 8; i++) {
                    const grooveGeometry = markRaw(new this.THREE.BoxGeometry(0.35, 0.02, 0.02));
                    const groove = markRaw(new this.THREE.Mesh(grooveGeometry, silverMetalMaterial));
                    groove.rotation.z = i * Math.PI / 4;
                    groove.position.set(0.3, 0.12, 0);
                    cylinderGroup.add(groove);
                }

                cylinderGroup.add(cylinder);
                return cylinderGroup;
            };

            // 改进机匣设计
            const createFrame = () => {
                const frameGroup = new this.THREE.Group();
                
                // 主机匣
                const frameShape = new this.THREE.Shape();
                frameShape.moveTo(0, 0);
                frameShape.lineTo(0.9, 0);
                frameShape.lineTo(0.9, 0.3);
                // 添加通气孔
                frameShape.lineTo(0.7, 0.3);
                frameShape.lineTo(0.7, 0.35);
                frameShape.lineTo(0.2, 0.35);
                frameShape.bezierCurveTo(0.1, 0.35, 0, 0.3, 0, 0);

                const frameExtrudeSettings = {
                    steps: 2,
                    depth: 0.25,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 4
                };

                const frame = markRaw(new this.THREE.Mesh(
                    new this.THREE.ExtrudeGeometry(frameShape, frameExtrudeSettings),
                    blackMetalMaterial
                ));

                // 添加装饰性铭文
                const textGeometry = markRaw(new this.THREE.BoxGeometry(0.2, 0.01, 0.1));
                const text = markRaw(new this.THREE.Mesh(textGeometry, silverMetalMaterial));
                text.position.set(0.5, 0.2, 0.13);

                frameGroup.add(frame);
                frameGroup.add(text);
                return frameGroup;
            };

            // 改进手柄设计
            const createGrip = () => {
                const gripShape = new this.THREE.Shape();
                // 更现代的手柄轮廓
                gripShape.moveTo(0, 0);
                gripShape.lineTo(0.25, 0);
                gripShape.bezierCurveTo(
                    0.25, -0.3,
                    0.2, -0.5,
                    0.15, -0.6
                );
                gripShape.lineTo(0.1, -0.65);
                gripShape.bezierCurveTo(
                    0.05, -0.7,
                    -0.05, -0.7,
                    -0.1, -0.65
                );
                gripShape.lineTo(-0.15, -0.6);
                gripShape.bezierCurveTo(
                    -0.2, -0.5,
                    -0.15, -0.2,
                    0, 0
                );

                const grip = markRaw(new this.THREE.Mesh(
                    new this.THREE.ExtrudeGeometry(gripShape, {
                        steps: 2,
                        depth: 0.25,
                        bevelEnabled: true,
                        bevelThickness: 0.02,
                        bevelSize: 0.02,
                        bevelSegments: 4
                    }),
                    blackMetalMaterial
                ));

                return grip;
            };

            // 重新设计击锤组件，调整位置
            const createHammer = () => {
                const hammerGroup = new this.THREE.Group();
                
                // 击锤主体 - 调整位置到弹仓后方
                const hammerShape = new this.THREE.Shape();
                hammerShape.moveTo(0, 0);
                hammerShape.lineTo(0.06, 0);
                hammerShape.lineTo(0.06, 0.15);
                hammerShape.lineTo(0.08, 0.18);
                hammerShape.lineTo(0.08, 0.25);
                hammerShape.lineTo(0.03, 0.28);
                hammerShape.lineTo(0, 0.25);
                hammerShape.lineTo(0, 0);

                const hammer = markRaw(new this.THREE.Mesh(
                    new this.THREE.ExtrudeGeometry(hammerShape, {
                        depth: 0.08,
                        bevelEnabled: true,
                        bevelThickness: 0.01,
                        bevelSize: 0.01,
                        bevelSegments: 3
                    }),
                    silverMetalMaterial
                ));
                // 将击锤移到弹仓正后方
                hammer.position.set(0.1, 0.22, -0.04);

                // 击锤轴心 - 对应调整位置
                const hammerPin = markRaw(new this.THREE.Mesh(
                    new this.THREE.CylinderGeometry(0.015, 0.015, 0.1, 12),
                    silverMetalMaterial
                ));
                hammerPin.rotation.x = Math.PI / 2;
                hammerPin.position.set(0.11, 0.25, 0);

                hammerGroup.add(hammer);
                hammerGroup.add(hammerPin);
                
                return hammerGroup;
            };

            // 重新设计扳机组件
            const createTrigger = () => {
                const triggerGroup = new this.THREE.Group();

                // 扳机护圈
                const guardShape = new this.THREE.Shape();
                guardShape.moveTo(0, 0);
                guardShape.lineTo(0.25, 0);
                // 更方正的护圈设计
                guardShape.lineTo(0.25, -0.4);    // 直线下降
                guardShape.lineTo(0.15, -0.45);   // 小斜角
                guardShape.lineTo(-0.15, -0.45);  // 平直底部
                guardShape.lineTo(-0.25, -0.4);   // 小斜角
                guardShape.lineTo(-0.25, 0);      // 直线上升
                guardShape.lineTo(0, 0);

                const triggerGuard = markRaw(new this.THREE.Mesh(
                    new this.THREE.ExtrudeGeometry(guardShape, {
                        depth: 0.15,
                        bevelEnabled: true,
                        bevelThickness: 0.02,
                        bevelSize: 0.02,
                        bevelSegments: 4
                    }),
                    blackMetalMaterial
                ));
                triggerGuard.position.set(0.15, 0, -0.075);

                // 扳机本体 - 更现代的方形设计
                const triggerShape = new this.THREE.Shape();
                // 从上方开始
                triggerShape.moveTo(0, 0);
                // 前部垂直线
                triggerShape.lineTo(0.04, 0);
                triggerShape.lineTo(0.04, -0.15);
                // 底部水平段
                triggerShape.lineTo(0.02, -0.15);
                triggerShape.lineTo(0.02, -0.2);
                // 后部垂直线
                triggerShape.lineTo(-0.01, -0.2);
                triggerShape.lineTo(-0.01, -0.15);
                triggerShape.lineTo(0, -0.15);
                triggerShape.lineTo(0, 0);

                const trigger = markRaw(new this.THREE.Mesh(
                    new this.THREE.ExtrudeGeometry(triggerShape, {
                        depth: 0.08,
                        bevelEnabled: true,
                        bevelThickness: 0.01,
                        bevelSize: 0.01,
                        bevelSegments: 3
                    }),
                    silverMetalMaterial
                ));
                // 调整扳机位置
                trigger.position.set(0.2, -0.1, -0.04);

                // 扳机轴心
                const triggerPin = markRaw(new this.THREE.Mesh(
                    new this.THREE.CylinderGeometry(0.01, 0.01, 0.17, 8),
                    silverMetalMaterial
                ));
                triggerPin.rotation.x = Math.PI / 2;
                triggerPin.position.set(0.2, -0.1, 0);

                triggerGroup.add(triggerGuard);
                triggerGroup.add(trigger);
                triggerGroup.add(triggerPin);

                return triggerGroup;
            };

            // 组装部分
            const rail = createRailSystem();
            const cylinder = createCylinder();
            const frame = createFrame();
            const grip = createGrip();
            const hammer = createHammer();
            const trigger = createTrigger();
            
            this.revolver.add(rail);
            this.revolver.add(cylinder);
            this.revolver.add(frame);
            this.revolver.add(grip);
            this.revolver.add(hammer);
            this.revolver.add(trigger);

            // 整体缩放和位置调整
            const scale = 0.35;
            this.revolver.scale.set(scale, scale, scale);
            this.revolver.position.set(-0.3, 0, 0);
            this.revolver.rotation.y = this.currentRotation.y;
            this.revolver.rotation.x = this.currentRotation.x;

            // 添加到场景
            this.scene.add(this.revolver);
        },
        
        animate() {
            const animate = () => {
                if (this.renderer && this.scene && this.camera) {
                    this.renderer.render(this.scene, this.camera);
                }
                
                if (this.canvas) {
                    this.animationFrameId = this.canvas.requestAnimationFrame(animate);
                }
            };
            
            if (this.canvas) {
                this.canvas.requestAnimationFrame(animate);
            }
        },
        
        spinCylinder() {
            if (this.isSpinning) return
            
            this.isSpinning = true
            const rotations = 2 + Math.random() * 4
            const duration = 2000
            const startTime = Date.now()
            
            const spin = () => {
                const elapsed = Date.now() - startTime
                const progress = elapsed / duration
                
                if (progress < 1) {
                    const angle = rotations * Math.PI * 2 * (1 - Math.pow(1 - progress, 3))
                    this.cylinder.rotation.x = angle
                    this.canvas.requestAnimationFrame(spin)
                } else {
                    this.isSpinning = false
                    this.currentChamber = Math.floor(Math.random() * 6)
                    uni.showToast({
                        title: '弹仓已旋转',
                        icon: 'none'
                    })
                }
            }
            
            spin()
        },
        
        pullTrigger() {
            if (this.isSpinning) return
            
            if (this.bullets[this.currentChamber]) {
                uni.showToast({
                    title: '砰！',
                    icon: 'none'
                })
            } else {
                uni.showToast({
                    title: '咔！',
                    icon: 'none'
                })
            }
            
            this.currentChamber = (this.currentChamber + 1) % 6
        },
        
        onTouchStart(event) {
            this.isDragging = true;
            const touch = event.touches[0];
            this.previousTouch.x = touch.clientX;
            this.previousTouch.y = touch.clientY;
        },
        
        onTouchMove(event) {
            if (!this.isDragging) return;
            
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.previousTouch.x;
            const deltaY = touch.clientY - this.previousTouch.y;

            // 更新旋转角度
            this.currentRotation.y += deltaX * this.rotationSpeed;
            this.currentRotation.x += deltaY * this.rotationSpeed;

            // 限制垂直旋转范围
            this.currentRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.currentRotation.x));

            // 应用旋转
            if (this.revolver) {
                this.revolver.rotation.y = this.currentRotation.y;
                this.revolver.rotation.x = this.currentRotation.x;
            }

            // 更新前一个触摸点
            this.previousTouch.x = touch.clientX;
            this.previousTouch.y = touch.clientY;
        },
        
        onTouchEnd(event) {
            this.isDragging = false;
        },
        
        beforeDestroy() {
            if (this.animationFrameId && this.canvas) {
                this.canvas.cancelAnimationFrame(this.animationFrameId);
            }
        }
    }
}
</script>

<style>
.container {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #dddddd;
}

.webgl-canvas {
    width: 100%;
    height: 100%;
    touch-action: none;
}

.controls {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 40rpx;
    padding: 0 40rpx;
}

.spin-btn,
.fire-btn {
    flex: 1;
    max-width: 300rpx;
    padding: 20rpx;
    border-radius: 10rpx;
    background: rgba(255, 0, 222, 0.8);
    color: white;
    border: none;
    font-size: 32rpx;
}

.fire-btn {
    background: rgba(255, 0, 0, 0.8);
}
</style> 