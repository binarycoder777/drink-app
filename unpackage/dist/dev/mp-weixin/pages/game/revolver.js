"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
        query.select("#webgl").node().exec((res) => {
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
      await this.initThree();
      this.animate();
    } catch (error) {
      console.error("Initialization error:", error);
    }
  },
  methods: {
    async initThree() {
      const canvas = this.canvas;
      const sysInfo = common_vendor.index.getSystemInfoSync();
      const pixelRatio = sysInfo.pixelRatio || 1;
      canvas.width = this.canvasWidth * pixelRatio;
      canvas.height = this.canvasHeight * pixelRatio;
      try {
        this.THREE = common_vendor.markRaw(common_vendor.dist.createScopedThreejs(canvas));
        this.scene = common_vendor.markRaw(new this.THREE.Scene());
        this.camera = common_vendor.markRaw(new this.THREE.PerspectiveCamera(
          45,
          this.canvasWidth / this.canvasHeight,
          0.1,
          1e3
        ));
        this.camera.position.set(0, 0.1, 2);
        this.camera.lookAt(0, 0, 0);
        this.renderer = common_vendor.markRaw(new this.THREE.WebGLRenderer({
          canvas,
          context: canvas.getContext("webgl"),
          antialias: true,
          alpha: true
        }));
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.setClearColor(14540253, 0);
        const ambientLight = common_vendor.markRaw(new this.THREE.AmbientLight(16777215, 0.4));
        this.scene.add(ambientLight);
        const mainLight = common_vendor.markRaw(new this.THREE.DirectionalLight(16777215, 0.8));
        mainLight.position.set(2, 2, 2);
        this.scene.add(mainLight);
        const fillLight = common_vendor.markRaw(new this.THREE.DirectionalLight(16777215, 0.4));
        fillLight.position.set(-2, -1, 2);
        this.scene.add(fillLight);
        this.scene.background = new this.THREE.Color(14540253);
        this.createRevolver();
      } catch (error) {
        console.error("THREE.js initialization error:", error);
        throw error;
      }
    },
    createRevolver() {
      const blackMetalMaterial = common_vendor.markRaw(new this.THREE.MeshPhongMaterial({
        color: 2763306,
        shininess: 30,
        specular: 2236962
      }));
      const silverMetalMaterial = common_vendor.markRaw(new this.THREE.MeshPhongMaterial({
        color: 14540253,
        shininess: 50,
        specular: 4473924
      }));
      this.revolver = common_vendor.markRaw(new this.THREE.Group());
      const createRailSystem = () => {
        const railGroup = new this.THREE.Group();
        const railBaseGeometry = common_vendor.markRaw(new this.THREE.BoxGeometry(0.8, 0.05, 0.2));
        const railBase = common_vendor.markRaw(new this.THREE.Mesh(railBaseGeometry, silverMetalMaterial));
        railBase.position.set(0.4, 0.35, 0);
        for (let i = 0; i < 12; i++) {
          const toothGeometry = common_vendor.markRaw(new this.THREE.BoxGeometry(0.03, 0.03, 0.2));
          const tooth = common_vendor.markRaw(new this.THREE.Mesh(toothGeometry, silverMetalMaterial));
          tooth.position.set(0.1 + i * 0.05, 0.38, 0);
          railGroup.add(tooth);
        }
        railGroup.add(railBase);
        return railGroup;
      };
      const createCylinder = () => {
        const cylinderGroup = new this.THREE.Group();
        const cylinderGeometry = common_vendor.markRaw(new this.THREE.CylinderGeometry(0.2, 0.2, 0.35, 24));
        const cylinder2 = common_vendor.markRaw(new this.THREE.Mesh(cylinderGeometry, silverMetalMaterial));
        cylinder2.rotation.z = Math.PI / 2;
        cylinder2.position.set(0.3, 0.12, 0);
        for (let i = 0; i < 8; i++) {
          const grooveGeometry = common_vendor.markRaw(new this.THREE.BoxGeometry(0.35, 0.02, 0.02));
          const groove = common_vendor.markRaw(new this.THREE.Mesh(grooveGeometry, silverMetalMaterial));
          groove.rotation.z = i * Math.PI / 4;
          groove.position.set(0.3, 0.12, 0);
          cylinderGroup.add(groove);
        }
        cylinderGroup.add(cylinder2);
        return cylinderGroup;
      };
      const createFrame = () => {
        const frameGroup = new this.THREE.Group();
        const frameShape = new this.THREE.Shape();
        frameShape.moveTo(0, 0);
        frameShape.lineTo(0.9, 0);
        frameShape.lineTo(0.9, 0.3);
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
        const frame2 = common_vendor.markRaw(new this.THREE.Mesh(
          new this.THREE.ExtrudeGeometry(frameShape, frameExtrudeSettings),
          blackMetalMaterial
        ));
        const textGeometry = common_vendor.markRaw(new this.THREE.BoxGeometry(0.2, 0.01, 0.1));
        const text = common_vendor.markRaw(new this.THREE.Mesh(textGeometry, silverMetalMaterial));
        text.position.set(0.5, 0.2, 0.13);
        frameGroup.add(frame2);
        frameGroup.add(text);
        return frameGroup;
      };
      const createGrip = () => {
        const gripShape = new this.THREE.Shape();
        gripShape.moveTo(0, 0);
        gripShape.lineTo(0.25, 0);
        gripShape.bezierCurveTo(
          0.25,
          -0.3,
          0.2,
          -0.5,
          0.15,
          -0.6
        );
        gripShape.lineTo(0.1, -0.65);
        gripShape.bezierCurveTo(
          0.05,
          -0.7,
          -0.05,
          -0.7,
          -0.1,
          -0.65
        );
        gripShape.lineTo(-0.15, -0.6);
        gripShape.bezierCurveTo(
          -0.2,
          -0.5,
          -0.15,
          -0.2,
          0,
          0
        );
        const grip2 = common_vendor.markRaw(new this.THREE.Mesh(
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
        return grip2;
      };
      const createHammer = () => {
        const hammerGroup = new this.THREE.Group();
        const hammerShape = new this.THREE.Shape();
        hammerShape.moveTo(0, 0);
        hammerShape.lineTo(0.06, 0);
        hammerShape.lineTo(0.06, 0.15);
        hammerShape.lineTo(0.08, 0.18);
        hammerShape.lineTo(0.08, 0.25);
        hammerShape.lineTo(0.03, 0.28);
        hammerShape.lineTo(0, 0.25);
        hammerShape.lineTo(0, 0);
        const hammer2 = common_vendor.markRaw(new this.THREE.Mesh(
          new this.THREE.ExtrudeGeometry(hammerShape, {
            depth: 0.08,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
          }),
          silverMetalMaterial
        ));
        hammer2.position.set(0.1, 0.22, -0.04);
        const hammerPin = common_vendor.markRaw(new this.THREE.Mesh(
          new this.THREE.CylinderGeometry(0.015, 0.015, 0.1, 12),
          silverMetalMaterial
        ));
        hammerPin.rotation.x = Math.PI / 2;
        hammerPin.position.set(0.11, 0.25, 0);
        hammerGroup.add(hammer2);
        hammerGroup.add(hammerPin);
        return hammerGroup;
      };
      const createTrigger = () => {
        const triggerGroup = new this.THREE.Group();
        const guardShape = new this.THREE.Shape();
        guardShape.moveTo(0, 0);
        guardShape.lineTo(0.25, 0);
        guardShape.lineTo(0.25, -0.4);
        guardShape.lineTo(0.15, -0.45);
        guardShape.lineTo(-0.15, -0.45);
        guardShape.lineTo(-0.25, -0.4);
        guardShape.lineTo(-0.25, 0);
        guardShape.lineTo(0, 0);
        const triggerGuard = common_vendor.markRaw(new this.THREE.Mesh(
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
        const triggerShape = new this.THREE.Shape();
        triggerShape.moveTo(0, 0);
        triggerShape.lineTo(0.04, 0);
        triggerShape.lineTo(0.04, -0.15);
        triggerShape.lineTo(0.02, -0.15);
        triggerShape.lineTo(0.02, -0.2);
        triggerShape.lineTo(-0.01, -0.2);
        triggerShape.lineTo(-0.01, -0.15);
        triggerShape.lineTo(0, -0.15);
        triggerShape.lineTo(0, 0);
        const trigger2 = common_vendor.markRaw(new this.THREE.Mesh(
          new this.THREE.ExtrudeGeometry(triggerShape, {
            depth: 0.08,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
          }),
          silverMetalMaterial
        ));
        trigger2.position.set(0.2, -0.1, -0.04);
        const triggerPin = common_vendor.markRaw(new this.THREE.Mesh(
          new this.THREE.CylinderGeometry(0.01, 0.01, 0.17, 8),
          silverMetalMaterial
        ));
        triggerPin.rotation.x = Math.PI / 2;
        triggerPin.position.set(0.2, -0.1, 0);
        triggerGroup.add(triggerGuard);
        triggerGroup.add(trigger2);
        triggerGroup.add(triggerPin);
        return triggerGroup;
      };
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
      const scale = 0.35;
      this.revolver.scale.set(scale, scale, scale);
      this.revolver.position.set(-0.3, 0, 0);
      this.revolver.rotation.y = this.currentRotation.y;
      this.revolver.rotation.x = this.currentRotation.x;
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
      if (this.isSpinning)
        return;
      this.isSpinning = true;
      const rotations = 2 + Math.random() * 4;
      const duration = 2e3;
      const startTime = Date.now();
      const spin = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        if (progress < 1) {
          const angle = rotations * Math.PI * 2 * (1 - Math.pow(1 - progress, 3));
          this.cylinder.rotation.x = angle;
          this.canvas.requestAnimationFrame(spin);
        } else {
          this.isSpinning = false;
          this.currentChamber = Math.floor(Math.random() * 6);
          common_vendor.index.showToast({
            title: "弹仓已旋转",
            icon: "none"
          });
        }
      };
      spin();
    },
    pullTrigger() {
      if (this.isSpinning)
        return;
      if (this.bullets[this.currentChamber]) {
        common_vendor.index.showToast({
          title: "砰！",
          icon: "none"
        });
      } else {
        common_vendor.index.showToast({
          title: "咔！",
          icon: "none"
        });
      }
      this.currentChamber = (this.currentChamber + 1) % 6;
    },
    onTouchStart(event) {
      this.isDragging = true;
      const touch = event.touches[0];
      this.previousTouch.x = touch.clientX;
      this.previousTouch.y = touch.clientY;
    },
    onTouchMove(event) {
      if (!this.isDragging)
        return;
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.previousTouch.x;
      const deltaY = touch.clientY - this.previousTouch.y;
      this.currentRotation.y += deltaX * this.rotationSpeed;
      this.currentRotation.x += deltaY * this.rotationSpeed;
      this.currentRotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.currentRotation.x));
      if (this.revolver) {
        this.revolver.rotation.y = this.currentRotation.y;
        this.revolver.rotation.x = this.currentRotation.x;
      }
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
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.onTouchStart && $options.onTouchStart(...args)),
    b: common_vendor.o((...args) => $options.onTouchMove && $options.onTouchMove(...args)),
    c: common_vendor.o((...args) => $options.onTouchEnd && $options.onTouchEnd(...args)),
    d: common_vendor.o((...args) => $options.spinCylinder && $options.spinCylinder(...args)),
    e: common_vendor.o((...args) => $options.pullTrigger && $options.pullTrigger(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/weitao/Desktop/ThinGift/drink-app/pages/game/revolver.vue"]]);
wx.createPage(MiniProgramPage);
