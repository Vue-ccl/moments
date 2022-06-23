// pages/mycommunity/mycommunity.js
const app=getApp()
var common=require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //删除我的评论
  delectcommunity(e){
    wx.showModal({
      title: '确认要删除该项吗？',
      success: (res)=>{
        if (res.confirm) {  
          var cid=e.currentTarget.dataset.cid
          common.requestAll({
            url:'/delectcommunity?cid='+cid
          }).then(res=>{
            console.log(res)
            wx.showToast({
              title: '删除成功！',
              icon:'none'
            })
            this.getmycommunity(this.data.info.openid)
          }).catch(err=>{
            console.log(err)
          })
        } else {   
          console.log('点击取消回调')
        }
      }
    })
  },
  //获取我的评论
  getmycommunity(openid){
    common.requestAll({
      url:'/getmycommunity?openid='+openid
    }).then(res=>{
      // console.log(res)
      this.setData({
        mycommunity:res.data
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmycommunity(options.openid)
    this.setData({
      info: app.globalData.info
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})