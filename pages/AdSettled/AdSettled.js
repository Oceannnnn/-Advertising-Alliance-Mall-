// pages/AdSettled/AdSettled.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    imgbox: [],
    st_imgbox: [],
    image: {},
    open_time: '',
    st_pic: '',
    st_id: '',
    comhidden:true
  },
  onLoad(op) {
    let st_id = op.st_id;
    let guild = op.id;
    let setin = op.setin;
    this.init(guild, setin, st_id);
    main.uploadFormIds();
  },
  onShow() {
    this.getSetting()
  },
  getSetting() {//判断是否获得了用户地理位置授权
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation'])
          that.openConfirm()
      }
    })
  },
  openConfirm() {
    this.setData({
      comhidden:false
    })
  },
  bindopensetting(e){
    this.setData({
      comhidden: true
    })
  },
  init(guild, setin, st_id) {
    util.http('ad/stick_info', {
      guild: guild
    }, 'post').then(res => {
      if (res.code == 200) {
        let service = res.data.service;
        this.setData({
          service: res.data.service,
          cate: res.data.cate,
          opentime: res.data.open_time
        })
        if (setin) {
          wx.setNavigationBarTitle({
            title: '编辑店铺'
          })
          this.setin(st_id)
        }
      }
    })
  },
  setin(st_id) {
    let token = app.globalData.token;
    util.http('ad/edit', {
      st_id: st_id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        let service = this.data.service;
        if (info.is_wifi == 1) {
          service[0].checked = true
        }
        if (info.is_park == 1) {
          service[1].checked = true
        }
        if (info.is_wx_pay == 1) {
          service[2].checked = true
        }
        if (info.is_zfb_pay == 1) {
          service[3].checked = true
        }
        let cate = this.data.cate;
        let cate_id = info.cate_id;
        let indexCate = this.data.indexCate;
        for (var i = 0; i < cate.length; i++) {
          if (cate_id == cate[i].id) {
            indexCate = i
          }
        }
        this.setData({
          st_pic: info.st_pic,
          st_name: info.st_name,
          st_address: info.st_address,
          is_wifi: info.is_wifi,
          is_park: info.is_park,
          is_wx_pay: info.is_wx_pay,
          is_zfb_pay: info.is_zfb_pay,
          open_time: info.open_time,
          st_content: info.st_content,
          imgbox: info.imgbox,
          st_mobile: info.st_mobile,
          cate_id: cate_id,
          service: service,
          st_id: st_id,
          indexCate: indexCate
        })
      }
    })
  },
  location() {
    this.getSetting();
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          st_address: res.address
        })
      }
    })
  },
  bindName(e) {
    this.setData({
      st_name: e.detail.value
    })
  },
  bindMobile(e) {
    this.setData({
      st_mobile: e.detail.value
    })
  },
  bindTime(e) {
    this.setData({
      open_time: e.detail.value
    })
  },
  bindContent(e) {
    this.setData({
      st_content: e.detail.value
    })
  },
  serviceChange(e) {
    let valueArr = e.detail.value;
    let service = this.data.service;
    if (valueArr != '') {
      if (valueArr.indexOf("0") != -1) {
        service[0].is_wifi = 1;
        service[0].checked = true;
      } else {
        service[0].is_wifi = 0;
        service[0].checked = false;
      }
      if (valueArr.indexOf("1") != -1) {
        service[1].is_park = 1;
        service[1].checked = true;
      } else {
        service[1].is_park = 0;
        service[1].checked = false;
      }
      if (valueArr.indexOf("2") != -1) {
        service[2].is_wx_pay = 1;
        service[2].checked = true;
      } else {
        service[2].is_wx_pay = 0;
        service[2].checked = false;
      }
      if (valueArr.indexOf("3") != -1) {
        service[3].is_zfb_pay = 1;
        service[3].checked = true;
      } else {
        service[3].is_zfb_pay = 0;
        service[3].checked = false;
      }
      this.setData({
        is_wifi: service[0].is_wifi,
        is_park: service[1].is_park,
        is_wx_pay: service[2].is_wx_pay,
        is_zfb_pay: service[3].is_zfb_pay
      })
    } else {
      this.setData({
        is_wifi: 0,
        is_park: 0,
        is_wx_pay: 0,
        is_zfb_pay: 0
      })
    }
    this.setData({
      service: service
    })
  },
  bindCate(e) {
    let indexCate = e.detail.value;
    let cate = this.data.cate;
    let cate_id = cate[indexCate].id;
    this.setData({
      indexCate: indexCate,
      cate_id: cate_id
    })
  },
  delImage(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1);
    this.setData({
      imgbox: imgbox
    });
  },
  upload(e) {
    let that = this;
    let n = e.currentTarget.dataset.count;
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePat
        let tempFilePaths = res.tempFilePaths;
        that.uploadimg(tempFilePaths, n);
      }
    })
  },
  uploadimg(arr, n) {
    let token = app.globalData.token;
    let box = [];
    if (n == 1) {
      box = this.data.st_imgbox
    } else if (n == 9) {
      let imgbox = this.data.imgbox
      box = imgbox;
      if (box == '') {
        box = []
      }
    }
    let image = this.data.image;
    for (var i = 0; i < arr.length; i++) {
      var that = this;
      wx.uploadFile({
        url: util.u + "order/uploads",
        filePath: arr[i],
        name: 'file[]', //这里根据自己的实际情况改,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
          token: token
        }, //这里是上传图片时一起上传的数据
        complete: (res) => {
          i++; //这个图片执行完上传后，开始上传下一张
          let data = res.data;
          data = JSON.parse(data);
          let url = data.data;
          image['image'] = url;
          box.push(image);
          image = {}
          if (n == 1) {
            that.setData({
              st_imgbox: [],
              st_imgbox: box,
              st_pic: box[0].image
            });
          } else if (n == 9) {
            that.setData({
              imgbox: box
            });
          }
          if (i >= arr.length) { //当图片传完时，停止调用    
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
            return
          } else { //若图片还没有传完，则继续调用函数
            that.uploadimg(arr);
          }
        }
      });
    }
  },
  bindtap() {
    var st_imgbox = this.data.st_imgbox,
      indexCate = this.data.indexCate,
      st_name = this.data.st_name,
      st_address = this.data.st_address,
      is_wifi = this.data.is_wifi,
      is_park = this.data.is_park,
      is_wx_pay = this.data.is_wx_pay,
      is_zfb_pay = this.data.is_zfb_pay,
      open_time = this.data.open_time,
      st_content = this.data.st_content,
      st_mobile = this.data.st_mobile,
      imgbox = this.data.imgbox,
      st_pic = this.data.st_pic;
    if (st_pic == '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (!st_name) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return
    }
    if (!st_address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
      return
    }
    if (is_wifi == 0 && is_park == 0 && is_wx_pay == 0 && is_zfb_pay == 0) {
      wx.showToast({
        title: '请选择设施',
        icon: 'none'
      })
      return
    }
    if (!st_mobile) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
      return
    }
    if (!st_content) {
      wx.showToast({
        title: '请输入店铺简介',
        icon: 'none'
      })
      return
    }
    if (imgbox == '') {
      wx.showToast({
        title: '请上传店铺图片',
        icon: 'none'
      })
      return
    }
    if (!indexCate) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      })
      return
    }
    let cate_id = this.data.cate_id;
    imgbox = JSON.stringify(imgbox)
    let token = app.globalData.token;
    let st_id = this.data.st_id;
    let json = {
      st_pic: st_pic,
      st_name: st_name,
      st_address: st_address,
      is_wifi: is_wifi,
      is_park: is_park,
      is_wx_pay: is_wx_pay,
      is_zfb_pay: is_zfb_pay,
      open_time: open_time,
      st_content: st_content,
      imgbox: imgbox,
      st_mobile: st_mobile,
      cate_id: cate_id,
      st_id: st_id
    }
    let url = "";
    if (st_id != '') {
      url = "ad/save"
    } else {
      url = "ad/stick"
    }
    util.http(url, json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '请求成功',
          icon: 'none'
        })
        app.globalData.stick = 1;
        wx.setStorage({
          key: "stick",
          data: 1, //1为分销商   0为非分销
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../adMyStore/adMyStore?back=1'
          })
        }, 500)
      }
    })
  }
})