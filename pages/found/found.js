const app=getApp()
var util=require('../../utils/util.js')
Page({  
  data:{

  },
  //登录
  getUserProfile(e){
    util.getUserProfile()
  },
  //去我的动态
  tomypublish(){
    if(app.globalData.info.openid){
      wx.navigateTo({
        url: '/pages/mypublish/mypublish?openid='+app.globalData.info.openid,
      })
    }else{
      this.getUserProfile()
    }
  },
  //去我的评论
  tomycommunity(){
    if(app.globalData.info.openid){
      wx.navigateTo({
        url: '/pages/mycommunity/mycommunity?openid='+app.globalData.info.openid,
      })
    }else{
      this.getUserProfile()
    }
  },
  //未开发
  unto(){
    wx.showToast({
      title: '开发中，敬请期待！',
      icon:'none'
    }) 
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        //监听全局变量变化时触发
        app.watch('info',(v)=>{
          this.setData({
            info:v,
          })
        })
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
})