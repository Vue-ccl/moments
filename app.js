App({
  watch: function(key, method) {
		var obj = this.globalData;
		//加个前缀生成隐藏变量，防止死循环发生
		let ori = obj[key]; //obj[key]这个不能放在Object.defineProperty里
		if (ori) { //处理已经声明的变量，绑定处理
			method(ori);
		}
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: true,
			set: function(value) {
				this['_' + key] = value;
				// console.log('是否会被执行2')
				method(value);
			},
			get: function() {
				// 在其他界面调用key值的时候，这里就会执行。
				if (typeof this['_' + key] == 'undefined') {
					if (ori) {
						//这里读取数据的时候隐藏变量和 globalData设置不一样，所以要做同步处理
						this['_' + key] = ori;
						return ori;
					} else {
						return undefined;
					}
				} else {
					return this['_' + key];
				}
			}
		})
	},
  globalData: {
    //全局变量
    info:{},
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
