"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/game/dice.js";
  "./pages/game/lucky-wheel.js";
  "./pages/game/revolver.js";
  "./pages/game/draw-lots.js";
  "./pages/game/drink-dare.js";
  "./pages/game/truth-dare.js";
  "./pages/game/perfect-time.js";
  "./pages/game/riddle.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    common_vendor.wx$1.getSystemInfo({
      success: function(res) {
        if (common_vendor.index.canIUse("canvas.type.2d")) {
          common_vendor.index.createSelectorQuery().selectAll("canvas").fields({
            node: true,
            size: true,
            component: true
          }).exec();
        }
      }
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:24", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:27", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
