"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isDealer: false,
      riddles: [
        {
          question: "说它是个宝，用它少不了，可是它偏偏一文不值。是什么？",
          answer: "零"
        },
        {
          question: "什么东西越热越爱出来，越冷越躲起来？",
          answer: "汗"
        },
        {
          question: "什么门永远关不上？",
          answer: "问门"
        }
        // 可以添加更多谜语
      ],
      currentRiddle: {},
      timeLeft: 180,
      timer: null,
      showResult: false,
      isAnswerVisible: false
    };
  },
  onLoad(options) {
    this.isDealer = options.dealer === "true";
    this.initGame();
  },
  methods: {
    initGame() {
      this.showResult = false;
      this.isAnswerVisible = false;
      this.currentRiddle = this.riddles[Math.floor(Math.random() * this.riddles.length)];
      this.timeLeft = 180;
      this.startTimer();
    },
    startTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.timeUp();
        }
      }, 1e3);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    timeUp() {
      this.clearTimer();
      this.showResult = true;
    },
    nextRiddle() {
      this.initGame();
    },
    showAnswer() {
      this.isAnswerVisible = true;
    }
  },
  onUnload() {
    this.clearTimer();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isDealer
  }, $data.isDealer ? {
    b: common_vendor.t($data.currentRiddle.answer)
  } : {}, {
    c: common_vendor.t($data.currentRiddle.question),
    d: $data.timeLeft > 0
  }, $data.timeLeft > 0 ? {
    e: common_vendor.t(Math.floor($data.timeLeft / 60)),
    f: common_vendor.t($data.timeLeft % 60)
  } : {}, {
    g: $data.isAnswerVisible
  }, $data.isAnswerVisible ? {
    h: common_vendor.t($data.currentRiddle.answer)
  } : {}, {
    i: !$data.isAnswerVisible
  }, !$data.isAnswerVisible ? {
    j: common_vendor.o((...args) => $options.showAnswer && $options.showAnswer(...args))
  } : {}, {
    k: common_vendor.o((...args) => $options.nextRiddle && $options.nextRiddle(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/riddle.js.map
