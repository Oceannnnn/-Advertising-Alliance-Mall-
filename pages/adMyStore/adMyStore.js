// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    main.uploadFormIds();
    this.init()
    if (op.back) {
      this.setData({
        back: op.back
      })
    }
  },
  init() {
    this.setData({
      pic: "../../images/wu.png",
      name: "XXX",
      visits: 0,
      collection: 0,
      stick: app.globalData.stick
    })
    let token = app.globalData.token;
    util.http('ad/user', {}, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        this.setData({
          pic: info.st_pic,
          name: info.st_name,
          visits: info.st_visitor,
          collection: info.st_collect,
          guild: info.guild,
          st_id: info.st_id
        })
      }
    })
  },
  adSettled(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let id = this.data.guild;
    let st_id = this.data.st_id;
    wx.navigateTo({
      url: '../AdSettled/AdSettled?id=' + id + '&setin=1' + '&st_id=' + st_id
    })
  },
  adStore(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "adStore");
  },
  adStick(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    wx.navigateTo({
      url: '../adStick/adStick'
    })
  },
  bindadMold() {
    wx.navigateTo({
      url: '../adMold/adMold?type=2'
    })
  },
  adMold(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    wx.navigateTo({
      url: '../adMold/adMold?type=1'
    })
  },
  onUnload() {
    if (this.data.back) {
      wx.switchTab({
        url: '../my/my',
      })
    }
  }
})