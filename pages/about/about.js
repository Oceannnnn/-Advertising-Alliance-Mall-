const app = getApp()
const main = require('../../utils/main.js');
Page({
  data: {
  },
  onLoad() {
    main.uploadFormIds();
    this.setData({
      name: app.globalData.name,
      phone: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      logo: app.globalData.logo,
      markers: [{
        iconPath: "../../images/add.png",
        id: 0,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        width: 30,
        height: 30
      }]
    })
  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toPosition() {
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      name: this.data.address,
      scale: 15
    })
  },
  miniProgram(){
    wx.navigateToMiniProgram({
      appId: 'wx1773ca9a5221af5b',
      path: 'page/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  onShareAppMessage() {
    let invite_code = ""
    if (wx.getStorageSync("invite_code")) {
      invite_code = wx.getStorageSync("invite_code");
    }
    return {
      title: '联盟分享指南：点开允许--加盟申请--允许--详填资料--提交成功！',
      path: '/pages/index/index?invite_code=' + invite_code
    }
  }
})