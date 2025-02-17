"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      rotation: 0,
      isSpinning: false,
      showChoiceModal: false,
      activeTab: "truth",
      currentQuestion: "",
      truthQuestions: [
        "你的初恋是几岁？",
        "你最难忘的一次旅行是哪次？",
        "你最喜欢的一道菜是什么？"
        // 添加更多真心话问题...
      ],
      dareQuestions: [
        "模仿一种动物叫声",
        "做10个俯卧撑",
        "唱一首歌的副歌部分"
        // 添加更多大冒险内容...
      ]
    };
  },
  methods: {
    spinBottle() {
      if (this.isSpinning)
        return;
      this.isSpinning = true;
      const randomRotation = 1800 + Math.random() * 1800;
      const duration = 3e3;
      this.rotation = 0;
      setTimeout(() => {
        this.rotation = randomRotation;
      }, 50);
      setTimeout(() => {
        this.isSpinning = false;
        this.showChoiceModal = true;
      }, duration);
    },
    refreshQuestion() {
      const questions = this.activeTab === "truth" ? this.truthQuestions : this.dareQuestions;
      const randomIndex = Math.floor(Math.random() * questions.length);
      this.currentQuestion = questions[randomIndex];
    },
    confirmChoice() {
      this.showChoiceModal = false;
    }
  },
  watch: {
    showChoiceModal(newVal) {
      if (newVal) {
        this.refreshQuestion();
      }
    },
    activeTab() {
      this.refreshQuestion();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: `rotate(${$data.rotation}deg)`,
    c: common_vendor.o((...args) => $options.spinBottle && $options.spinBottle(...args)),
    d: $data.showChoiceModal
  }, $data.showChoiceModal ? {
    e: $data.activeTab === "truth" ? 1 : "",
    f: common_vendor.o(($event) => $data.activeTab = "truth"),
    g: $data.activeTab === "dare" ? 1 : "",
    h: common_vendor.o(($event) => $data.activeTab = "dare"),
    i: common_vendor.t($data.currentQuestion),
    j: common_vendor.o((...args) => $options.refreshQuestion && $options.refreshQuestion(...args)),
    k: common_vendor.o((...args) => $options.confirmChoice && $options.confirmChoice(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/truth-dare.js.map
