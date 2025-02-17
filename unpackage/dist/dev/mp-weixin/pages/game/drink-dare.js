"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      name: "张三",
      content: "因本人酒量实在有限，在与王大侠的酒桌比拼中完全不是对手。现本着对身体负责的态度，主动认怂，甘愿接受惩罚。特此声明，以示诚意。",
      currentDate: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN"),
      imagePath: ""
    };
  },
  methods: {
    async generateImage() {
      try {
        const element = this.$refs.cardRef;
        const canvas = await common_vendor.html2canvas(element, {
          useCORS: true,
          scale: 2,
          backgroundColor: null
        });
        const tempFilePath = canvas.toDataURL("image/png");
        const [error, res] = await common_vendor.index.base64ToTempFilePath({
          base64: tempFilePath.split(",")[1],
          success: (res2) => {
            this.imagePath = res2.tempFilePath;
            return res2.tempFilePath;
          },
          fail: (error2) => {
            throw error2;
          }
        });
        if (error) {
          throw error;
        }
        return res.tempFilePath;
      } catch (error) {
        common_vendor.index.showToast({
          title: "生成图片失败",
          icon: "none"
        });
        throw error;
      }
    },
    async saveToAlbum() {
      try {
        const [error, res] = await common_vendor.index.authorize({
          scope: "scope.writePhotosAlbum"
        });
        if (error) {
          throw error;
        }
        const filePath = await this.generateImage();
        await common_vendor.index.saveImageToPhotosAlbum({
          filePath,
          success: () => {
            common_vendor.index.showToast({
              title: "保存成功",
              icon: "success"
            });
          },
          fail: (err) => {
            throw err;
          }
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    },
    async shareToWechat() {
      try {
        const filePath = await this.generateImage();
        await common_vendor.index.share({
          provider: "weixin",
          scene: "WXSceneSession",
          type: 2,
          imageUrl: filePath,
          success: () => {
            common_vendor.index.showToast({
              title: "分享成功",
              icon: "success"
            });
          },
          fail: (err) => {
            throw err;
          }
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "分享失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.name,
    b: common_vendor.o(($event) => $data.name = $event.detail.value),
    c: $data.content,
    d: common_vendor.o(($event) => $data.content = $event.detail.value),
    e: common_vendor.t($data.currentDate),
    f: common_vendor.o((...args) => $options.saveToAlbum && $options.saveToAlbum(...args)),
    g: common_vendor.o((...args) => $options.shareToWechat && $options.shareToWechat(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/drink-dare.js.map
