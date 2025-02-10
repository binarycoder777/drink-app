"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isSpinning: false,
      wheelRotation: 0,
      spinHistory: [],
      prizes: [
        "喝一杯",
        "喝两杯",
        "指定一人",
        "大家喝",
        "讲个笑话",
        "真心话",
        "大冒险",
        "下局请客"
      ],
      ctx: null,
      sectorOffset: 0,
      lastRotation: 0,
      // 记录上一次的旋转角度
      showSettingsModal: false,
      editablePrizes: []
      // 用于编辑的临时数组
    };
  },
  created() {
    this.sectorOffset = 360 / this.prizes.length / 2;
  },
  onReady() {
    console.log("Component ready, attempting to initialize canvas...");
    setTimeout(() => {
      this.initCanvas();
    }, 100);
  },
  methods: {
    initCanvas() {
      console.log("Initializing canvas...");
      const query = common_vendor.index.createSelectorQuery();
      query.select("#wheelCanvas").fields({ node: true, size: true }).exec((res) => {
        console.log("MP Canvas query result:", res);
        if (res[0]) {
          const canvas = res[0].node;
          this.ctx = canvas.getContext("2d");
          const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          this.ctx.scale(dpr, dpr);
          console.log("MP Canvas context obtained");
          this.render();
        } else {
          console.error("Failed to get canvas node");
        }
      });
    },
    render() {
      if (!this.ctx)
        return;
      const renderFrame = () => {
        this.ctx.clearRect(0, 0, 300, 300);
        this.drawWheel();
        this.drawPointer();
      };
      renderFrame();
    },
    drawWheel() {
      if (!this.ctx) {
        console.error("Canvas context not available");
        return;
      }
      const ctx = this.ctx;
      const centerX = 150;
      const centerY = 150;
      const radius = 140;
      ctx.clearRect(0, 0, 300, 300);
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 10,
        centerX,
        centerY,
        radius + 10
      );
      outerGlow.addColorStop(0, "rgba(255, 0, 222, 0.5)");
      outerGlow.addColorStop(1, "rgba(255, 0, 222, 0)");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, 300, 300);
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      bgGradient.addColorStop(0, "#2B0B3A");
      bgGradient.addColorStop(1, "#1A0B2E");
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = bgGradient;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff00de";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ff00de";
      ctx.shadowBlur = 15;
      ctx.stroke();
      this.prizes.forEach((prize, index) => {
        const startAngle = index * 2 * Math.PI / this.prizes.length;
        const endAngle = (index + 1) * 2 * Math.PI / this.prizes.length;
        const sectorGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        if (index % 2 === 0) {
          sectorGradient.addColorStop(0, "rgba(255, 0, 222, 0.2)");
          sectorGradient.addColorStop(1, "rgba(255, 0, 222, 0.6)");
        } else {
          sectorGradient.addColorStop(0, "rgba(0, 247, 255, 0.2)");
          sectorGradient.addColorStop(1, "rgba(0, 247, 255, 0.6)");
        }
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
        ctx.fillStyle = sectorGradient;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(startAngle) * radius,
          centerY + Math.sin(startAngle) * radius
        );
        ctx.strokeStyle = index % 2 === 0 ? "#ff00de" : "#00f7ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = index % 2 === 0 ? "#ff00de" : "#00f7ff";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + Math.PI / this.prizes.length);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = index % 2 === 0 ? "#ff00de" : "#00f7ff";
        ctx.shadowBlur = 15;
        ctx.fillText(prize, radius * 0.65, 0);
        ctx.restore();
      });
    },
    drawPointer() {
      if (!this.ctx)
        return;
      const ctx = this.ctx;
      const centerX = 150;
      const centerY = 150;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(this.wheelRotation * Math.PI / 180);
      ctx.shadowColor = "#00f7ff";
      ctx.shadowBlur = 20;
      const pointerGradient = ctx.createLinearGradient(0, 0, 70, 0);
      pointerGradient.addColorStop(0, "rgba(0, 247, 255, 1)");
      pointerGradient.addColorStop(0.7, "rgba(0, 247, 255, 0.8)");
      pointerGradient.addColorStop(1, "rgba(0, 247, 255, 0.6)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(75, 0);
      ctx.lineWidth = 3;
      ctx.strokeStyle = pointerGradient;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(75, 0);
      ctx.lineTo(65, -6);
      ctx.lineTo(70, 0);
      ctx.lineTo(65, 6);
      ctx.closePath();
      ctx.fillStyle = "#00f7ff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff00de";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ff00de";
      ctx.shadowBlur = 15;
      ctx.stroke();
      const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
      centerGradient.addColorStop(0, "#ff00de");
      centerGradient.addColorStop(1, "#ff69b4");
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = centerGradient;
      ctx.fill();
      ctx.restore();
    },
    startSpin() {
      if (this.isSpinning || !this.ctx)
        return;
      this.isSpinning = true;
      const baseSpins = 5;
      const randomSpins = Math.floor(Math.random() * 3) + 3;
      const randomPrize = Math.floor(Math.random() * this.prizes.length);
      const currentRotation = this.wheelRotation % 360;
      const targetSector = 360 / this.prizes.length * randomPrize + this.sectorOffset;
      let additionalRotation = 0;
      if (targetSector <= currentRotation) {
        additionalRotation = 360 - (currentRotation - targetSector);
      } else {
        additionalRotation = targetSector - currentRotation;
      }
      const totalRotation = this.wheelRotation + // 当前累积角度
      (baseSpins + randomSpins) * 360 + // 基础旋转
      additionalRotation;
      const duration = 6e3;
      const start = Date.now();
      const startRotation = this.wheelRotation;
      const rotationDiff = totalRotation - startRotation;
      const animate = () => {
        const now = Date.now();
        const timePassed = now - start;
        if (timePassed >= duration) {
          this.isSpinning = false;
          this.wheelRotation = totalRotation;
          this.lastRotation = totalRotation;
          this.spinHistory.unshift(this.prizes[randomPrize]);
          if (this.spinHistory.length > 5)
            this.spinHistory.pop();
          this.render();
          setTimeout(() => {
            common_vendor.index.showToast({
              title: `🎉 ${this.prizes[randomPrize]} 🎉`,
              icon: "none",
              duration: 2e3
            });
          }, 500);
          return;
        }
        const progress = timePassed / duration;
        let easeOut;
        if (progress < 0.2) {
          easeOut = Math.pow(progress / 0.2, 2);
        } else if (progress < 0.6) {
          easeOut = progress;
        } else {
          const p = (progress - 0.6) / 0.4;
          easeOut = 0.6 + 0.4 * (1 - Math.pow(p, 2));
        }
        this.wheelRotation = startRotation + rotationDiff * easeOut;
        this.render();
        setTimeout(animate, 16);
      };
      animate();
    },
    showSettings() {
      this.editablePrizes = [...this.prizes];
      this.showSettingsModal = true;
    },
    saveSettings() {
      this.prizes = this.editablePrizes.filter((prize) => prize.trim() !== "");
      this.showSettingsModal = false;
      this.render();
    },
    cancelSettings() {
      this.showSettingsModal = false;
    },
    addPrize() {
      if (this.editablePrizes.length < 12) {
        this.editablePrizes.push("");
      }
    },
    deletePrize(index) {
      if (this.editablePrizes.length > 4) {
        this.editablePrizes.splice(index, 1);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.showSettingsModal,
    b: common_vendor.t($data.isSpinning ? "HIGH起来..." : $data.ctx ? "开始狂欢" : "初始化中..."),
    c: common_vendor.o((...args) => $options.startSpin && $options.startSpin(...args)),
    d: $data.isSpinning || !$data.ctx,
    e: $data.isSpinning ? 1 : "",
    f: common_vendor.o((...args) => $options.showSettings && $options.showSettings(...args)),
    g: $data.spinHistory.length > 0
  }, $data.spinHistory.length > 0 ? {
    h: common_vendor.f($data.spinHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  } : {}, {
    i: $data.showSettingsModal
  }, $data.showSettingsModal ? common_vendor.e({
    j: common_vendor.f($data.editablePrizes, (prize, index, i0) => {
      return common_vendor.e({
        a: "奖项 " + (index + 1),
        b: $data.editablePrizes[index],
        c: common_vendor.o(($event) => $data.editablePrizes[index] = $event.detail.value, index)
      }, $data.editablePrizes.length > 4 ? {
        d: common_vendor.o(($event) => $options.deletePrize(index), index)
      } : {}, {
        e: index
      });
    }),
    k: $data.editablePrizes.length > 4,
    l: $data.editablePrizes.length < 12
  }, $data.editablePrizes.length < 12 ? {
    m: common_vendor.o((...args) => $options.addPrize && $options.addPrize(...args))
  } : {}, {
    n: common_vendor.o((...args) => $options.saveSettings && $options.saveSettings(...args)),
    o: common_vendor.o((...args) => $options.cancelSettings && $options.cancelSettings(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/weitao/Desktop/ThinGift/drink-app/pages/game/lucky-wheel.vue"]]);
wx.createPage(MiniProgramPage);
