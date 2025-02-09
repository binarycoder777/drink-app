"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const diceCount = common_vendor.ref(3);
    const showOptions = common_vendor.ref(false);
    return {
      diceCount,
      showOptions
    };
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
      woodTexture: null
    };
  },
  async mounted() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const sysInfo = common_vendor.index.getSystemInfoSync();
      this.canvasWidth = sysInfo.windowWidth;
      this.canvasHeight = sysInfo.windowHeight;
      const query = common_vendor.index.createSelectorQuery().in(this);
      const canvas = await new Promise((resolve, reject) => {
        query.select("#dice-container").node().exec((res) => {
          if (res[0] && res[0].node) {
            resolve(res[0].node);
          } else {
            reject(new Error("Canvas element not found"));
          }
        });
      });
      this.canvas = common_vendor.markRaw(canvas);
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });
      if (!gl) {
        throw new Error("WebGL context not available");
      }
      console.log("WebGL Context Attributes:", gl.getContextAttributes());
      console.log("Canvas:", {
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
      console.error("Initialization error:", error);
    }
  },
  methods: {
    initThreeJS() {
      return new Promise((resolve, reject) => {
        const query = common_vendor.index.createSelectorQuery().in(this);
        query.select("#dice-container").node().exec((res) => {
          if (!res[0] || !res[0].node) {
            reject(new Error("Canvas element not found"));
            return;
          }
          const canvas = common_vendor.markRaw(res[0].node);
          this.canvas = canvas;
          const sysInfo = common_vendor.index.getSystemInfoSync();
          const pixelRatio = sysInfo.pixelRatio || 1;
          this.canvasHeight = this.canvasHeight * 0.75;
          canvas.width = this.canvasWidth * pixelRatio;
          canvas.height = this.canvasHeight * pixelRatio;
          const gl = canvas.getContext("webgl", {
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false
          });
          console.log("WebGL Context Attributes:", gl.getContextAttributes());
          console.log("Canvas:", {
            width: canvas.width,
            height: canvas.height,
            style: canvas.style
          });
          try {
            this.THREE = common_vendor.markRaw(common_vendor.dist.createScopedThreejs(canvas));
            this.scene = common_vendor.markRaw(new this.THREE.Scene());
            console.log("THREE.js Scene:", {
              background: this.scene.background,
              children: this.scene.children.length
            });
            this.scene.background = null;
            const ambientLight = common_vendor.markRaw(new this.THREE.AmbientLight(16777215, 0.7));
            this.scene.add(ambientLight);
            const mainLight = common_vendor.markRaw(new this.THREE.DirectionalLight(16777215, 0.3));
            mainLight.position.set(0, 8, 4);
            this.scene.add(mainLight);
            this.camera = common_vendor.markRaw(new this.THREE.PerspectiveCamera(
              45,
              // 视角
              this.canvasWidth / this.canvasHeight,
              0.1,
              1e3
            ));
            const distance = 12;
            const angleInRadians = Math.PI * 60 / 180;
            this.camera.position.set(
              0,
              // x = 0 保持正对
              distance * Math.cos(angleInRadians),
              // y = 距离 * cos(60°)
              distance * Math.sin(angleInRadians)
              // z = 距离 * sin(60°)
            );
            this.camera.lookAt(0, 0, 0);
            this.renderer = common_vendor.markRaw(new this.THREE.WebGLRenderer({
              canvas,
              context: gl,
              antialias: true,
              alpha: true,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false
            }));
            this.renderer.setPixelRatio(pixelRatio);
            this.renderer.setSize(this.canvasWidth, this.canvasHeight);
            this.renderer.setClearColor(0, 0);
            this.renderer.setClearAlpha(0);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            resolve();
          } catch (error) {
            console.error("THREE.js initialization error:", error);
            reject(error);
          }
        });
      });
    },
    createDiceCup() {
      const material = common_vendor.markRaw(new this.THREE.MeshPhongMaterial({
        color: 11592447,
        transparent: false,
        side: this.THREE.DoubleSide,
        shininess: 0,
        specular: 0,
        flatShading: false
      }));
      const topRadius = 2.2;
      const bottomRadius = 2.8;
      const height = 5;
      const segments = 32;
      const bodyGeometry = common_vendor.markRaw(new this.THREE.CylinderGeometry(
        topRadius,
        bottomRadius,
        height,
        segments,
        1,
        true
      ));
      const lidGeometry = common_vendor.markRaw(new this.THREE.CircleGeometry(
        topRadius,
        segments
      ));
      const body = common_vendor.markRaw(new this.THREE.Mesh(bodyGeometry, material));
      const lid = common_vendor.markRaw(new this.THREE.Mesh(lidGeometry, material));
      lid.position.y = height / 2;
      lid.rotation.x = -Math.PI / 2;
      this.diceCup = common_vendor.markRaw(new this.THREE.Group());
      this.diceCup.add(body);
      this.diceCup.add(lid);
      this.diceCup.position.y = 0;
      this.diceCup.position.z = 0;
      this.diceCup.rotation.x = 0;
      this.diceCup.userData = {
        pivotPoint: {
          y: 0,
          // 更新 pivotPoint 的 y 值 (原来是-1)
          z: 0
        }
      };
      this.scene.add(this.diceCup);
    },
    animate() {
      const animate = () => {
        if (this.renderer && this.scene && this.camera) {
          const time = Date.now() * 1e-3;
          const radius = 0.2;
          if (this.scene.children) {
            this.scene.children.forEach((child) => {
              if (child instanceof this.THREE.DirectionalLight) {
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
      if (this.diceCup) {
        this.startRotation = {
          x: this.diceCup.rotation.x,
          z: this.diceCup.rotation.z
        };
      }
    },
    onTouchMove(e) {
      if (!this.isDragging || !this.previousTouch || !this.diceCup)
        return;
      const touch = e.touches[0];
      const deltaY = this.startTouch.pageY - touch.pageY;
      const progress = Math.min(Math.max(deltaY * 3e-3, 0), 1);
      const maxRotation = Math.PI / 4;
      this.diceCup.rotation.x = -Math.PI / 12 - maxRotation * progress;
      const radius = 3.5;
      const angle = maxRotation * progress;
      const offsetY = radius * (1 - Math.cos(angle));
      this.diceCup.position.y = this.diceCup.userData.pivotPoint.y + offsetY;
      if (this.dices && this.dices.length > 0) {
        const zOffset = progress * 2.5;
        this.dices.forEach((dice) => {
          dice.position.z = dice.userData.originalZ + zOffset;
        });
      }
      this.previousTouch = touch;
    },
    onTouchEnd() {
      if (this.diceCup) {
        if (this.diceCup.rotation.x > -Math.PI / 12 - Math.PI / 4) {
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
          this.diceCup.rotation.x = startRotX + (-Math.PI / 12 - startRotX) * t;
          if (this.dices && this.dices.length > 0) {
            const remainingProgress = 1 - t;
            this.dices.forEach((dice) => {
              const zOffset = remainingProgress * 2.5;
              dice.position.z = dice.userData.originalZ + zOffset;
            });
          }
          if (this.canvas) {
            this.canvas.requestAnimationFrame(closeAnimation);
          }
        } else {
          this.diceCup.position.y = pivotPoint.y;
          this.diceCup.rotation.x = -Math.PI / 12;
          if (this.dices && this.dices.length > 0) {
            this.dices.forEach((dice) => {
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
      this.textureLoader = common_vendor.markRaw(new this.THREE.TextureLoader());
      try {
        const woodTexture = await new Promise((resolve) => {
          this.textureLoader.load("/static/images/game1/tougu.png", (texture) => {
            texture.wrapS = this.THREE.RepeatWrapping;
            texture.wrapT = this.THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            resolve(common_vendor.markRaw(texture));
          });
        });
        this.woodTexture = woodTexture;
        this.diceTextures = [];
        for (let i = 0; i < 6; i++) {
          const texture = await new Promise((resolve) => {
            this.textureLoader.load(`/static/images/game1/dice${i + 1}.png`, (texture2) => {
              resolve(common_vendor.markRaw(texture2));
            });
          });
          this.diceTextures.push(texture);
        }
      } catch (error) {
        console.error("Error loading textures:", error);
      }
    },
    createDices() {
      const materials = this.diceTextures.map((texture) => {
        return common_vendor.markRaw(new this.THREE.MeshPhongMaterial({
          map: texture,
          transparent: false,
          // 改为 false，禁用透明
          opacity: 1,
          shininess: 70,
          specular: 4473924,
          depthWrite: true,
          // 启用深度写入
          depthTest: true
          // 启用深度测试
        }));
      });
      const diceSize = 0.6;
      const geometry = common_vendor.markRaw(new this.THREE.BoxGeometry(diceSize, diceSize, diceSize));
      geometry.computeBoundingBox();
      const positions = this.calculateDicePositions(this.diceCount, diceSize);
      this.dices = [];
      const baseY = -2.5;
      for (let i = 0; i < this.diceCount; i++) {
        const dice = common_vendor.markRaw(new this.THREE.Mesh(geometry, materials));
        const pos = positions[i];
        dice.position.set(pos.x, baseY, pos.z);
        dice.rotation.y = Math.random() * Math.PI * 2;
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
      const spacing = diceSize * 1.2;
      const maxRadius = 2;
      if (count === 1) {
        positions.push({ x: 0, z: 0 });
      } else if (count <= 6) {
        const radius = Math.min(maxRadius, spacing);
        for (let i = 0; i < count; i++) {
          const angle = i / count * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius
          });
        }
      } else {
        const innerCount = Math.floor(count / 2);
        const outerCount = count - innerCount;
        const innerRadius = spacing;
        for (let i = 0; i < innerCount; i++) {
          const angle = i / innerCount * Math.PI * 2;
          positions.push({
            x: Math.cos(angle) * innerRadius,
            z: Math.sin(angle) * innerRadius
          });
        }
        const outerRadius = spacing * 2;
        for (let i = 0; i < outerCount; i++) {
          const angle = i / outerCount * Math.PI * 2;
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
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }
      for (let i = 0; i < this.dices.length; i++) {
        const dice = this.dices[i];
        const pos = positions[i];
        dice.position.set(pos.x, baseY, pos.z);
        const face = Math.floor(Math.random() * 6) + 1;
        dice.rotation.set(0, 0, 0);
        switch (face) {
          case 1:
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 2:
            dice.rotation.x = Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 3:
            dice.rotation.z = -Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 4:
            dice.rotation.z = Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 5:
            dice.rotation.x = -Math.PI * 0.5;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
          case 6:
            dice.rotation.x = Math.PI;
            dice.rotation.y = Math.PI * 0.5 * Math.floor(Math.random() * 4);
            break;
        }
        dice.userData.originalX = dice.position.x;
        dice.userData.originalZ = dice.position.z;
      }
    },
    shakeDiceCup() {
      if (this.diceCup && !this.isShaking) {
        this.isShaking = true;
        let startTime = Date.now();
        const duration = 1e3;
        const amplitude = 1.5;
        const frequency = 8;
        const shakeAnimation = () => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          if (progress < 1) {
            const decay = 1 - progress;
            const offset = Math.sin(progress * Math.PI * frequency) * amplitude * decay;
            this.diceCup.position.x = offset;
            this.diceCup.rotation.z = -offset * 0.1;
            this.dices.forEach((dice) => {
              let newX = dice.userData.originalX + offset;
              let newZ = dice.userData.originalZ;
              const distanceFromCenter = Math.sqrt(newX * newX + newZ * newZ);
              if (distanceFromCenter > 2.4) {
                const angle = Math.atan2(newZ, newX);
                newX = Math.cos(angle) * 2.4;
                newZ = Math.sin(angle) * 2.4;
              }
              dice.position.x = newX;
              dice.position.z = newZ;
              dice.rotation.x += (Math.random() - 0.5) * 0.1;
              dice.rotation.z += (Math.random() - 0.5) * 0.1;
            });
            if (this.canvas) {
              this.canvas.requestAnimationFrame(shakeAnimation);
            }
          } else {
            this.diceCup.position.x = 0;
            this.diceCup.rotation.z = 0;
            this.isShaking = false;
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
      if (this.dices.length > 0) {
        this.dices.forEach((dice) => {
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
          const query = common_vendor.index.createSelectorQuery().in(this);
          query.select("#webgl").boundingClientRect((data) => {
            const { width, height } = data;
            this.scene = common_vendor.markRaw(new this.THREE.Scene());
            this.camera = common_vendor.markRaw(new this.THREE.PerspectiveCamera(
              45,
              width / height,
              0.1,
              1e3
            ));
            this.camera.position.set(0, 0, 8);
            this.camera.lookAt(0, 0, 0);
            const ambientLight = new this.THREE.AmbientLight(16777215, 0.6);
            this.scene.add(ambientLight);
            const directionalLight = new this.THREE.DirectionalLight(16777215, 0.6);
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
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.onTouchStart && $options.onTouchStart(...args)),
    c: common_vendor.o((...args) => $options.onTouchMove && $options.onTouchMove(...args)),
    d: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
    e: $setup.showOptions
  }, $setup.showOptions ? {
    f: common_vendor.f(6, (n, k0, i0) => {
      return {
        a: common_vendor.t(n),
        b: n,
        c: $setup.diceCount === n ? 1 : "",
        d: common_vendor.o(($event) => $options.selectDiceCount(n), n)
      };
    }),
    g: common_vendor.o(() => {
    }),
    h: common_vendor.o(($event) => $setup.showOptions = false)
  } : {}, {
    i: common_vendor.t($setup.diceCount),
    j: common_vendor.o((...args) => $options.showDiceOptions && $options.showDiceOptions(...args)),
    k: common_vendor.o((...args) => $options.shakeDiceCup && $options.shakeDiceCup(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/weitao/Desktop/ThinGift/drink-app/pages/game/game1.vue"]]);
wx.createPage(MiniProgramPage);
