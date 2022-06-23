
const app=getApp()
var common=require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    index: 0,
    inputValue:''
  },
  //获取输入内容
  getValue(e){
   this.setData({
     inputValue:e.detail.value
   })
  },
  //地址选择
  bindPickerChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //选择图片
  chooseImages(){
    wx.chooseImage({
      count: 9,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success:(res)=>{
        console.log(res.tempFilePaths)
        //保存已选图片本地路径
        if(this.data.tempFilePaths){//已有图片就使用concat函数拼接数组
          this.setData({
              tempFilePaths:this.data.tempFilePaths.concat(res.tempFilePaths)//
            })
        }else{
            this.setData({
            tempFilePaths:res.tempFilePaths
          })
        }
        if(this.data.tempFilePaths.length >= 9){
          this.setData({
            show:false
          })
          wx.showToast({
            title: '照片最多选9张！',
          })
        }else{
          this.setData({
            show:true
          })
        }   
      }
    })
  },
  //删除已选图片
  delectCamera(e){
    this.data.tempFilePaths.splice(e.currentTarget.dataset.index,1)
    this.setData({//重新赋值
      tempFilePaths:this.data.tempFilePaths
    })
    if(this.data.tempFilePaths.length >= 9){
      this.setData({
        show:false
      })
      wx.showToast({
        title: '照片最多选9张！',
      })
    }else{
      this.setData({
        show:true
      })
    } 
  },
  // 一、点击发布触发-上传发布动态
  publish(){
    if(this.data.inputValue || this.data.tempFilePaths){
      wx.showModal({
        title: '确认发布？',
        success:(res) =>{
          if (res.confirm) {  
            wx.showLoading({
              title:'上传发布中...',
              mask:true
            });
            if(this.data.tempFilePaths){
              this.up_imgs()//开始上传步骤
            }else{
              this.setData({
                worksImgs:''
              })
              this.up_publish()
            }
            console.log('点击确认回调')
          } else {   
            console.log('点击取消回调')
          }
        }
      })
    }else{
      console.log('222')
      wx.showToast({
        title: '发布内容不能为空！',
        icon: 'none', 
      })
      return
    }
  },
   // 二、 调用递归上传图片
 up_imgs() {
  var successUp = 0; //成功，初始化为0
  var failUp = 0; //失败，初始化为0
  var length = this.data.tempFilePaths.length; //总共上传的数量
  var count = 0; //第几张，初始化为0
  //调用上传图片的公共函数
  this.uploadOneByOne( this.data.tempFilePaths, successUp, failUp, count, length);
  // this.up_publish(this.data.worksImgs.toString());
 },
 // 三 、递归上传图片
 uploadOneByOne(imgPaths, successUp, failUp, count, length){
    wx.uploadFile({
      url: 'https://www.nico33.icu/index.php/Home/Index/uploadimgs',
      filePath: imgPaths[count],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      success: (res)=> {
        successUp++; //成功+1
        var worksImg=new Array()
        worksImg.push(res.data)
        if(this.data.worksImgs){
            this.setData({
            worksImgs:this.data.worksImgs.concat(worksImg)
          })
        }else{
          this.setData({
            worksImgs:worksImg
          })
        }
      },
      fail:(error) =>{
        console.log(error);
        failUp++; //失败+1
      },
      complete:(e)=> {
        count++; //下一张
        if (count == length) {//上传完毕后
        // TODO: 上传完毕后跳转页面
          this.up_publish()//开始第四步上传
        }
        else {
          //递归调用，上传下一张
          this.uploadOneByOne(imgPaths, successUp, failUp, count, length);
        }
        }
    })
 },

  // 四 、上传发布动态
  up_publish(){
    let context=this.data.inputValue
    let address=this.data.location[this.data.index].address//选择的位置
    let imglist=this.data.worksImgs
    // console.log(imglist)
    common.requestAll({
      url:"/publish",
      method:'post', 
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data:{
        openid:app.globalData.info.openid,
        context,
        address,
        imglist
      }
     })
    .then(res=>{
      console.log( '成功',res)
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '发布成功！',
          })
        },
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch(err=>{
      console.log(err)
    })
  },
 
  //逆解析地理位置
  location(){
    let loc=this.data.lat+','+this.data.lon
    // console.log(loc)
      wx.serviceMarket.invokeService({
        service: 'wxc1c68623b7bdea7b',
        api: 'rgeoc',
        data: {
          "location": loc,
          "get_poi": 1
        },
      }).then(res => {
        let nowaddress={address:res.data.result.address}//当前位置,赋值为对象
        let nbloc=res.data.result.pois//附近的十个位置，为对象数组
        nbloc.unshift(nowaddress)//将当前位置对象，插入到对象数组中的第一个
        // console.log(nbloc)
        this.setData({
          location:nbloc
        })
        // console.log('invokeService success', res)
      }).catch(err => {
        console.error('invokeService fail', err)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前经纬度
    wx.getLocation({
      altitude: true,
      success: (result) => {
        this.setData({
          lat:result.latitude,
          lon:result.longitude,
        })
        this.location();//逆解析地理位置
      },
    })
  },

 

  

})