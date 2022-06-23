const app=getApp()
var util=require('../../utils/util.js')
var common=require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source:"",
    unlogin:{nickname:'游客模式',avatarurl:'/images/imgtop.jpg',coverimg:'/images/topFace.png'},
  },
  
  text(){
    // this.onLoad()
    // console.log(this.data.publish)
    
    console.log(this.data.cheers.openids)
  },
  //登录
  getUserProfile(){
    if(!this.data.info.openid){
     util.getUserProfile()
    }else{
      return
    }
  },
  //是否更换封面
  upTopface(){
    wx.showModal({
      title: '是否更换封面？',
      // content: '确认要删除该项吗？',
      success:(res)=> {     //使用箭头函数
        if (res.confirm) {
          this.uploadimg();    //setCat自己封装的一个方法
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 选择封面图片
  uploadimg(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:(res) =>{
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res)
        this.up_img(res.tempFilePaths)
      }
    })
  },
  // 上传封面图片
 up_img(tempFilePaths) {
   console.log(app.globalData.info)
    wx.uploadFile({
      // url: 'https://www.nico33.icu/m_pro/upload.php', //接口
      url: 'https://www.nico33.icu/index.php/Home/Index/uploadimg',
      filePath: tempFilePaths[0],
      name: 'file',
      formData: {
        'user': 'test',
        'openid': app.globalData.info.openid
      },
      success: (res)=> {
        var data = res.data;
        console.log(data);
        //do something
        var coverimg="info.coverimg" //上传成功后更新封面
        this.setData({
          [coverimg]:tempFilePaths[0]
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
 //获取动态
 getpublish(){
  common.requestAll({
    url:'/getpublish'
  }).then(res=>{
    // console.log(res)
    var arr=new Array()
    for( var i=0 ; i<res.data.length ; i++){
      if(res.data[i].imglist){
        arr[i]=(res.data[i].imglist).split(',')
      }else{
        arr[i]=[]
      }
    }
    this.setData({
        imglist:arr
    })
    this.setData({
      publish:res.data
    })
    this.getcheers()//获取全部点赞
  }).catch(err=>{
    console.log(err)
  })
 },
 //获取点赞
 getcheers(){
  common.requestAll({
    url:'/getcheers'
  }).then(res=>{
    // console.log(res.data)
    this.setData({
      cheers:res.data
    })
    this.updataischeers()//刷新自己是否点赞
  }).catch(err=>{
    console.log(err)
  })
 },
 //删除动态
 depublish(e){
  wx.showModal({
    title: '确认删除？',
    success:(res) =>{
      if (res.confirm) {  
        var pid=e.currentTarget.dataset.pid
        console.log(pid)
       common.requestAll({
         url:'/depublish?pid='+pid,
       }).then(res=>{
         console.log(res)
         wx.showToast({
           title: '删除成功！',
         })
         this.getpublish()
       }).catch(err=>{
         console.log(err)
       })
        console.log('点击确认回调')
      } else {   
        console.log('点击取消回调')
      }
    }
  })
 },
 //点击查看图片
   preview_img(e){
    console.log(e.currentTarget.dataset)
    var imglist=e.currentTarget.dataset.imglist
    var imgitem=e.currentTarget.dataset.imgitem
    wx.previewImage({
      current: imgitem, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  //点赞，取消点赞
  selectcheers(e){
    if(this.data.info.openid){
      var pid=e.currentTarget.dataset.pid
      var index=e.currentTarget.dataset.index
        common.requestAll({
          url:'/ischeers',
          data:{
            pid,
            openid:this.data.info.openid
          }
        }).then(res=>{
          // console.log(res)
          // console.log(index)
          var temp = "arrs[" + index + "]"
          this.setData({
            [temp]:!this.data.arrs[index]
          })

          this.getcheers()
        }).catch(err=>{
          console.length(err)
        })
    }else{
      this.getUserProfile();
    }
  },
  //跳转detail页面
  todetail(e){
    var index=e.currentTarget.dataset.index
    if(this.data.info.openid){
       wx.navigateTo({
        url: '/pages/detail/detail',
        success:(res) =>{
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.publish[index]})
        }
      })
    }else{
      this.getUserProfile();
    }
   
  },
  //分享
  share(){
    wx.showToast({
      title: '已复制链接！',
      icon: 'none', 
    })
  },
  //刷新自己点赞
  updataischeers(){
    var arr=new Array()
      if(this.data.publish){
        for(var i=0;i<this.data.publish.length;i++){
          arr.push(arr[i]=false)
          // console.log(i,arr[i])
          this.setData({
            arrs:arr
          })
          for(var j=0;j<this.data.cheers.length;j++){
            if(this.data.publish[i].pid==this.data.cheers[j].pid){
              if(this.data.cheers[j].openids.includes(this.data.info.openid)){
                var temp = "arrs[" + i + "]"
                this.setData({
                  [temp]:true
                })
              } 
            }
          }
        }
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取动态
    if(!this.data.publish){
      this.getpublish()
      this.getcheers()
    }
    //监听全局变量变化时触发
    app.watch('info',(v)=>{
      this.getpublish()
			this.setData({
        info:v,
      })
      this.updataischeers()//刷新自己点赞
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
    this.onLoad()
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