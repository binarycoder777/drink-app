"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/game/dice.js";
  "./pages/game/lucky-wheel.js";
  "./pages/game/revolver.js";
  "./pages/game/draw-lots.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
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
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/weitao/Desktop/ThinGift/drink-app/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
