


/*
* 00101 wx.login 回调 fail
*00102 res.code == nil
*00103 wechat/login 回调fail
*00104 statusCode != 200
*00105-xxxxxx 业务逻辑错误 xxxxxx服务器返回的错误码
*00106 存储userID token 到本地失败
*/
const myLogin = (p)=>{
  wx.login({
    success: function (res) {
      if (res.code) {

        wx.request({
          method: "POST",
          url: getApp().globalData.urlHeader + "wechat/login",
          data: {
            encryptedData: p.encryptedData,
            iv: p.iv,
            code: res.code
          },
          success: function (e) {
            if (e.statusCode == 200) {
              
              if(e.data.code == 600200){

                var importantUserInfo = { userID: e.data.data.userId, token: e.data.data.token }
                wx.setStorage({
                  key: 'importantUserInfo',
                  data: importantUserInfo,
                  success: function () {

                    getApp().globalData.userInfo = { avatarUrl: p.userInfo.avatarUrl, nickName: p.userInfo.nickName, userID: importantUserInfo.userID, token: importantUserInfo.token }

                    getApp().globalData.needLogin = false

                    p.success({successMsg:"授权登陆成功"})

                  },
                  fail: function () {
                    p.fail({ errorCode: "00106", errorMsg: "授权失败" })
                  }
                })

              }else{
                p.fail({ errorCode: "00105" + "-" + e.data.code, errorMsg: "授权失败" })
              }
            } else {
              p.fail({ errorCode: "00104", errorMsg: "授权失败" })
            }

          },
          fail: function (e) {
            p.fail({ errorCode: "00103", errorMsg: "授权失败" })
          }
        })
      } else {
        p.fail({ errorCode: "00102", errorMsg:"授权失败"})
      }
    },
    fail: function (res) {
      p.fail({errorCode:"00101",errorMsg:"授权失败"})
    }
  })
}

/*
*00201 crops/getCropsList 回调 fail
*00202 statusCode != 200
*00203-xxxxxx 业务逻辑错误
*/
const getCropList = (p) =>{

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'crops/getCropsList',
    data: {
      "userId": getApp().globalData.userInfo.userID
    },
    success: function (e) {

      if (e.statusCode == 200) {

        if(e.data.code == 600200){

          var cropList = e.data.data["cropsList"]

          var util = require("util.js")
          for (var i = 0; i < cropList.length; i++) {
            var crop = cropList[i]
            var timeStr = util.formatTimeNumber(crop.createTime, 'Y年M月D日 h:m:s')
            crop["createTime"] = timeStr
          }

          p.success({ successMsg: "种植列表获取成功", data: cropList})

        }else{

          p.fail({ errorCode: "00203" + "-" + e.data.code, errorMsg: "种植列表获取失败!" })

        }
      } else {

        p.fail({ errorCode: "00202", errorMsg: "种植列表获取失败!" })

      }
    },
    fail: function () {

      p.fail({errorCode:"00201",errorMsg:"种植列表获取失败!"})

    }
  })
}


/*
*00301 crops/deleteByCropsId 回调 fail
*00302 statusCode != 200
*00303-xxxxxx 业务逻辑错误
*/
const deleteCropWithId = (p)=>{

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + "crops/deleteByCropsId",
    data: {
      cropsId: p.cropsId
    },
    success: function (e) {

      if (e.statusCode == 200) {

        if(e.data.code == 600200){

          p.success({successMsg:"删除成功!"})
          
        }else{

          p.fail({ errorCode: "00303" + "-" + "e.data.code", errorMsg: "删除失败!" })

        }

      } else {

        p.fail({ errorCode: "00302", errorMsg: "删除失败!" })

      }


    },
    fail: function () {

      p.fail({ errorCode: "00301", errorMsg:"删除失败!"})

    }
  })

}


/*00401 crops/updateCropsSize 回调fail
*00402  statusCode != 200
*00403-xxxxxx 业务逻辑错误
*/

const updateCropSize = (p) => {

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + "crops/updateCropsSize",
    data: {
      cropsId: p.cropsId,
      cropsSize: p.newSize
    },
    success: function (e) {

      if (e.statusCode == 200) {

        if(e.data.code == 600200){

          p.success({successMsg:"更新成功!"})

        }else{

          p.fail({ errorCode: "00403" + "-" + e.data.code, errorMsg: "种植面积更新失败!" })

        }
        
      } else {

        p.fail({ errorCode: "00402", errorMsg: "种植面积更新失败!" })

      }

    },

    fail: function () {

      p.fail({errorCode:"00401",errorMsg:"种植面积更新失败!"})
    }
  })

}

/*
*00501 crops/saveCrops 回调 fail
*00502 statusCode != 200
*00503-xxxxxx 业务逻辑错误
*/
const addNewCrop = (p) => {

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'crops/saveCrops',
    data: {
      "userId": getApp().globalData.userInfo.userID,
      "cropsCode": p.cropsCode,
      "cropsName": p.cropsName,
      "cropsSize": p.cropsSize
    },
    success: function (e) {

      if (e.statusCode == 200) {

        if(e.data.code == 600200){

          p.success({ successMsg:"添加成功"})

        }else{

          p.fail({ errorCode: "00503" + "-" + e.data.code, errorMsg: "添加失败!" })

        }

      } else {

        p.fail({ errorCode: "00502", errorMsg: "添加失败!" })

      }
    },
    fail: function () {

      p.fail({errorCode:"00501",errorMsg:"添加失败!"})

    }
  })

}

/*
*00601  deliveryAddress/list 回调 fail
*00602 statusCode != 200
*00603-xxxxxx 业务逻辑错误
*/
const getAddressList = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader+ 'deliveryAddress/list',
    data:{
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {

        if (e.data.code == 600200) {

          var addressLists = e.data.data.cropsList

          p.success({ successMsg: "获取成功", data: addressLists})

        }else{

          p.fail({ errorCode: "00603" + "-" + e.data.code, errorMsg: "地址获取失败" })
        }

      }else{
        p.fail({ errorCode: "00602", errorMsg: "地址获取失败" })
      }
    },
    fail: function (e) {
      p.fail({errorCode:"00601",errorMsg:"地址获取失败"})
    }
  })
}

/*
*00701  deliveryAddress/save  fail
*00702 statusCode != 200
*00703-xxxxxx 业务逻辑错误
*/
const saveAddress = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'deliveryAddress/save',
    data:{
      userId:getApp().globalData.userInfo.userID,
      status:p.status,
      contactsName: p.contactsName,
      contactsPhone: p.contactsPhone,
      addressCode: p.addressCode,
      country: p.country,
      province: p.province,
      city: p.city,
      area: p.area,
      detail: p.detail
    },
    success: function (e) {
      if (e.statusCode == 200) {

        if (e.data.code == 600200) {

          p.success({ successMsg: "保存成功!" })

        } else {

          p.fail({ errorCode: "00703" + "-" + e.data.code, errorMsg: "保存失败" })

        }
      } else {

        p.fail({ errorCode: "00702", errorMsg: "保存失败!" })

      }
    },
    fail: function () {

      p.fail({ errorCode: "00701", errorMsg: "保存失败!" })

    }
  })
}



/*
*00801 deliveryAddress/delete fail
*00802 statusCode != 200
*00803-xxxxxx
*/
const deleteAddressWithID = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'deliveryAddress/delete',
    data:{
      addressId:p.addressId
    },
    success:function(e){

      if(e.statusCode == 200){

        if(e.data.code == 600200){

          p.success({successMsg:"删除成功"})

        }else{

          p.fail({ errorCode: "00802" + "-" + e.data.code, errorMsg: "删除失败!" })

        }

      }else{
        p.fail({ errorCode: "00802", errorMsg: "删除失败!" })
      }
    },
    fail:function(e){
      p.fail({errorCode:"00801",errorMsg:"删除失败!"})
    }
  })
}


/*
*00901  deliveryAddress/save  fail
*00902 statusCode != 200
*00903-xxxxxx 业务逻辑错误
*/
const updateAddress = (p) => {
  
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'deliveryAddress/update',
    data: {
      userId: getApp().globalData.userInfo.userID,
      status: p.status,
      addressId: p.addressId,
      contactsName: p.contactsName,
      contactsPhone: p.contactsPhone,
      country: p.country,
      province: p.province,
      addressCode: p.addressCode,
      city: p.city,
      area: p.area,
      detail: p.detail
    },
    success: function (e) {
      if (e.statusCode == 200) {

        if (e.data.code == 600200) {

          p.success({ successMsg: "更新成功!" })

        } else {

          p.fail({ errorCode: "00903" + "-" + e.data.code, errorMsg: "更新失败" })

        }
      } else {

        p.fail({ errorCode: "00902", errorMsg: "更新失败!" })

      }
    },
    fail: function () {

      p.fail({ errorCode: "00901", errorMsg: "更新失败!" })

    }
  })
}


/*01001  captcha/bindingPhone fail
*01002 statusCode != 200
*01003-xxxxxx 业务逻辑错误
*/
const getPhoneVerifyNumber = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'captcha/bindingPhone',
    data:{
      "phone":p.phoneNumber
    },
    success:function(e){
      if(e.statusCode == 200){

        if(e.data.code == 600200){
          p.success({successMsg:"请注意查看短信通知"})
        }else{
          p.fail({ errorCode: "01003" + "-" + e.data.code, errorMsg: "获取失败" })
        }

      }else{
        p.fail({ errorCode: "01002", errorMsg: "获取失败" })
      }
    },
    fail:function(){
      p.fail({errorCode:"01001",errorMsg:"获取失败"})
    }
  })
}

/*
*01101  user/userPhoneBinding fail
*01102 statusCode != 200
*01103-xxxxxx 业务逻辑错误
*/
const bindPhoneNumber = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'user/userPhoneBinding',
    data:{
      userId: getApp().globalData.userInfo.userID,
      userPhone:p.phoneNumber,
      captchaCode: p.captchaCode
    },
    success:function(e){
      if(e.statusCode == 200){

        if(e.data.code == 600200){
          p.success({successMsg:"绑定成功!"})
        }else{
          p.fail({ errorCode: "01103" + "-" + e.data.code, errorMsg: "绑定失败" })
        }

      }else{
        p.fail({ errorCode: "01102", errorMsg: "网络错误" })
      }
    },
    fail:function(){
      p.fail({errorCode:"01101",errorMsg:"网络错误"})
    }
  })
}

/*
*01201  capitals/list fail
*01202 statusCode != 200
*01203-xxxxxx 业务逻辑错误
*/
const getAssetList = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + "capitals/list",
    data:{
      userId: getApp().globalData.userInfo.userID
      // capitalsCodePrefix:"01"
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"农资获取成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "01203" + "-" + e.data.code, errorMsg: "农资获取失败" })
        }
      }else{
        p.fail({ errorCode: "01202", errorMsg: "农资获取失败" })
      }
    },
    fail:function(e){
      p.fail({errorCode:"01201",errorMsg:"农资获取失败"})
    }
  })
}

/*
*01301  capitals/save fail
*01302 statusCode != 200
*01303-xxxxxx 业务逻辑错误
*/
const addNewAsset = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + "capitals/save",
    data:{
      userId: getApp().globalData.userInfo.userID,
      capitalsCode:p.code,
      capitalsName:p.name
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"添加成功"})
        }else{
          p.fail({ errorCode: "01303" + "-" + e.data.code, errorMsg: "添加失败" })
        }
      }else{
        p.fail({ errorCode: "01302", errorMsg: "添加失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "01301", errorMsg: "添加失败" })
    }
  })
}

/*
*01401  capitals/delete fail
*01402 statusCode != 200
*01403-xxxxxx 业务逻辑错误
*/
const deleteAssetWithId = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'capitals/delete',
    data:{
      capitalsId:p.assetId
    },
    success: function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"删除成功"})
        }else{
          p.fail({ errorCode: "01403" + "-" + e.data.code, errorMsg: "删除失败" })
        }
      }else{
        p.fail({ errorCode: "01402", errorMsg: "删除失败" })
      }
    },
    fail:function (e){
      p.fail({ errorCode: "01401", errorMsg: "删除失败" })
    }
  })
}


/*
*01501  article/list fail
*01502 statusCode != 200
*01503-xxxxxx 业务逻辑错误
*/
const getArticleList = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + "article/list",
    data:{
      type:p.type
    },
    success: function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({ successMsg: "获取成功", data: e.data.data})
        }else{
          p.fail({ errorCode: "01503" + "-" + e.data.code, errorMsg: "获取失败" })
        }
      }else{
        p.fail({ errorCode: "01502", errorMsg: "获取失败" })
      }
    },
    fail:function(e){
      p.fail({errorCode:"01501",errorMsg:"获取失败"})
    }
  })
}


/*
*01601  article/detail fail
*01602 statusCode != 200
*01603-xxxxxx 业务逻辑错误
*/
const getDetailArticleInfo = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'article/detail',
    data:{
      articleId: p.articleId
    },
    success:function (e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"加载成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "01603" + "-" + e.data.code, errorMsg: "详情获取失败" })
        }
      }else{
        p.fail({ errorCode: "01602", errorMsg: "详情获取失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "01601", errorMsg: "详情获取失败" })
    }
  })
}

/*
*01701  commend/save fail
*01702 statusCode != 200
*01703-xxxxxx 业务逻辑错误
*01704 未登陆
*/
const commendArticle = (p)=>{
  if (getApp().globalData.userInfo == undefined){
    p.fail({errorCode:"01704",errorMsg:"是否前往'我的'界面授权登陆?"})
    return
  }
  if (p.commend.length >= 100) {
    p.fail({ errorCode: "01705", errorMsg: "内容输入过长!" })
    return
  }

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'commend/save',
    data: {
      articleId: p.articleId,
      userId: getApp().globalData.userInfo.userID,
      content: p.commend,
    },

    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "评论成功",data:e.data.data })
        } else {
          p.fail({ errorCode: "01703" + "-" + e.data.code, errorMsg: "评论失败" })
        }
      } else {
        p.fail({ errorCode: "01702", errorMsg: "评论失败" })
      }
    },

    fail: function (e) {
      p.fail({ errorCode: "01701", errorMsg: "评论失败" })
    }

  })
}


/*
*01801  commend/save fail
*01802 statusCode != 200
*01803-xxxxxx 业务逻辑错误
*/
const getCommendList = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + "commend/list",
    data:{
      articleId: p.articleId,
      currentPage:p.page
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"评论获取成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "01803" + "-" + e.data.code, errorMsg: "评论获取失败" })
        }
      }else{
        p.fail({ errorCode: "01802", errorMsg: "评论获取失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "01801", errorMsg: "评论获取失败" })
    }
  })

}

/*
*01901  commend/save fail
*01902 statusCode != 200
*01903-xxxxxx 业务逻辑错误
*01904 未登陆
*/
const commendOtherUser = (p)=>{

  if (!getApp().globalData.userInfo) {
    p.fail({ errorCode: "01904", errorMsg: "是否前往'我的'界面授权登陆?" })
    return
  }

  if(p.commend.length >= 100){
    p.fail({ errorCode: "01905", errorMsg: "内容输入过长!" })
    return
  }

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'commend/save',
    data: {
      articleId: p.articleId,
      userId: getApp().globalData.userInfo.userID,
      content: p.commend,
      targetUserId: p.targetUserId,
      targetCommendId: p.targetCommendId,
      parentCommendId:p.parentCommendId
    },

    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "评论成功",data:e.data.data })
        } else {
          p.fail({ errorCode: "01903" + "-" + e.data.code, errorMsg: "评论失败" })
        }
      } else {
        p.fail({ errorCode: "01902", errorMsg: "评论失败" })
      }
    },

    fail: function (e) {
      p.fail({ errorCode: "01901", errorMsg: "评论失败" })
    }

  })
}


/*
*02001  commend/subCommendList fail
*02002 statusCode != 200
*02003-xxxxxx 业务逻辑错误
*/
const getSubCommendList = (p)=>{
  wx.request({
    method: "POST", 
    url: getApp().globalData.urlHeader + 'commend/subCommendList',
    data:{
      commendId:p.targetCommendId,
      currentPage:p.page
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"获取成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "02003" + "-" + e.data.code, errorMsg: "子评论获取失败" })
        }
      }else{
        p.fail({ errorCode: "02002", errorMsg: "子评论获取失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "02001", errorMsg: "子评论获取失败" })
    }
  })
}

/*
*02101  focus/list fail
*02102 statusCode != 200
*02103-xxxxxx 业务逻辑错误
*/
const getFocusList = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'focus/list',
    data:{
      userId:p.userId
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({ successMsg: "关注列表获取成功", data: e.data.data})
        }else{
          p.fail({ errorCode: "02103" + "-" + e.data.code, errorMsg: "关注列表获取失败" })
        }
      }else{
        p.fail({ errorCode: "02102", errorMsg: "关注列表获取失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "02101", errorMsg: "关注列表获取失败" })
    }
  })
}


/*
*02201  focus/focus fail
*02202 statusCode != 200
*02203-xxxxxx 业务逻辑错误
*/
const focusUser = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'focus/focus',
    data:{
      userId:getApp().globalData.userInfo.userID,
      focusUserId:p.focusUserId
    },
    success:function(e){
      if(e.statusCode == 200){
        if (e.data.code == 600200){
          p.success({successMsg:"关注成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "02203" + "-" + e.data.code, errorMsg: "关注失败" })
        }
      }else{
        p.fail({ errorCode: "02202", errorMsg: "关注失败" })
      }
      
    },
    fail:function(e){
      p.fail({ errorCode: "02201", errorMsg: "关注失败" })
    }
  })
}

/*
*02301  focus/cancel fail
*02302 statusCode != 200
*02303-xxxxxx 业务逻辑错误
*/
const cancelFocus = (p)=>{
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'focus/cancel',
    data: {
      focusId: p.focusId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "已取消" })
        } else {
          p.fail({ errorCode: "02303" + "-" + e.data.code, errorMsg: "取消关注失败" })
        }
      } else {
        p.fail({ errorCode: "02302", errorMsg: "取消关注失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "02301", errorMsg: "取消关注失败" })
    }
  })
}

/*
*02401  collection/articleList fail
*02402 statusCode != 200
*02403-xxxxxx 业务逻辑错误
*/
const getCollectArticleList = (p)=>{
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'collection/articleList',
    data: {
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "收藏列表获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "02403" + "-" + e.data.code, errorMsg: "收藏列表获取失败" })
        }
      } else {
        p.fail({ errorCode: "02402", errorMsg: "收藏列表获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "02401", errorMsg: "收藏列表获取失败" })
    }
  })
}


/*
*02501  collection/collection fail
*02502 statusCode != 200
*02503-xxxxxx 业务逻辑错误
*/
const collectionArticle = (p)=>{

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'collection/collection',
    data: {
      userId: getApp().globalData.userInfo.userID,
      articleId: p.articleId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "收藏成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "02503" + "-" + e.data.code, errorMsg: "收藏失败" })
        }
      } else {
        p.fail({ errorCode: "02502", errorMsg: "收藏失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "02501", errorMsg: "收藏失败" })
    }
  })

}


/*
*02601  collection/cancel fail
*02602 statusCode != 200
*02603-xxxxxx 业务逻辑错误
*/
const cancelCollectionArticle = (p) => {

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'collection/cancel',
    data: {
      userId: getApp().globalData.userInfo.userID,
      articleId: p.articleId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "取消收藏成功" })
        } else {
          p.fail({ errorCode: "02603" + "-" + e.data.code, errorMsg: "取消收藏失败" })
        }
      } else {
        p.fail({ errorCode: "02602", errorMsg: "取消收藏失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "02601", errorMsg: "取消收藏失败" })
    }
  })

}

/*
*02701  deliveryAddress/setDefault fail
*02702 statusCode != 200
*02703-xxxxxx 业务逻辑错误
*/
const settingDefaultAddress = (p)=>{
  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'deliveryAddress/setDefault',
    data:{
      userId: getApp().globalData.userInfo.userID,
      addressId:p.addressId
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"设置成功"})
        }else{
          p.fail({ errorCode: "02703" + "-" + e.data.code, errorMsg: "设置失败" })
        }
      }else{
        p.fail({ errorCode: "02702", errorMsg: "设置失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "02701", errorMsg: "设置失败" })
    }
  })
}


/*
*28
*/
const getLocation = (p)=>{
  
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var qqMapWX = require("../libs/qqmap-wx-jssdk1/qqmap-wx-jssdk.js")

      var map = new qqMapWX({
        key:"SOZBZ-RGUKU-ZT6V3-2EXBX-HRNE7-RHFVI"
      })

      map.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
          //输出一下位置信息
          var address_component = res.result.address_component
          var detailLocation = { province: address_component.province, city: address_component.city, district: address_component.district, street: address_component.street }
          p.success({ successMsg: "获取成功", data: detailLocation})
            },
            fail: function (res) {
              p.fail(res)
            }
      })
      
    },
    fail: function (res) {
      p.fail(res)
    }
  })
}

const accessAndAnalysisLocation = (s)=>{
  var res1 = getApp().globalData.userLocation
  if (res1){
    s.success({ successMsg: "地址获取OK", data: res1 })
    return
  }
  var res2 = wx.getStorageSync("userLocation")
  if (res2){
    s.success({ successMsg: "地址获取OK", data: res2 })
    getApp().globalData.userLocation = res2
    return
  }
  wx.getSetting({
    success: function (res) {
      if (res.authSetting["scope.userLocation"]) {
        //已开启位置权限
        getLocation({
          success: function (p) {
            getApp().globalData.userLocation = p.data
            wx.setStorage({
              key: 'userLocation',
              data: p.data,
              success: function () {
                s.success({ successMsg: "地址获取OK", data: p.data})
              },
              fail: function () {
                s.fail({errorMsg:"地址获取失败"})
              }
            })
          },
          fail: function (e) {
            s.fail({ errorMsg: "地址获取失败" })
          }
        })
      } else {
        wx.authorize({
          scope: 'scope.userLocation',
          success(res) {
            //已开启位置权限
            getLocation({
              success: function (p) {
                getApp().globalData.userLocation = p.data
                wx.setStorage({
                  key: 'userLocation',
                  data: p.data,
                  success: function () {
                    s.success({ successMsg: "地址获取OK", data: p.data })
                  },
                  fail: function () {
                    s.fail({ errorMsg: "地址获取失败" })
                  }
                })
              },
              fail: function (e) {
                s.fail({ errorMsg: "地址获取失败" })
              }
            })
          },
          fail(res) {
            wx.showModal({
              title: '提示',
              content: '位置获取权限被限制,立即前往设置界面开启定位权限!',
              success: function (res) {

                if(res.cancel){
                  return
                }

                wx.openSetting({
                  success: function (e) {
                    //已开启位置权限
                    getLocation({
                      success: function (p) {
                        getApp().globalData.userLocation = p.data
                        wx.setStorage({
                          key: 'userLocation',
                          data: p.data,
                          success: function () {
                            s.success({ successMsg: "地址获取OK", data: p.data })
                          },
                          fail: function () {
                            s.fail({ errorMsg: "地址获取失败" })
                          }
                        })
                      },
                      fail: function (e) {
                        s.fail({ errorMsg: "地址获取失败" })
                      }
                    })
                  },
                  fail: function (e) {
                    //未开启位置权限
                    s.fail({ errorMsg: "地址获取失败" })
                  }
                })
              }
            })
          }
        })
      }
    },
    fail:function(){
      s.fail({ errorMsg: "地址获取失败" })
    }
  })
}

/*
*02901  question/publish fail
*02902 statusCode != 200
*02903-xxxxxx 业务逻辑错误
*/
const releaseQuestion = (p)=>{
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/publish',
    data:{
      userId: getApp().globalData.userInfo.userID,
      title:p.title,
      questionIntro:p.description,
      province:p.province,
      city:p.city,
      area:p.area,
      address:p.address,
      relativeCrops: p.relativeCrops
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"发布主体信息成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "02903" + "-" + e.data.code, errorMsg: "发布主体信息失败" })
        }
      }else{
        p.fail({ errorCode: "02902", errorMsg: "发布主体信息失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "02901", errorMsg: "发布主体信息失败" })
    }

  })
}


/*
*03001  question/uploadImage fail
*03002 statusCode != 200
*03003-xxxxxx 业务逻辑错误
*/
const uploadImgForQuestion = (p)=>{


  wx.uploadFile({
    url: getApp().globalData.urlHeader + "question/uploadImage",
    filePath: p.filePath,
    name: 'image',
    formData:{
      questionId: p.questionId
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({ successMsg: "信息图片成功" })
        }else{
          p.fail({ errorCode: "03003" + "-" + e.data.code, errorMsg: "信息图片上传失败" })
        }
      }else{
        p.fail({ errorCode: "03002", errorMsg: "信息图片上传失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "03001", errorMsg: "信息图片上传失败" })
    }
  })
}

/*
*03101  question/list fail
*03102 statusCode != 200
*03103-xxxxxx 业务逻辑错误
*/
const getQuestionList = (p)=>{
  var data = null
  if(p.userId){
    data = {
      currentPage:p.page,
      userId:p.userId
      }
  }else{
    data = {
      currentPage: p.page
    }
  }
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/list',
    data: data,
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"问答列表获取成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "03103"+"-" + e.data.code, errorMsg: "问答列表获取失败" })
        }
      }else{
        p.fail({ errorCode: "03102", errorMsg: "问答列表获取失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "03101", errorMsg: "问答列表获取失败" })
    }
  })
}

/*
*03201  supplyDemand/publish fail
*03202 statusCode != 200
*03203-xxxxxx 业务逻辑错误
*/
const releaseBuyAndSell = (p)=>{

  wx.request({
    method:"POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/publish',
    data:{
      userId: getApp().globalData.userInfo.userID,
      type:p.type,
      goodsType:p.goodsType,
      goodsTypeCode:p.goodsTypeCode,
      title:p.title,
      unit:p.unit,
      goodsNum:p.goodsNum,
      goodsPrice:p.goodsPrice,
      contactPhone:p.phoneNumber,
      locationName:p.location,
      locationCode:p.locationCode,
      description:p.description
    },
    success:function(e){
      if(e.statusCode == 200){
        if(e.data.code == 600200){
          p.success({successMsg:"发布成功",data:e.data.data})
        }else{
          p.fail({ errorCode: "03203" + "-" + e.data.code, errorMsg: "供求发布失败" })
        }
      }else{
        p.fail({ errorCode: "03202", errorMsg: "供求发布失败" })
      }
    },
    fail:function(e){
      p.fail({ errorCode: "03201", errorMsg: "供求发布失败" })
    }
  })
}

/*
*03301  supplyDemand/uploadImage fail
*03302 statusCode != 200
*03303-xxxxxx 业务逻辑错误
*/
const uploadImgForBuyAndSell = (p) => {


  wx.uploadFile({
    url: getApp().globalData.urlHeader + "supplyDemand/uploadImage",
    filePath: p.filePath,
    name: 'image',
    formData: {
      supplyDemandId: p.supplyDemandId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "信息图片成功" })
        } else {
          p.fail({ errorCode: "03303" + "-" + e.data.code, errorMsg: "信息图片上传失败" })
        }
      } else {
        p.fail({ errorCode: "03302", errorMsg: "信息图片上传失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03301", errorMsg: "信息图片上传失败" })
    }
  })
}

/*
*03401  supplyDemand/list fail
*03402 statusCode != 200
*03403-xxxxxx 业务逻辑错误
*/
const getBuyAndSellList = (p)=>{
  var data = null
  if(p.userId){
    data = {
      userId: p.userId,
      currentPage: p.page,
      type: p.type
    }
  }else{
    data = {
      currentPage: p.page,
      type: p.type
    }
  }
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/list',
    data: data,
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "供求列表获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03403" + "-" + e.data.code, errorMsg: "供求列表获取失败" })
        }
      } else {
        p.fail({ errorCode: "03402", errorMsg: "供求列表获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03401", errorMsg: "供求列表获取失败" })
    }
  })
}


/*
*03501  question/detail fail
*03502 statusCode != 200
*03503-xxxxxx 业务逻辑错误
*/
const getQuestionDetail = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/detail',
    data: {
      userId: getApp().globalData.userInfo.userID,
      questionId: p.questionId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "问题详情获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03503" + "-" + e.data.code, errorMsg: "问题详情获取失败" })
        }
      } else {
        p.fail({ errorCode: "03502", errorMsg: "问题详情获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03501", errorMsg: "问题详情获取失败" })
    }
  })
}


/*
*03601  answer/list fail
*03602 statusCode != 200
*03603-xxxxxx 业务逻辑错误
*/
const getQuestionRespondList = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'answer/list',
    data: {
      questionId: p.questionId,
      currentPage: p.page
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "回答列表获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03603" + "-" + e.data.code, errorMsg: "回答列表获取失败" })
        }
      } else {
        p.fail({ errorCode: "03602", errorMsg: "回答列表获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03601", errorMsg: "回答列表获取失败" })
    }
  })
}


/*
*03701  question/focus fail
*03702 statusCode != 200
*03703-xxxxxx 业务逻辑错误
*/
const focusQuestion = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/focus',
    data: {
      questionId: p.questionId,
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {

          p.success({ successMsg: "收藏成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03703" + "-" + e.data.code, errorMsg: "收藏失败" })
        }
      } else {
        p.fail({ errorCode: "03702", errorMsg: "收藏失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03701", errorMsg: "收藏失败" })
    }
  })
}


/*
*03801  question/cancelFocus fail
*03802 statusCode != 200
*03803-xxxxxx 业务逻辑错误
*/
const cancelFocusQuestion = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/cancelFocus',
    data: {
      questionId: p.questionId,
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {

          p.success({ successMsg: "取消收藏成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03803" + "-" + e.data.code, errorMsg: "取消收藏失败" })
        }
      } else {
        p.fail({ errorCode: "03802", errorMsg: "取消收藏失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03801", errorMsg: "取消收藏失败" })
    }
  })
}

/*
*03901  answer/answer fail
*03902 statusCode != 200
*03903-xxxxxx 业务逻辑错误
*/
const answerQuestion = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'answer/answer',
    data: {
      questionId: p.questionId,
      userId: getApp().globalData.userInfo.userID,
      content:p.content
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {

          p.success({ successMsg: "提交成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "03903" + "-" + e.data.code, errorMsg: "提交失败" })
        }
      } else {
        p.fail({ errorCode: "03902", errorMsg: "提交失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "03901", errorMsg: "提交失败" })
    }
  })
}

/*
*04001  answer/oppose fail
*04002 statusCode != 200
*04003-xxxxxx 业务逻辑错误
*/
const againstAnswer = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'answer/oppose',
    data: {
      answerId: p.answerId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "反对+1", data: e.data.data })
        } else {
          p.fail({ errorCode: "04003" + "-" + e.data.code, errorMsg: "提交失败" })
        }
      } else {
        p.fail({ errorCode: "04002", errorMsg: "提交失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04001", errorMsg: "提交失败" })
    }
  })
}

/*
*04101  answer/support fail
*04102 statusCode != 200
*04103-xxxxxx 业务逻辑错误
*/
const zanAnswer = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'answer/support',
    data: {
      answerId: p.answerId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "赞成+1", data: e.data.data })
        } else {
          p.fail({ errorCode: "04103" + "-" + e.data.code, errorMsg: "提交失败" })
        }
      } else {
        p.fail({ errorCode: "04102", errorMsg: "提交失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04101", errorMsg: "提交失败" })
    }
  })
}

/*
*04201  supplyDemand/detail fail
*04202 statusCode != 200
*04203-xxxxxx 业务逻辑错误
*/
const supplyDemandDetail = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/detail',
    data: {
      supplyDemandId: p.supplyDemandId,
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "04203" + "-" + e.data.code, errorMsg: "供求获取失败" })
        }
      } else {
        p.fail({ errorCode: "04202", errorMsg: "供求获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04201", errorMsg: "供求获取失败" })
    }
  })
}

/*
*04301  supplyDemand/focus fail
*04302 statusCode != 200
*04303-xxxxxx 业务逻辑错误
*/
const supplyDemandFocus = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/focus',
    data: {
      supplyDemandId: p.supplyDemandId,
      type:p.type,
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "收藏成功"})
        } else {
          p.fail({ errorCode: "04303" + "-" + e.data.code, errorMsg: "收藏失败" })
        }
      } else {
        p.fail({ errorCode: "04302", errorMsg: "收藏失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04301", errorMsg: "收藏失败" })
    }
  })
}


/*
*04401  supplyDemand/cancelFocus fail
*04402 statusCode != 200
*04403-xxxxxx 业务逻辑错误
*/
const supplyDemandCancelFocus = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/cancelFocus',
    data: {
      supplyDemandId: p.supplyDemandId,
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "取消成功" })
        } else {
          p.fail({ errorCode: "04403" + "-" + e.data.code, errorMsg: "取消失败" })
        }
      } else {
        p.fail({ errorCode: "04402", errorMsg: "取消失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04401", errorMsg: "取消失败" })
    }
  })
}

/*
*04501  question/focusQuestionList fail
*04502 statusCode != 200
*04503-xxxxxx 业务逻辑错误
*/
const userMarkQuestionList = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/focusQuestionList',
    data: {
      currentPage:p.page,
      userId: p.userId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "加载成功",data:e.data.data })
        } else {
          p.fail({ errorCode: "04503" + "-" + e.data.code, errorMsg: "加载失败" })
        }
      } else {
        p.fail({ errorCode: "04502", errorMsg: "加载失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04501", errorMsg: "加载失败" })
    }
  })
}


/*
*04601  supplyDemand/focusList fail
*04602 statusCode != 200
*04603-xxxxxx 业务逻辑错误
*/
const userMarkSupplyOrDemandList = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/focusList',
    data: {
      currentPage: p.page,
      userId: p.userId,
      type: p.type
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "加载成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "04603" + "-" + e.data.code, errorMsg: "加载失败" })
        }
      } else {
        p.fail({ errorCode: "04602", errorMsg: "加载失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04601", errorMsg: "加载失败" })
    }
  })
}

/*
*04701  job/publish fail
*04702 statusCode != 200
*04703-xxxxxx 业务逻辑错误
*/
const releaseWork = (p) => {
  var data = {
    userId: getApp().globalData.userInfo.userID,
    status: p.status,
    jobCat: p.workTimeType,
    payType: p.payMoneyType,
    salary: p.money,
    time: p.workTime,
    welfare: p.attract,
    contact: p.name,
    contactPhone: p.phoneNumber,
    location: p.location,
    address: p.detailLocation,
    jobDescription: p.workDescription
  }
  if(p.jobId){
    data["jobId"] = p.jobId
  }
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'job/publish',
    data: data,
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "发布成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "04703" + "-" + e.data.code, errorMsg: "发布失败" })
        }
      } else {
        p.fail({ errorCode: "04702", errorMsg: "发布失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04701", errorMsg: "发布失败" })
    }
  })
}

/*
*04801  job/list fail
*04802 statusCode != 200
*04803-xxxxxx 业务逻辑错误
*/
const getJobList = (p) => {
  var data = {currentPage:p.page}
  if(p.status){
    data["status"] = p.status
  }
  if(p.userId){
    data["userId"] = p.userId
  }
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'job/list',
    data: data,
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "04803" + "-" + e.data.code, errorMsg: "获取失败" })
        }
      } else {
        p.fail({ errorCode: "04802", errorMsg: "获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04801", errorMsg: "获取失败" })
    }
  })
}


/*
*04901  user/personalIntro fail
*04902 statusCode != 200
*04903-xxxxxx 业务逻辑错误
*/
const getSomeBodyInfo = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'user/personalIntro',
    data: {
      userId: p.userId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "04903" + "-" + e.data.code, errorMsg: "获取失败" })
        }
      } else {
        p.fail({ errorCode: "04902", errorMsg: "获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "04901", errorMsg: "获取失败" })
    }
  })
}

/*
*05001  question/edit fail
*05002 statusCode != 200
*05003-xxxxxx 业务逻辑错误
*/
const editQuestion = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/edit',
    data: {
      questionId: p.questionId,
      userId: getApp().globalData.userInfo.userID,
      title:p.title,
      questionIntro: p.questionIntro,
      relativeCrops: p.relativeCrops,
      province: p.province,
      city:p.city,
      area:p.area,
      address:p.address,
      deleteImages: p.deleteImages
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "编辑成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05003" + "-" + e.data.code, errorMsg: "编辑失败" })
        }
      } else {
        p.fail({ errorCode: "05002", errorMsg: "编辑失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05001", errorMsg: "编辑失败" })
    }
  })
}


/*
*05101  supplyDemand/edit fail
*05102 statusCode != 200
*05103-xxxxxx 业务逻辑错误
*/
const editSupplyAndDemand = (p) => {

  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/edit',
    data: {
      supplyDemandId: p.supplyDemandId,
      userId: getApp().globalData.userInfo.userID,
      type: p.type,
      goodsType: p.goodsType,
      goodsTypeCode: p.goodsTypeCode,
      title: p.title,
      unit: p.unit,
      goodsNum: p.goodsNum,
      goodsPrice: p.goodsPrice,
      contactPhone: p.contactPhone,
      locationName: p.locationName,
      locationCode:p.locationCode,
      description: p.description,
      deleteImages: p.deleteImages
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "编辑成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05103" + "-" + e.data.code, errorMsg: "编辑失败" })
        }
      } else {
        p.fail({ errorCode: "05102", errorMsg: "编辑失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05101", errorMsg: "编辑失败" })
    }
  })
}



/*
*05201  question/delete fail
*05202 statusCode != 200
*05203-xxxxxx 业务逻辑错误
*/
const deleteMyQuestion = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'question/delete',
    data: {
      questionId: p.questionId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "删除成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05203" + "-" + e.data.code, errorMsg: "删除失败" })
        }
      } else {
        p.fail({ errorCode: "05202", errorMsg: "删除失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05201", errorMsg: "删除失败" })
    }
  })
}


/*
*05301  supplyDemand/delete fail
*05302 statusCode != 200
*05303-xxxxxx 业务逻辑错误
*/
const deleteMySupplyDemand = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'supplyDemand/delete',
    data: {
      supplyDemandId: p.supplyDemandId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "删除成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05303" + "-" + e.data.code, errorMsg: "删除失败" })
        }
      } else {
        p.fail({ errorCode: "05302", errorMsg: "删除失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05301", errorMsg: "删除失败" })
    }
  })
}

/*
*05401  job/edit fail
*05402 statusCode != 200
*05403-xxxxxx 业务逻辑错误
*/
const editJob = (p) => {
  var data = {
    userId: getApp().globalData.userInfo.userID,
    status: p.status,
    jobCat: p.workTimeType,
    payType: p.payMoneyType,
    salary: p.money,
    time: p.workTime,
    welfare: p.attract,
    contact: p.name,
    contactPhone: p.phoneNumber,
    location: p.location,
    address: p.detailLocation,
    jobDescription: p.workDescription
  }
  if (p.jobId) {
    data["jobId"] = p.jobId
  }
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + 'job/edit',
    data: data,
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "编辑成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05403" + "-" + e.data.code, errorMsg: "编辑失败" })
        }
      } else {
        p.fail({ errorCode: "05402", errorMsg: "编辑失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05401", errorMsg: "编辑失败" })
    }
  })
}

/*
*05501  job/delete fail
*05502 statusCode != 200
*05503-xxxxxx 业务逻辑错误
*/
const deleteMyReleaseJob = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + "job/delete",
    data: {
      jobId: p.jobId
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "删除成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05503" + "-" + e.data.code, errorMsg: "删除失败" })
        }
      } else {
        p.fail({ errorCode: "05502", errorMsg: "删除失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05501", errorMsg: "删除失败" })
    }
  })
}


/*
*05601  user/personalCenter fail
*05602 statusCode != 200
*05603-xxxxxx 业务逻辑错误
*/
const personalCenterInfo = (p) => {
  wx.request({
    method: "POST",
    url: getApp().globalData.urlHeader + "user/personalCenter",
    data: {
      userId: getApp().globalData.userInfo.userID
    },
    success: function (e) {
      if (e.statusCode == 200) {
        if (e.data.code == 600200) {
          p.success({ successMsg: "获取成功", data: e.data.data })
        } else {
          p.fail({ errorCode: "05603" + "-" + e.data.code, errorMsg: "获取失败" })
        }
      } else {
        p.fail({ errorCode: "05602", errorMsg: "获取失败" })
      }
    },
    fail: function (e) {
      p.fail({ errorCode: "05601", errorMsg: "获取失败" })
    }
  })
}


module.exports = {
  myLogin: myLogin,
  getCropList: getCropList,
  deleteCropWithId: deleteCropWithId,
  updateCropSize: updateCropSize,
  addNewCrop: addNewCrop,
  getAddressList: getAddressList,
  saveAddress: saveAddress,
  deleteAddressWithID: deleteAddressWithID,
  updateAddress: updateAddress,
  getPhoneVerifyNumber: getPhoneVerifyNumber,
  bindPhoneNumber: bindPhoneNumber,
  getAssetList: getAssetList,
  addNewAsset: addNewAsset,
  deleteAssetWithId: deleteAssetWithId,
  getArticleList: getArticleList,
  getDetailArticleInfo: getDetailArticleInfo,
  commendArticle: commendArticle,
  getCommendList: getCommendList,
  commendOtherUser: commendOtherUser,
  getSubCommendList: getSubCommendList,
  getFocusList: getFocusList,
  focusUser: focusUser,
  cancelFocus: cancelFocus,
  getCollectArticleList: getCollectArticleList,
  collectionArticle: collectionArticle,
  cancelCollectionArticle: cancelCollectionArticle,
  settingDefaultAddress: settingDefaultAddress,
  getLocation: getLocation,
  accessAndAnalysisLocation: accessAndAnalysisLocation,
  releaseQuestion: releaseQuestion,
  uploadImgForQuestion: uploadImgForQuestion,
  getQuestionList: getQuestionList,
  releaseBuyAndSell: releaseBuyAndSell,
  uploadImgForBuyAndSell: uploadImgForBuyAndSell,
  getBuyAndSellList: getBuyAndSellList,
  getQuestionDetail: getQuestionDetail,
  getQuestionRespondList: getQuestionRespondList,
  focusQuestion: focusQuestion,
  cancelFocusQuestion: cancelFocusQuestion,
  answerQuestion: answerQuestion,
  againstAnswer: againstAnswer,
  zanAnswer: zanAnswer,
  supplyDemandDetail: supplyDemandDetail,
  supplyDemandFocus: supplyDemandFocus,
  supplyDemandCancelFocus: supplyDemandCancelFocus,
  userMarkQuestionList: userMarkQuestionList,
  userMarkSupplyOrDemandList: userMarkSupplyOrDemandList,
  releaseWork: releaseWork,
  getJobList: getJobList,
  getSomeBodyInfo: getSomeBodyInfo,
  editQuestion: editQuestion,
  editSupplyAndDemand: editSupplyAndDemand,
  deleteMyQuestion: deleteMyQuestion,
  deleteMySupplyDemand: deleteMySupplyDemand,
  editJob: editJob,
  deleteMyReleaseJob: deleteMyReleaseJob,
  personalCenterInfo: personalCenterInfo
}