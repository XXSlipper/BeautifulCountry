//app.js
App({
  onLaunch: function () {
    var self = this

    self.globalData.netWorking = true
    //检验登陆状态
    wx.checkSession({

      success : function (){

        //登陆状态有效, 获取用户授权信息. (用户信任后,才去调用 wx.login 所以,下面一定是已经授权的状态)
        wx.getSetting({
          success: res => {

            if (res.authSetting['scope.userInfo']) {
              // 已经授权

              //getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  
                  var userInfo = res.userInfo

                  wx.getStorage({
                    key: 'importantUserInfo',
                    success: function(res) {
                      self.globalData.netWorking = false
                      var userID = res.data.userID

                      var token = res.data.token

                      //将我关心的信息保存下来
                      self.globalData.userInfo = { avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, userID: userID, token: token}

                      self.globalData.needLogin = false

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (self.userInfoReadyCallback) {
                        self.userInfoReadyCallback()
                      }

                      var networkH = require("utils/networkHandle.js")
                      networkH.getFocusList({
                        success:function(p){
                          self.globalData.userFocusList = p.data || []
                        },
                        fail:function(){

                        }
                      })

                      networkH.getCollectArticleList({
                        success:function(p){
                          self.globalData.userCollectionList = p.data || []
                        },
                        fail:function(p){

                        }
                      })

                    },
                    fail: function () {
                      self.globalData.netWorking = false
                      if (self.userInfoReadyCallback) {
                        self.userInfoReadyCallback()
                      }
                    }
                  })
                  
                },
                fail : function (){
                  self.globalData.netWorking = false
                  if (self.userInfoReadyCallback) {
                    self.userInfoReadyCallback()
                  }
                }
              })
            }else{
              self.globalData.netWorking = false
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback()
              }
            }
          },
          fail : function (){
            self.globalData.netWorking = false
            //获取用户授权信息失败.让用户重新登陆
            if (self.userInfoReadyCallback) {
              self.userInfoReadyCallback()
            }
          }
        })

      },
      fail: function () {

        self.globalData.netWorking = false
        // 登陆状态无效,重新登录.(1,从未登陆 2,登陆太失效)
        if (self.userInfoReadyCallback) {
          self.userInfoReadyCallback(res)
        }
      }
    })

  },
  globalData: {
    netWorking:true,
    userInfo: null,
    urlHeader:"https://app.beststeven.xyz/sp-agriculture/",
    userFocusList:[],
    userCollectionList:[],
    userLocation:null
  }
})