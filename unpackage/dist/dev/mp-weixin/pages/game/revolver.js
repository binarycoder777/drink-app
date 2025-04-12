"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      revolverImage: "/static/images/revolver-body.png",
      resultText: "准备开始游戏",
      chambers: Array(6).fill().map(() => ({ loaded: false })),
      currentChamber: 0,
      isSpinning: false,
      isFiring: false,
      isDanger: false,
      showBulletOptions: false,
      bulletCount: 1
      // 默认1颗子弹
    };
  },
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      this.chambers = Array(6).fill().map(() => ({ loaded: false }));
      let remainingBullets = this.bulletCount;
      let availablePositions = [0, 1, 2, 3, 4, 5];
      while (remainingBullets > 0) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const position = availablePositions[randomIndex];
        this.chambers[position].loaded = true;
        availablePositions.splice(randomIndex, 1);
        remainingBullets--;
      }
      this.currentChamber = Math.floor(Math.random() * 6);
      this.resultText = "准备开始游戏";
      this.isDanger = false;
    },
    async spinCylinder() {
      if (this.isSpinning || this.isFiring)
        return;
      this.isSpinning = true;
      this.resultText = "弹仓旋转中...";
      this.isDanger = false;
      common_vendor.index.vibrateShort();
      const duration = 1e3 + Math.random() * 1e3;
      setTimeout(() => {
        this.currentChamber = Math.floor(Math.random() * 6);
        this.isSpinning = false;
        this.resultText = "弹仓已就绪";
        common_vendor.index.vibrateShort();
      }, duration);
    },
    async pullTrigger() {
      if (this.isSpinning || this.isFiring)
        return;
      this.isFiring = true;
      const hasBullet = this.chambers[this.currentChamber].loaded;
      if (hasBullet) {
        common_vendor.index.vibrateLong();
        this.resultText = "💥 中弹！喝一杯！";
        this.isDanger = true;
        this.chambers[this.currentChamber].loaded = false;
        this.bulletCount = this.chambers.filter((chamber) => chamber.loaded).length;
        if (this.bulletCount === 0) {
          setTimeout(() => {
            this.resultText = "弹仓已空，请重新装填";
          }, 1500);
        }
      } else {
        common_vendor.index.vibrateShort();
        this.resultText = "✅ 空枪！暂时安全～";
        this.isDanger = false;
      }
      this.currentChamber = (this.currentChamber + 1) % 6;
      setTimeout(() => {
        this.isFiring = false;
      }, 500);
    },
    playSound(soundFile) {
      return new Promise((resolve) => {
        const innerAudioContext = common_vendor.index.createInnerAudioContext();
        innerAudioContext.src = `/static/sounds/${soundFile}`;
        innerAudioContext.onEnded(() => {
          innerAudioContext.destroy();
          resolve();
        });
        innerAudioContext.play();
      });
    },
    showBulletSelector() {
      if (!this.isSpinning && !this.isFiring) {
        this.showBulletOptions = true;
      }
    },
    selectBulletCount(count) {
      this.bulletCount = count;
      this.showBulletOptions = false;
      this.initGame();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.revolverImage,
    b: $data.isFiring ? 1 : "",
    c: common_vendor.t($data.resultText),
    d: $data.isDanger ? 1 : "",
    e: common_vendor.t($data.bulletCount),
    f: common_vendor.o((...args) => $options.showBulletSelector && $options.showBulletSelector(...args)),
    g: common_vendor.o((...args) => $options.spinCylinder && $options.spinCylinder(...args)),
    h: $data.isSpinning || $data.isFiring ? 1 : "",
    i: common_vendor.o((...args) => $options.pullTrigger && $options.pullTrigger(...args)),
    j: $data.isSpinning || $data.isFiring ? 1 : "",
    k: $data.showBulletOptions
  }, $data.showBulletOptions ? {
    l: common_vendor.f(3, (n, k0, i0) => {
      return {
        a: common_vendor.t(n),
        b: n,
        c: $data.bulletCount === n ? 1 : "",
        d: common_vendor.o(($event) => $options.selectBulletCount(n), n)
      };
    }),
    m: common_vendor.f(3, (n, k0, i0) => {
      return {
        a: common_vendor.t(n + 3),
        b: n + 3,
        c: $data.bulletCount === n + 3 ? 1 : "",
        d: common_vendor.o(($event) => $options.selectBulletCount(n + 3), n + 3)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/revolver.js.map
