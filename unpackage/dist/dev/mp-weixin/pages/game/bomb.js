"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      grid: Array(9).fill().map(() => ({
        hasBomb: false,
        isRevealed: false
      })),
      bombCount: 2,
      showBombOptions: false,
      resultText: "准备开始游戏",
      isDanger: false,
      isGameOver: false
    };
  },
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      this.grid = Array(9).fill().map(() => ({
        hasBomb: false,
        isRevealed: false
      }));
      let remainingBombs = this.bombCount;
      let availablePositions = Array.from({ length: 9 }, (_, i) => i);
      while (remainingBombs > 0) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const position = availablePositions[randomIndex];
        this.grid[position].hasBomb = true;
        availablePositions.splice(randomIndex, 1);
        remainingBombs--;
      }
      this.resultText = "准备开始游戏";
      this.isDanger = false;
      this.isGameOver = false;
    },
    async revealCell(index) {
      if (this.isGameOver || this.grid[index].isRevealed)
        return;
      this.grid[index].isRevealed = true;
      if (this.grid[index].hasBomb) {
        common_vendor.index.vibrateLong();
        this.resultText = "💥 爆炸！喝一杯！";
        this.isDanger = true;
        this.isGameOver = true;
        this.revealAllBombs();
      } else {
        common_vendor.index.vibrateShort();
        const unrevealedSafeCells = this.grid.filter(
          (cell) => !cell.isRevealed && !cell.hasBomb
        ).length;
        if (unrevealedSafeCells === 0) {
          this.resultText = "🎉 恭喜获胜！";
          this.isGameOver = true;
        } else {
          this.resultText = "✅ 安全！继续～";
        }
      }
    },
    revealAllBombs() {
      this.grid.forEach((cell) => {
        if (cell.hasBomb) {
          cell.isRevealed = true;
        }
      });
    },
    showBombSelector() {
      if (!this.isGameOver) {
        this.showBombOptions = true;
      }
    },
    selectBombCount(count) {
      if (count >= 1 && count <= 6) {
        this.bombCount = count;
        this.showBombOptions = false;
        this.initGame();
      }
    },
    resetGame() {
      this.initGame();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.resultText),
    b: $data.isDanger ? 1 : "",
    c: common_vendor.f($data.grid, (cell, index, i0) => {
      return common_vendor.e({
        a: cell.isRevealed
      }, cell.isRevealed ? {
        b: common_vendor.t(cell.hasBomb ? "💣" : "✨")
      } : {}, {
        c: index,
        d: cell.isRevealed ? 1 : "",
        e: cell.isRevealed && cell.hasBomb ? 1 : "",
        f: cell.isRevealed && !cell.hasBomb ? 1 : "",
        g: common_vendor.o(($event) => $options.revealCell(index), index)
      });
    }),
    d: common_vendor.t($data.bombCount),
    e: common_vendor.o((...args) => $options.showBombSelector && $options.showBombSelector(...args)),
    f: common_vendor.o((...args) => $options.resetGame && $options.resetGame(...args)),
    g: $data.showBombOptions
  }, $data.showBombOptions ? {
    h: common_vendor.f(3, (n, k0, i0) => {
      return {
        a: common_vendor.t(n),
        b: n,
        c: $data.bombCount === n ? 1 : "",
        d: common_vendor.o(($event) => $options.selectBombCount(n), n)
      };
    }),
    i: common_vendor.f(3, (n, k0, i0) => {
      return {
        a: common_vendor.t(n + 3),
        b: n + 3,
        c: $data.bombCount === n + 3 ? 1 : "",
        d: common_vendor.o(($event) => $options.selectBombCount(n + 3), n + 3)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/game/bomb.js.map
