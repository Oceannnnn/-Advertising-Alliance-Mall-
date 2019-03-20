// pages/adNotice/adNotice.js
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad(op) {
    if(op.type==2){
      wx.setNavigationBarTitle({
        title: '温馨提示',
      })
    }
    util.http('ad/notice_info', {
      id: op.id,type:op.type
    }, 'post').then(res => {
      if (res.code == 200) {
        WxParse.wxParse('details', 'html', res.data.content, this, 0)
      }
    })
  }
})