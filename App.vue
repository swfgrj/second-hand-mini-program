<script>
  
	export default {
		onLaunch: function() {
			console.log('App Launch')
      uni.hideTabBar()
      wx.cloud.init({
        env:'cloud1-6gvo3ktj4cdc4b8a',
        traceUser:true
      })
      wx.cloud.callFunction({
        name:'getOpenId'
      }).then(res=>{
        console.log(res)
        uni.setStorageSync('openid',JSON.stringify(res.result.OPENID))
      })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
