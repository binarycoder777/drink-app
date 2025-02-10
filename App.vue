<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef MP-WEIXIN
			wx.getSystemInfo({
				success: function(res) {
					if (uni.canIUse('canvas.type.2d')) {
						// 启用 2d 类型的 canvas
						uni.createSelectorQuery()
							.selectAll('canvas')
							.fields({
								node: true,
								size: true,
								component: true
							})
							.exec()
					}
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
