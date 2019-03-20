// pages/serviceType/serviceType.js
const app = getApp();
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    main.uploadFormIds();
    this.setData({
      type: op.type //type:1 发布/2为入驻
    })
    let list = [];
    if (op.type == 1) {
      list = [{
        head: "图文",
        text: "拍照或相册上传",
        type: 1
      }, {
        head: "文章",
        text: "公众号文章",
        type: 2
      }]
    } else {
      list = [{
        head: "广告类",
        text: "传达出平面的信息、品牌、形象",
        id: 1
      }, {
        head: "家装类",
        text: "家庭住宅装修装饰",
        id: 2
      }]
    }
    this.setData({
      list: list
    })
  },
  toNext(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (id != undefined) {
      wx.navigateTo({
        url: '../AdSettled/AdSettled?id=' + id
      })
    }
    if (type) {
      wx.navigateTo({
        url: '../adinformationRelease/adinformationRelease?id=' + type
      })
    }
  }
})