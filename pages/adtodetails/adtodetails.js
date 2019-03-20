// pages/adStore/adStore.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    main.uploadFormIds();
    if (app.globalData.state == 1) {
      this.init(op.id)
    } else {
      wx.reLaunch({
        url: '../toLogin/toLogin',
      })
    }
  },
  init(id) {
    this.setData({
      list: [],
      currentId: 1,
      ad_list: [{
          text: '评论',
          id: 1,
          type: "1"
        },
        {
          text: '点赞',
          id: 2,
          type: "2"
        }
      ],
    })
    let token = app.globalData.token;
    util.http('article/info', {
      id: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        this.setData({
          info: info,
          list: info.plun,
          plun: info.plun,
          zan: info.zan,
          id: id,
          has_zan: info.has_zan
        })
      }
    })
  },
  toCall(e) {
    let mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  bindtapAd(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let list = this.data.list;
    if (type == 1) {
      list = this.data.plun
    } else {
      list = this.data.zan
    }
    this.setData({
      currentId: id,
      type: type,
      list: list
    })
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = e.currentTarget.dataset.arr;
    let imgArr = [];
    for (var i = 0; i < arr.length; i++) {
      imgArr.push(arr[i].image)
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址 
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
    })
  },
  collect(e) {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      let collect = e.currentTarget.dataset.collect;
      let id = e.currentTarget.dataset.id;
      let head_img = e.currentTarget.dataset.head_img;
      let nick_name = e.currentTarget.dataset.nick_name;
      let dynamicList = this.data.dynamicList;
      let zan = this.data.zan;
      let has_zan = this.data.has_zan;
      if (collect == 0) {
        has_zan = 1;
        let json = {
          head_img: head_img,
          nick_name: nick_name
        }
        zan.unshift(json);
        this.setData({
          zan: zan,
          has_zan: has_zan
        })
        if (this.data.currentId == 2) {
          this.setData({
            list: zan
          })
        }
        util.http('article/add_zan', {
          id: id
        }, 'post', token).then(res => {
          if (res.code == 200) {}
        })
      } else {
        wx.showToast({
          title: '已点过赞',
          icon: 'none'
        })
      }
    } else {
      main.goLogin(1)
    }
  },
  add_plun(e) {
    if (app.globalData.state == 1) {
      let comment = e.detail.value;
      let token = app.globalData.token;
      let id = e.currentTarget.dataset.id;
      let head_img = e.currentTarget.dataset.head_img;
      let nick_name = e.currentTarget.dataset.nick_name;
      let plun = this.data.plun;
      let myDate = new Date();
      let add_time = util.formatTime(myDate)
      let json = {
        head_img: head_img,
        nick_name: nick_name,
        comment: comment,
        add_time: add_time
      }
      util.http('article/add_plun', {
        id: id,
        comment: comment
      }, 'post', token).then(res => {
        if (res.code == 200) {
          plun.unshift(json);
          this.setData({
            plun: plun,
            value: ''
          })
          if (this.data.currentId == 1) {
            this.setData({
              list: plun
            })
          }
        }
      })
    } else {
      main.goLogin(1)
    }
  },
  bindtapStore(e) {
    main.toDetails(e, "adStore")
  },
  onShareAppMessage() {
    let id = this.data.id;
    return {
      title: '联盟分享指南：点开允许--加盟申请--允许--详填资料--提交成功！',
      path: '/pages/adStore/adStore?id=' + id
    }
  }
})