"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      games: [
        { name: "摇骰子", image: "/static/images/game1.png", path: "/pages/game/dice" },
        { name: "幸运转盘", image: "/static/images/wheel.png", path: "/pages/game/lucky-wheel" },
        { name: "左轮轮盘", image: "/static/images/revolver.png", path: "/pages/game/revolver" },
        { name: "抽签", image: "/static/images/lots.png", path: "/pages/game/draw-lots" }
      ]
    };
  },
  onLoad() {
  },
  methods: {
    startGame(path) {
      common_vendor.index.navigateTo({
        url: path
      });
    },
    showRules() {
      common_vendor.index.showModal({
        title: "游戏规则",
        content: "1. 玩家轮流参与游戏\n2. 根据游戏指示完成任务\n3. 未完成任务的玩家需要喝酒\n4. 注意适量，快乐游戏",
        showCancel: false
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o(($event) => $options.startGame("/pages/game/truth-dare")),
    c: common_vendor.o(($event) => $options.startGame("/pages/game/drink-dare")),
    d: common_vendor.f($data.games, (game, gIndex, i0) => {
      return {
        a: game.image,
        b: common_vendor.t(game.name),
        c: gIndex,
        d: common_vendor.o(($event) => $options.startGame(game.path), gIndex)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
