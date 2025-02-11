"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isDrawing: false,
      showResult: false,
      resultNumber: 0,
      resultText: "",
      lots: [
        { number: 1, text: "大吉 - 指定一人喝一杯，自己免喝" },
        { number: 2, text: "中吉 - 与左边的人对饮一杯" },
        { number: 3, text: "小吉 - 讲一个笑话，讲得不好喝一杯" },
        { number: 4, text: "平签 - 猜拳决定喝酒人选" },
        { number: 5, text: "末吉 - 自罚一杯，大家陪饮" },
        { number: 6, text: "上吉 - 玩真心话大冒险，输者喝酒" },
        { number: 7, text: "中平 - 与右边的人石头剪刀布，输者喝" },
        { number: 8, text: "下签 - 表演节目，大家满意则免喝" },
        { number: 9, text: "吉签 - 选择两人PK喝酒" },
        { number: 10, text: "特签 - 所有人一起干杯！" }
      ],
      showSettings: false,
      editableLots: [],
      popupReady: false
    };
  },
  watch: {
    showSettings(val) {
      if (!this.popupReady)
        return;
      if (val) {
        this.editableLots = JSON.parse(JSON.stringify(this.lots));
        this.$nextTick(() => {
          if (this.$refs.settingsPopup) {
            this.$refs.settingsPopup.open();
          }
        });
      } else {
        this.$refs.settingsPopup.close();
      }
    }
  },
  methods: {
    drawLot() {
      if (this.isDrawing)
        return;
      this.isDrawing = true;
      this.showResult = false;
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * this.lots.length);
        this.resultNumber = this.lots[randomIndex].number;
        this.resultText = this.lots[randomIndex].text;
        this.isDrawing = false;
        this.showResult = true;
      }, 1500);
    },
    editLot(index) {
      this.editableLots[index].text = this.lots[index].text;
      this.showSettings = true;
    },
    openSettings() {
      this.editableLots = JSON.parse(JSON.stringify(this.lots));
      this.showSettings = true;
      this.$nextTick(() => {
        if (this.$refs.settingsPopup) {
          this.$refs.settingsPopup.open();
        }
      });
    },
    closeSettings() {
      this.showSettings = false;
    },
    updateLot(index, text) {
      this.editableLots[index].text = text;
    },
    saveLots() {
      this.lots = JSON.parse(JSON.stringify(this.editableLots));
      this.closeSettings();
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
    },
    popupChange(e) {
      if (!e.show) {
        this.showSettings = false;
      }
    }
  },
  onReady() {
    this.popupReady = true;
  }
};
if (!Array) {
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  _component_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f(10, (i, k0, i0) => {
      return {
        a: i
      };
    }),
    b: $data.isDrawing ? 1 : "",
    c: $data.showResult && !$data.isDrawing
  }, $data.showResult && !$data.isDrawing ? {
    d: common_vendor.t($data.resultNumber),
    e: common_vendor.t($data.resultText),
    f: common_vendor.o(($event) => $options.editLot($data.resultNumber - 1))
  } : {}, {
    g: common_vendor.t($data.isDrawing ? "正在抽签..." : "抽签"),
    h: $data.isDrawing,
    i: common_vendor.o((...args) => $options.drawLot && $options.drawLot(...args)),
    j: common_vendor.o((...args) => $options.openSettings && $options.openSettings(...args)),
    k: $data.showSettings
  }, $data.showSettings ? {
    l: common_vendor.o((...args) => $options.closeSettings && $options.closeSettings(...args)),
    m: common_vendor.f($data.editableLots, (lot, index, i0) => {
      return {
        a: common_vendor.t(lot.number),
        b: common_vendor.o(($event) => $options.updateLot(index, lot.text), index),
        c: lot.text,
        d: common_vendor.o(($event) => lot.text = $event.detail.value, index),
        e: index
      };
    }),
    n: common_vendor.o((...args) => $options.saveLots && $options.saveLots(...args)),
    o: common_vendor.sr("settingsPopup", "49c2cbdf-0"),
    p: common_vendor.o($options.popupChange),
    q: common_vendor.p({
      type: "center"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/weitao/Desktop/ThinGift/drink-app/pages/game/draw-lots.vue"]]);
wx.createPage(MiniProgramPage);
