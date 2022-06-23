// pages/detail/detail.js
const app=getApp()
var util=require('../../utils/util.js')
var common=require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischeers:false,
    inputValue:''
  },
  text(){
    console.log(this.data.inputValue)
    this.setData({
      inputValue:''
    })
  },
  //获取输入内容
  getValue(e){
    this.setData({
      inputValue:e.detail.value
    })
   },
  //获取评论
  getcommunity(pid){
    // console.log('sss',pid)
    common.requestAll({
      url:'/getcommunity?pid='+pid,
    }).then(res=>{
      // console.log('222',res.data)
      this.setData({
        critics:res.data
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  //发送评论
  sendcom(){
    if(this.data.inputValue){
    var criticsed=this.data.detail.openid//被评论人openid
    common.requestAll({
      url:"/sendcom",
      method:'post', 
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data:{
        pid:this.data.detail.pid,
        critics:app.globalData.info.openid,
        criticsed,
        comments:this.data.inputValue,
      }
     })
    .then(res=>{
      console.log( '成功',res)
      this.getcommunity(this.data.detail.pid)
      wx.showToast({
        title: '评论成功！',
        icon:'none'
      })
      this.setData({
        inputValue:''
      })
    }).catch(err=>{
      console.log(err)
    })
    }else{
      wx.showToast({
        title: '评论不能为空！',
        icon:'none'
      })
    }
    
  },
  //点赞与取消点赞
  selectcheers(){
    common.requestAll({
      url:'/ischeers',
      data:{
        pid:this.data.detail.pid,
        openid:app.globalData.info.openid
      }
    }).then(res=>{
      console.log(res)
      this.getdetailcheers(this.data.detail.pid)
    }).catch(err=>{
      console.log(err)
    })
  },
   //点击查看图片
   preview_img(e){
    // console.log(e.currentTarget.dataset)
    var imgitem=e.currentTarget.dataset.imgitem
    wx.previewImage({
      current: imgitem, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  //获取所有点赞人openid
  getdetailcheers(pid){
    // console.log(pid)
    common.requestAll({
      url:'/getdetailcheers?pid='+pid
    }).then(res=>{
      console.log('##',res.data)
      if(res.data.length){
        this.setData({
          ischeers:true
        })
         this.getusers(res.data[0].openids)
      }else{
        this.setData({
          ischeers:false
        })
      }

    }).catch(err=>{
      console.log(err)
    })
  },
   //获取点赞用户信息
 getusers(openids){
  common.requestAll({
    url:'/getusers?openids='+openids
  }).then(res=>{
    // console.log(res.data)
    this.setData({
      cheers:res.data
    })
  }).catch(err=>{
    console.log(err)
  })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

    // this.setData({
    //   cheers:options.cheers.split(',')
    // })
    this.getusers(options.cheers)
    //获取传值
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) =>{
      // console.log(data)
      this.getdetailcheers(data.data.pid)
      this.getcommunity(data.data.pid)
      var imglist=new Array()
      if(data.data.imglist){
        imglist=data.data.imglist.split(',')
      }
      this.setData({
        detail:data.data,
        imglist
      })
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