const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    this.init()
  },
  init() {
    this.setData({
      store_name:'',
      name:'',
      password:''
    })
    main.uploadFormIds();
    let token = app.globalData.token;
    util.http('user/has_apply', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          domain: res.data.domain,
          store_status: res.data.store_status //0是审核中，1是可用，2是关闭，3是未申请
        })
      }
    })
  },
  bindStore_name(e) {
    this.setData({
      store_name: e.detail.value
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindtap(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.uploadFormIds();
    var store_name = this.data.store_name,
      name = this.data.name,
      password = this.data.password;
    if (store_name=='') {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none'
      })
      return
    }
    if (name == '') {
      wx.showToast({
        title: '请输入登入账号',
        icon: 'none'
      })
      return
    }
    if (password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    let token = app.globalData.token;
    let json = {
      store_name: store_name,
      name: name,
      password: password,
    }
    util.http("user/apply_store", json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '申请成功',
          icon: 'none'
        }) 
        this.init()
      }
    })
  }
})