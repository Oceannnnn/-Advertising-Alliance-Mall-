// pages/adStore/adStore.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    this.init(op.id)
  },
  init(id) {
    main.uploadFormIds();
    let token = app.globalData.token;
    util.http('ad/store_info', {
      st_id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        let imgUrls = info.images;
        wx.setNavigationBarTitle({
          title: info.st_name,
        })
        this.setData({
          imgUrls: imgUrls,
          info: info,
          id: id,
          dynamicList: info.article,
          collect: info.collect
        })
      }
    })
  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.info.st_mobile
    })
  },
  toPosition() {
    wx.openLocation({
      latitude: Number(this.data.info.st_latitude),
      longitude: Number(this.data.info.st_longitude),
      name: this.data.info.st_address,
      scale: 15
    })
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = e.currentTarget.dataset.arr;
    let type = e.currentTarget.dataset.type;
    let imgArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (type == 0) {
        imgArr.push(arr[i].image)
      } else {
        imgArr.push(arr[i].img_url)
      }
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址 
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  todetails(e) {
    main.toDetails(e, "adtodetails")
  },
  adDynamicList(e) {
    let st_id = e.currentTarget.dataset.st_id;
    wx.navigateTo({
      url: '../adDynamicList/adDynamicList?st_id=' + st_id
    })
  },
  collectStore(e) {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      let collect = e.currentTarget.dataset.collect;
      util.http('ad/collect', {
        st_id: this.data.id
      }, 'post', token).then(res => {
        if (res.code == 200) {
          if (this.data.collect == 0) {
            this.setData({
              collect: 1
            })
          } else {
            this.setData({
              collect: 0
            })
          }
        }
      })
    } else {
      main.goLogin(1)
    }
  },
  onShareAppMessage() {
    let id = this.data.id;
    return {
      title: '联盟分享指南：点开允许--加盟申请--允许--详填资料--提交成功！',
      path: '/pages/adStore/adStore?id=' + id
    }
  }
})