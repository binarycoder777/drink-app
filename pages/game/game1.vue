<template>
  <!-- 将整个页面包装在一个相对定位的容器中 -->
  <view class="page-container">
    <!-- 添加返回按钮 -->
    <view class="back-button" @tap="goBack">
      <text>返回</text>
    </view>
    
    <view class="game-container">
      <!-- 骰蛊区域 -->
      <view class="canvas-container">
        <canvas 
          type="webgl" 
          id="dice-container"
          class="dice-canvas"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        ></canvas>
      </view>
      
      <!-- 弹窗层 -->
      <view 
        class="modal-layer"
        v-if="showOptions"
      >
        <view 
          class="modal-overlay" 
          @tap="showOptions = false"
        >
          <scroll-view 
            class="modal-content" 
            scroll-x
            @tap.stop
          >
            <view class="modal-options-container">
              <view 
                v-for="n in 6" 
                :key="n" 
                class="modal-option"
                :class="{ 'active': diceCount === n }"
                @tap="selectDiceCount(n)"
              >
                {{ n }}
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 按钮区域 -->
      <view class="button-container">
        <view class="dice-count-selector" @tap="showDiceOptions">
          <text>{{ diceCount }}个骰子</text>
        </view>
        <view class="shake-button" @tap="shakeDiceCup">摇骰子</view>
      </view>
    </view>
  </view>
</template>

<script>
import { createScopedThreejs } from 'threejs-miniprogram';
import { markRaw, ref } from 'vue';

export default {
  setup() {
    const diceCount = ref(3);
    const showOptions = ref(false);
    
    return {
      diceCount,
      showOptions
    }
  },
  data() {
    return {
      THREE: null,
      scene: null,
      camera: null,
      renderer: null,
      diceCup: null,
      isDragging: false,
      previousTouch: null,
      canvasWidth: 0,
      canvasHeight: 0,
      canvas: null,
      startTouch: null,
      startRotation: null,
      isShaking: false,
      diceTextures: [],
      dices: [],
      textureLoader: null,
      decorativeLines: [],
      pointLight1: null,
      pointLight2: null,
      woodTexture: null,
    }
  },
  async mounted() {
    try {
      // 增加延迟确保 canvas 节点已经准备好
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sysInfo = uni.getSystemInfoSync();
      this.canvasWidth = sysInfo.windowWidth;
      this.canvasHeight = sysInfo.windowHeight;
      
      // 确保在初始化 Three.js 之前获取到 canvas 上下文
      const query = uni.createSelectorQuery().in(this);
      const canvas = await new Promise((resolve, reject) => {
        query.select('#dice-container')
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
      
      // 添加调试输出
      console.log('WebGL Context Attributes:', gl.getContextAttributes());
      console.log('Canvas:', {
        width: canvas.width,
        height: canvas.height,
        style: canvas.style
      });
      
      await this.initThreeJS();
      await this.loadTextures();
      this.createDiceCup();
      this.createDices();
      this.animate();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  },
  methods: {
    initThreeJS() {
      return new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query.select('#dice-container')
          .node()
          .exec((res) => {
            if (!res[0] || !res[0].node) {
              reject(new Error('Canvas element not found'));
              return;
            }

            const canvas = markRaw(res[0].node);
            this.canvas = canvas;
            
            // 获取系统信息来设置像素比
            const sysInfo = uni.getSystemInfoSync();
            const pixelRatio = sysInfo.pixelRatio || 1;
            
            this.canvasHeight = this.canvasHeight * 0.75;
            canvas.width = this.canvasWidth * pixelRatio;  // 考虑像素比
            canvas.height = this.canvasHeight * pixelRatio; // 考虑像素比

            const gl = canvas.getContext('webgl', {
              alpha: true,
              antialias: true,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false
            });

            // 添加调试输出
            console.log('WebGL Context Attributes:', gl.getContextAttributes());
            console.log('Canvas:', {
              width: canvas.width,
              height: canvas.height,
              style: canvas.style
            });

            try {
              this.THREE = markRaw(createScopedThreejs(canvas));
              this.scene = markRaw(new this.THREE.Scene());
              
              // 添加调试输出
              console.log('THREE.js Scene:', {
                background: this.scene.background,
                children: this.scene.children.length
              });
              
              this.scene.background = null;
              
              // 简化光照，只使用一个环境光和一个主光源
              const ambientLight = markRaw(new this.THREE.AmbientLight(0xffffff, 0.7));
              this.scene.add(ambientLight);

              // 主光源 - 从上方打光，角度与相机一致
              const mainLight = markRaw(new this.THREE.DirectionalLight(0xffffff, 0.3));
              mainLight.position.set(0, 8, 4);
              this.scene.add(mainLight);

              // 调整相机位置为从上往下看30度
              this.camera = markRaw(new this.THREE.PerspectiveCamera(
                45,             // 视角
                this.canvasWidth / this.canvasHeight,
                0.1,
                1000
              ));
              
              // 计算相机位置：从上往下看30度
              const distance = 12;
              const angleInRadians = Math.PI * 60 / 180;  // 使用60度，这样从上往下看就是30度
              
              this.camera.position.set(
                0,                                    // x = 0 保持正对
                distance * Math.cos(angleInRadians),  // y = 距离 * cos(60°)
                distance * Math.sin(angleInRadians)   // z = 距离 * sin(60°)
              );
              
              this.camera.lookAt(0, 0, 0);

              this.renderer = markRaw(new this.THREE.WebGLRenderer({
                canvas,
                context: gl,
                antialias: true,
                alpha: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false
              }));
              
              // 使用系统像素比
              this.renderer.setPixelRatio(pixelRatio);
              this.renderer.setSize(this.canvasWidth, this.canvasHeight);
              this.renderer.setClearColor(0x000000, 0);
              this.renderer.setClearAlpha(0);
              
              gl.clearColor(0.0, 0.0, 0.0, 0.0);
              gl.clear(gl.COLOR_BUFFER_BIT);
              
              resolve();
            } catch (error) {
              console.error('THREE.js initialization error:', error);
              reject(error);
            }
          });
      });
    },

    createDiceCup() {
      const material = markRaw(new this.THREE.MeshPhongMaterial({
        color: 0xB0E2FF,
        transparent: false,
        side: this.THREE.DoubleSide,
        shininess: 0,        
        specular: 0x000000,  
        flatShading: false,  
      }));
      
      // 修改骰蛊尺寸
      const topRadius = 2.2;     // 稍微增大顶部半径
      const bottomRadius = 2.8;  // 稍微增大底部半径
      const height = 5;         // 增加高度 (原来是4)
      const segments = 32;
      
      const bodyGeometry = markRaw(new this.THREE.CylinderGeometry(
        topRadius,
        bottomRadius,
        height,
        segments,
        1,
        true
      ));
      
      // 更新顶部盖子尺寸
      const lidGeometry = markRaw(new this.THREE.CircleGeometry(
        topRadius,
        segments
      ));
      
      // 创建骰蛊主体和盖子
      const body = markRaw(new this.THREE.Mesh(bodyGeometry, material));
      const lid = markRaw(new this.THREE.Mesh(lidGeometry, material));
      
      // 将盖子放在正确的位置
      lid.position.y = height/2;
      lid.rotation.x = -Math.PI/2;
      
      // 创建一个组来包含主体和盖子
      this.diceCup = markRaw(new this.THREE.Group());
      this.diceCup.add(body);
      this.diceCup.add(lid);
      
      // 修改：调整整体位置
      this.diceCup.position.y = 0;  // 向上移动 (原来是-1)
      this.diceCup.position.z = 0;
      this.diceCup.rotation.x = 0;
      
      this.diceCup.userData = {
        pivotPoint: {
          y: 0,  // 更新 pivotPoint 的 y 值 (原来是-1)
          z: 0
        }
      };
      
      this.scene.add(this.diceCup);
    },

    animate() {
      const animate = () => {
        if (this.renderer && this.scene && this.camera) {
          // 更新光照位置，创造细微的光照变化
          const time = Date.now() * 0.001;
          const radius = 0.2;
          if (this.scene.children) {
            this.scene.children.forEach(child => {
              if (child instanceof this.THREE.DirectionalLight) {
                // 让光源位置轻微摆动
                const originalX = child.position.x;
                const originalZ = child.position.z;
                child.position.x = originalX + Math.sin(time) * radius;
                child.position.z = originalZ + Math.cos(time) * radius;
              }
            });
          }
          
          this.renderer.render(this.scene, this.camera);
        }
        
        if (this.canvas) {
          this.canvas.requestAnimationFrame(animate);
        }
      };

      if (this.canvas) {
        this.canvas.requestAnimationFrame(animate);
      }
    },

    onTouchStart(e) {
      if (!this.diceCup || !this.diceCup.userData || !this.diceCup.userData.pivotPoint) {
        // 确保 pivotPoint 存在
        if (this.diceCup) {
          this.diceCup.userData = {
            pivotPoint: {
              y: 0,
              z: 0
            }
          };
        }
      }
      
      this.isDragging = true;
      this.previousTouch = e.touches[0];
      this.startTouch = e.touches[0];
      
      // 记录开始时的骰盅旋转状态
      if (this.diceCup) {
        this.startRotation = {
          x: this.diceCup.rotation.x,
          z: this.diceCup.rotation.z
        };
      }
    },

    onTouchMove(e) {
      if (!this.isDragging || !this.previousTouch || !this.diceCup) return;
      
      const touch = e.touches[0];
      const deltaY = this.startTouch.pageY - touch.pageY;
      const progress = Math.min(Math.max(deltaY * 0.003, 0), 1);
      const maxRotation = Math.PI/4;
      this.diceCup.rotation.x = -Math.PI/12 - maxRotation * progress;
      
      const radius = 3.5;
      const angle = maxRotation * progress;
      const offsetY = radius * (1 - Math.cos(angle));
      
      this.diceCup.position.y = this.diceCup.userData.pivotPoint.y + offsetY;
      
      // 修改：增加骰子前移的距离
      if (this.dices && this.dices.length > 0) {
        const zOffset = progress * 2.5; // 增加到2.5个单位 (原来是1.5)
        this.dices.forEach(dice => {
          dice.position.z = dice.userData.originalZ + zOffset;
        });
      }
      
      this.previousTouch = touch;
    },

    onTouchEnd() {
      if (this.diceCup) {
        // 如果没有揭开足够角度，就回到原位
        if (this.diceCup.rotation.x > -Math.PI/12 - Math.PI/4) {
          this.animateClose();
        }
      }
      
      this.isDragging = false;
      this.previousTouch = null;
      this.startTouch = null;
    },

    animateClose() {
      if (!this.diceCup || !this.diceCup.userData.pivotPoint) {
        this.diceCup.userData.pivotPoint = {
          y: 0,
          z: 0
        };
      }

      const startPosY = this.diceCup.position.y;
      const startRotX = this.diceCup.rotation.x;
      const pivotPoint = this.diceCup.userData.pivotPoint;
      let progress = 0;
      
      const closeAnimation = () => {
        progress += 0.08;
        if (progress < 1) {
          const t = 1 - Math.pow(1 - progress, 3);
          
          const newPosY = startPosY + (pivotPoint.y - startPosY) * t;
          this.diceCup.position.y = newPosY;
          this.diceCup.rotation.x = startRotX + (-Math.PI/12 - startRotX) * t;
          
          // 修改：使用相同的前移距离
          if (this.dices && this.dices.length > 0) {
            const remainingProgress = 1 - t;
            this.dices.forEach(dice => {
              const zOffset = remainingProgress * 2.5; // 与 onTouchMove 保持一致
              dice.position.z = dice.userData.originalZ + zOffset;
            });
          }
          
          if (this.canvas) {
            this.canvas.requestAnimationFrame(closeAnimation);
          }
        } else {
          this.diceCup.position.y = pivotPoint.y;
          this.diceCup.rotation.x = -Math.PI/12;
          
          // 添加：确保骰子完全回到原始位置
          if (this.dices && this.dices.length > 0) {
            this.dices.forEach(dice => {
              dice.position.z = dice.userData.originalZ;
            });
          }
        }
      };
      
      if (this.canvas) {
        this.canvas.requestAnimationFrame(closeAnimation);
      }
    },

    async loadTextures() {
      this.textureLoader = markRaw(new this.THREE.TextureLoader());
      
      try {
        // 加载骰蛊纹理
        const woodTexture = await new Promise((resolve) => {
          this.textureLoader.load('/static/images/game1/tougu.png', (texture) => {
            texture.wrapS = this.THREE.RepeatWrapping;
            texture.wrapT = this.THREE.RepeatWrapping;
            texture.repeat.set(1, 1);  // 可以根据需要调整重复次数
            resolve(markRaw(texture));
          });
        });
        this.woodTexture = woodTexture;

        // 分别加载骰子纹理
        this.diceTextures = [];
        for (let i = 0; i < 6; i++) {
          const texture = await new Promise((resolve) => {
            this.textureLoader.load(`/static/images/game1/dice${i + 1}.png`, (texture) => {
              resolve(markRaw(texture));
            });
          });
          this.diceTextures.push(texture);
        }
      } catch (error) {
        console.error('Error loading textures:', error);
      }
    },

    createDices() {
      const materials = this.diceTextures.map(texture => {
        return markRaw(new this.THREE.MeshPhongMaterial({ 
          map: texture,
          transparent: false,    // 改为 false，禁用透明
          opacity: 1,          
          shininess: 70,       
          specular: 0x444444,
          depthWrite: true,     // 启用深度写入
          depthTest: true,      // 启用深度测试
        }));
      });
      
      const diceSize = 0.6;
      const geometry = markRaw(new this.THREE.BoxGeometry(diceSize, diceSize, diceSize));
      geometry.computeBoundingBox();
      
      // 计算骰子分布位置
      const positions = this.calculateDicePositions(this.diceCount, diceSize);
      
      this.dices = [];
      const baseY = -2.5;

      // 创建骰子并放置在计算好的位置上
      for (let i = 0; i < this.diceCount; i++) {
        const dice = markRaw(new this.THREE.Mesh(geometry, materials));
        const pos = positions[i];
        
        dice.position.set(pos.x, baseY, pos.z);
        dice.rotation.y = Math.random() * Math.PI * 2;
        
        // 保存原始位置
        dice.userData = {
          originalX: dice.position.x,
          originalY: dice.position.y,
          originalZ: dice.position.z
        };
        
        this.dices.push(dice);
        this.scene.add(dice);
      }
    },

    calculateDicePositions(count, diceSize) {
      const positions = [];
      const spacing = diceSize * 1.2; // 在骰子之间留出20%的间距
      const maxRadius = 2.0; // 最大分布半径
      
      if (count === 1) {
        positions.push({ x: 0, z: 0 });
      } else if (count <= 6) {
        // 单圈分布
        const radius = Math.min(maxRadius, spacing);
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius
          });
        }
      } else {
        // 双圈分布
        const innerCount = Math.floor(count / 2);
        const outerCount = count - innerCount;
        
        // 内圈
        const innerRadius = spacing;
        for (let i = 0; i < innerCount; i++) {
          const angle = (i / innerCount) * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * innerRadius,
            z: Math.sin(angle) * innerRadius
          });
        }
        
        // 外圈
        const outerRadius = spacing * 2;
        for (let i = 0; i < outerCount; i++) {
          const angle = (i / outerCount) * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * outerRadius,
            z: Math.sin(angle) * outerRadius
          });
        }
      }
      
      return positions;
    },

    randomizeDice() {
      const baseY = -2.5;
      const positions = this.calculateDicePositions(this.dices.length, 0.6);
      
      // 打乱位置数组
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // 重新分配骰子位置
      for (let i = 0; i < this.dices.length; i++) {
        const dice = this.dices[i];
        const pos = positions[i];
        
        dice.position.set(pos.x, baseY, pos.z);
        
        // 随机选择要朝上的面（1-6）
        const face = Math.floor(Math.random() * 6) + 1;
        
        // 重置旋转
        dice.rotation.set(0, 0, 0);
        
        // 根据选择的面设置标准90度旋转
        switch(face) {
          case 1: // 1朝上
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 2: // 2朝上
            dice.rotation.x = Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 3: // 3朝上
            dice.rotation.z = -Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 4: // 4朝上
            dice.rotation.z = Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 5: // 5朝上
            dice.rotation.x = -Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 6: // 6朝上
            dice.rotation.x = Math.PI;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
        }
        
        // 更新原始位置
        dice.userData.originalX = dice.position.x;
        dice.userData.originalZ = dice.position.z;
      }
    },

    shakeDiceCup() {
      if (this.diceCup && !this.isShaking) {
        this.isShaking = true;
        let startTime = Date.now();
        const duration = 1000;
        const amplitude = 1.5;
        const frequency = 8;
        
        const shakeAnimation = () => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          if (progress < 1) {
            // 使用衰减的正弦函数创建摇动效果
            const decay = 1 - progress; // 随时间衰减
            const offset = Math.sin(progress * Math.PI * frequency) * amplitude * decay;
            
            // 应用左右摇动
            this.diceCup.position.x = offset;
            
            // 添加轻微的旋转效果
            this.diceCup.rotation.z = -offset * 0.1;
            
            // 更新骰子位置
            this.dices.forEach(dice => {
              // 计算新位置
              let newX = dice.userData.originalX + offset;
              let newZ = dice.userData.originalZ;
              
              // 检查是否超出骰蛊底部范围
              const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ);
              if (distanceFromCenter > 2.4) {
                // 如果超出范围，将位置调整到边界上
                const angle = Math.atan2(newZ, newX);
                newX = Math.cos(angle) * 2.4;
                newZ = Math.sin(angle) * 2.4;
              }
              
              dice.position.x = newX;
              dice.position.z = newZ;
              
              // 添加轻微的旋转
              dice.rotation.x += (Math.random() - 0.5) * 0.1;
              dice.rotation.z += (Math.random() - 0.5) * 0.1;
            });
            
            if (this.canvas) {
              this.canvas.requestAnimationFrame(shakeAnimation);
            }
          } else {
            // 动画结束，恢复原位
            this.diceCup.position.x = 0;
            this.diceCup.rotation.z = 0;
            this.isShaking = false;
            
            // 重新随机化骰子位置
            this.randomizeDice();
          }
        };
        
        if (this.canvas) {
          this.canvas.requestAnimationFrame(shakeAnimation);
        }
      }
    },

    showDiceOptions() {
      this.showOptions = true;
    },

    selectDiceCount(count) {
      this.diceCount = count;
      this.showOptions = false;
      // 重新创建骰子
      if (this.dices.length > 0) {
        this.dices.forEach(dice => {
          if (dice && this.scene) {
            this.scene.remove(dice);
          }
        });
        this.dices = [];
      }
      this.createDices();
    },

    initScene() {
      return new Promise((resolve, reject) => {
        try {
          const query = uni.createSelectorQuery().in(this);
          query.select('#webgl').boundingClientRect(data => {
            const { width, height } = data;
            
            this.scene = markRaw(new this.THREE.Scene());
            
            this.camera = markRaw(new this.THREE.PerspectiveCamera(
              45,
              width / height,
              0.1,
              1000
            ));
            
            // 恢复到最初能正常工作的相机位置
            this.camera.position.set(0, 0, 8);    // 恢复原始位置
            this.camera.lookAt(0, 0, 0);          // 恢复原始观察点
            
            const ambientLight = new this.THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            
            const directionalLight = new this.THREE.DirectionalLight(0xffffff, 0.6);
            directionalLight.position.set(2, 4, 1);
            this.scene.add(directionalLight);
            
            this.initRenderer(width, height);
            
            resolve();
          }).exec();
        } catch (error) {
          reject(error);
        }
      });
    },

    goBack() {
      uni.navigateBack();
    },
  }
}
</script>

<style>
/* 页面容器 */
.page-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

/* 游戏容器 */
.game-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    180deg, 
    #B0E2FF 0%, 
    #FFFFFF 25%, 
    #FFFFFF 55%, 
    #B0E2FF 100%
  );
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 0;
}

/* Canvas 相关样式 */
.canvas-container {
  width: 100%;
  height: 75vh;
  position: relative;
  background: transparent;
}

.dice-canvas {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
}

/* 弹窗层 */
.modal-layer {
  position: absolute;
  left: 0;
  bottom: 20vh;
  width: 100%;
  height: auto;
  z-index: 100000;
}

.modal-overlay {
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: modalShow 0.3s ease;
  width: 600rpx; /* 固定宽度 */
}

.modal-options-container {
  padding: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-around; /* 均匀分布 */
  align-items: center;
  width: 100%;
}

.modal-option {
  padding: 20rpx;
  width: 80rpx; /* 固定宽度 */
  text-align: center;
  font-size: 36rpx;
  color: #333333;
  transition: all 0.2s;
  border-radius: 8rpx;
  flex-shrink: 0; /* 防止压缩 */
}

.modal-option:active {
  background-color: #F5F5F5;
  transform: scale(0.95);
}

.modal-option.active {
  color: #4682B4;
  font-weight: bold;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮容器 */
.button-container {
  width: 100%;
  height: 25vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30rpx;
  position: relative;
  z-index: 1;
}

/* 其他样式保持不变 */
.dice-count-selector,
.shake-button {
  background: #FFFFFF;
  color: #333333;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.shake-button {
  padding: 15px 40px;
}

.dice-count-selector:active,
.shake-button:active {
  transform: scale(0.95);
  background: #F5F5F5;
}

/* 添加返回按钮样式 */
.back-button {
  position: fixed;
  top: 40px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 28rpx;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button:active {
  transform: scale(0.95);
  background: #F5F5F5;
}
</style>