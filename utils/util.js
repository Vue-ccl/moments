const app=getApp()
var common=require('../request/request.js')
const APP_ID ='wx7********6e2';//输入小程序appid  
const APP_SECRET ='706b708***********33';//输入小程序app_secret  
var OPEN_ID=''//储存获取到openid  
var SESSION_KEY=''//储存获取到session_key
  //获取用户信息
  export function getUserProfile(e){
    wx.getUserProfile({
    desc: 'desc',
    success: (res) => {
      console.log(res.userInfo)
        getOpenIdTap(res.userInfo);
      }
  })
 }
 //获取用户openid，
  function getOpenIdTap(userInfo){  
    var that=this;  
    wx.login({  
      success:function(res){  
        wx.request({  
            //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',  
          data:{  
            appid:APP_ID,  
            secret:APP_SECRET,  
            js_code:res.code,  
            grant_type:'authorization_code'  
          },  
          method:'GET',  
          success:function(res){  
            console.log(res.data)  
            OPEN_ID = res.data.openid;//获取到的openid  
            SESSION_KEY = res.data.session_key;//获取到session_key
            // console.log(userInfo)
            let user={openid:res.data.openid,nickName:userInfo.nickName,avatarUrl:userInfo.avatarUrl};
            get(user)
          }  
        })  
      }  
    })  
  }
  //调用服务器，查询数据库中是否已存在该用户id，不存在则添加该用户，并返回用户信息，存在则更新返回用户信息
  function get(user){
    // console.log(user)
   common.requestAll({
     url:"/Login?user="+JSON.stringify(user)
    })
   .then(res=>{
    //  console.log(res.data[0])
     app.globalData.info=res.data[0]
     wx.showToast({
       title: '登录成功！',
     })
   }).catch(err=>{
     console.log(err)
   })
  }
  