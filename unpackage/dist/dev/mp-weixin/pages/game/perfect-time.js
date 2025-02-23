"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
    };
  },
  methods: {
    startGame() {
      this.resetGame();
      this.gameStarted = true;
      this.showTimer = true;
      this.countdown = 3;
      this.countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.showTimer = false;
          const randomDelay = Math.random() * 1500 + 500;
          this.changeTimer = setTimeout(() => {
            this.isGreen = true;
            this.startTime = Date.now();
          }, randomDelay);
        }
      }, 1e3);
    },
    stopGame() {
      if (!this.isGreen) {
        common_vendor.index.showToast({
          title: "太早了！要等到绿色才能点击",
          icon: "none"
        });
        this.resetGame();
        return;
      }
      const endTime = Date.now();
      this.reactionTime = endTime - this.startTime;
      this.showResult = true;
      this.gameStarted = false;
      let message = "";
      if (this.reactionTime < 300) {
        message = "反应超快！";
      } else if (this.reactionTime < 500) {
        message = "不错的反应速度！";
      } else if (this.reactionTime < 1e3) {
        message = "反应有点慢啦~";
      } else {
        message = "太慢了，该喝酒啦！";
      }
      common_vendor.index.showModal({
        title: "游戏结果",
        content: `${message}
反应时间：${this.reactionTime}ms`,
        showCancel: false
      });
    },
    resetGame() {
      this.gameStarted = false;
      this.isGreen = false;
      this.showTimer = false;
      this.showResult = false;
      this.reactionTime = 0;
      clearInterval(this.countdownTimer);
      clearTimeout(this.changeTimer);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isGreen ? 1 : "",
    b: $data.isGreen ? 1 : "",
    c: $data.showTimer
  }, $data.showTimer ? {
    d: common_vendor.t($data.countdown)
  } : {}, {
    e: $data.showResult
  }, $data.showResult ? {
    f: common_vendor.t($data.reactionTime)
  } : {}, {
    g: !$data.gameStarted
  }, !$data.gameStarted ? {
    h: common_vendor.o((...args) => $options.startGame && $options.startGame(...args))
  } : {}, {
    i: $data.gameStarted
  }, $data.gameStarted ? {
    j: common_vendor.o((...args) => $options.stopGame && $options.stopGame(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/perfect-time.js.map
