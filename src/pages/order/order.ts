import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, App, Navbar } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { WechatPlugin } from '../../providers/Wechat'
import { NetworkInterface } from '@ionic-native/network-interface';
declare var cordova: any;
/**
 客户端：提交订单
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  @ViewChild(Navbar) navBar: Navbar;
  isShowUpVoucher: boolean = false;
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  pagedatamodle: any = []
  payMethod: any = [];
  distributeBtn: any = "cgrayk";
  distribution: any = [];
  totalAmount: any;//总计金额
  freightAmount: any;//运费
  realPaymentAmount: any;//实付金额
  remissionAmount: any;//减免金额
  totalNumber: any;//总计数量
  orderID: any;//订单id
  isShowDefaultDelive: boolean = true;
  userIp: any = '';
  DeliveryInfoViewModel: any = {
    DeliveryInfoId: '',
    DeliveryInfoName: '',
    DeliveryInfoMobile: '',
    ProvinceId: '',
    CityId: '',
    CountyId: '',
    Address: '',
    Pccname: '',
    DeliveryInfoCreateDate: '',
    OrderId: this._guid,
  }
  //支付宝支付modle
  alipayOrderInfoViewModel: any = {
    AlipayBody: '',
    AlipaySubject: '',
    AlipayTotalAmount: '',
    AlipayOutTradeNo: '',
    AlipayProductCode: ''
  }
  //微信支付model
  weChatPayInfoViewModel: any = {
    WeChatOutTradeNo: '',
    WeChatBody: '',
    WeChatTotalAmount: '',
    AlipayOutTradeNo: '',
    WeChatSpbillCreateIp: ''
  }
  PInvoiceInfoViewModel: any = {
    PinvoiceId: this._guid,// 个人发票ID
    PinvoiceHeader: '个人', /// 抬头
    PinvoiceContent: '商品明细',/// 内容
    PinvoiceInfo: '普票不需要电话', /// 信息/手机
    PinvoiceEmail: '普票不需要邮件或者客户未填写',/// 电子邮件
    OrderId: this._guid, /// 订单ID
    PinvoiceMark: '无',/// 发票备注
    PinvoiceCreateDate: '2018-04-08' /// 发票建立日期
  }
  EInvoiceInfoViewModel: any = {
    EinvoiceId: this._guid, // 企业发票ID
    EinvoiceHeader: '单位', /// 抬头
    EinvoiceContent: '商品明细',/// 内容
    EinvoiceName: '单位名称',//单位名称
    EtaxIdeNumber: '纳税人识别号',//纳税人识别号
    EinvoiceInfo: '普票不需要电话', /// 信息/手机
    EinvoiceEmail: '普票不需要邮件或者客户未填写',/// 电子邮件
    OrderId: this._guid, /// 订单ID
    PinvoiceMark: '无',/// 发票备注
    EinvoiceCreateDate: '2018-04-08' /// 发票建立日期
  }
  deliveryName: any = '';
  deliveryMobile: any = '';
  pccName: any = '';
  address: any = '';
  InvoiceTypeId: any = 1;
  IsPInvoice: boolean = false;
  DistributionInfoId: any = '2';
  OrderCommodity: any = [];
  isUpimages: boolean = true;
  ImagesList: any = [];
  PayMethodId: any = 1;
  PayMethodName: any = '支付宝';
  wxPayMethod: boolean = false;
  aliPayMethod: boolean = true;
  bankPayMethod: boolean = false;
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private networkInterface: NetworkInterface,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getOrderInfo(val)
      this.getPayMethod(val);
      this.getDistribution(val);
      this.getDeliveryDef(val);
      this.getUserIP();
    });
    if (this.navParams.data.InvoiceTypeId != undefined) {
      let parmas = this.navParams.data;
      this.PInvoiceInfoViewModel.PinvoiceId = parmas.PInvoiceInfoViewModel.PinvoiceId;
      this.PInvoiceInfoViewModel.PinvoiceHeader = parmas.PInvoiceInfoViewModel.PinvoiceHeader;
      this.PInvoiceInfoViewModel.PinvoiceContent = parmas.PInvoiceInfoViewModel.PinvoiceContent;
      this.PInvoiceInfoViewModel.PinvoiceInfo = parmas.PInvoiceInfoViewModel.PinvoiceInfo;
      this.PInvoiceInfoViewModel.PinvoiceEmail = parmas.PInvoiceInfoViewModel.PinvoiceEmail;
      this.PInvoiceInfoViewModel.OrderId = parmas.PInvoiceInfoViewModel.OrderId;
      this.PInvoiceInfoViewModel.PinvoiceMark = parmas.PInvoiceInfoViewModel.PinvoiceCreateDate;
      this.PInvoiceInfoViewModel.PinvoiceCreateDate = parmas.PInvoiceInfoViewModel.PinvoiceCreateDate;
      this.EInvoiceInfoViewModel.EinvoiceId = parmas.EInvoiceInfoViewModel.EinvoiceId;
      this.EInvoiceInfoViewModel.EinvoiceHeader = parmas.EInvoiceInfoViewModel.EinvoiceHeader;
      this.EInvoiceInfoViewModel.EinvoiceContent = parmas.EInvoiceInfoViewModel.EinvoiceContent;
      this.EInvoiceInfoViewModel.EinvoiceName = parmas.EInvoiceInfoViewModel.EinvoiceName;
      this.EInvoiceInfoViewModel.EtaxIdeNumber = parmas.EInvoiceInfoViewModel.EtaxIdeNumber;
      this.EInvoiceInfoViewModel.EinvoiceInfo = parmas.EInvoiceInfoViewModel.EinvoiceInfo;
      this.EInvoiceInfoViewModel.EinvoiceEmail = parmas.EInvoiceInfoViewModel.EinvoiceEmail;
      this.EInvoiceInfoViewModel.OrderId = parmas.EInvoiceInfoViewModel.OrderId;
      this.EInvoiceInfoViewModel.PinvoiceMark = parmas.EInvoiceInfoViewModel.PinvoiceMark;
      this.EInvoiceInfoViewModel.EinvoiceCreateDate = parmas.EInvoiceInfoViewModel.EinvoiceCreateDate;
      this.InvoiceTypeId = this.navParams.data.InvoiceTypeId;
      this.IsPInvoice = this.navParams.data.IsPInvoice;
    }
    if (this.navParams.data.address != undefined) {
      let tempAddress = this.navParams.data.address;
      this.deliveryName = tempAddress.deliveryName;
      this.deliveryMobile = AppStaticConfig.hideMobile(tempAddress.deliveryMobile);;
      this.pccName = tempAddress.pccName;
      this.address = tempAddress.address;
      this.DeliveryInfoViewModel.DeliveryInfoId = tempAddress.deliveryAddressId;
      this.DeliveryInfoViewModel.DeliveryInfoName = tempAddress.deliveryName;
      this.DeliveryInfoViewModel.DeliveryInfoMobile = tempAddress.deliveryMobile;
      this.DeliveryInfoViewModel.ProvinceId = tempAddress.provinceID;
      this.DeliveryInfoViewModel.CityId = tempAddress.cityID;
      this.DeliveryInfoViewModel.CountyId = tempAddress.countyID;
      this.DeliveryInfoViewModel.Address = tempAddress.address;
      this.DeliveryInfoViewModel.Pccname = tempAddress.pccName;
      this.DeliveryInfoViewModel.DeliveryInfoCreateDate = '2018-04-08';
      this.isShowDefaultDelive = false;
    }
    if (sessionStorage.getItem('paymentId') != null) {
      this.PayMethodId = sessionStorage.getItem('paymentId');
      this.PayMethodName = sessionStorage.getItem('paymentName');
      if (this.PayMethodId == '1') {
        this.aliPayMethod = true;
        this.wxPayMethod = false;
        this.bankPayMethod = false;
      } else if (this.PayMethodId == '2') {
        this.wxPayMethod = true;
        this.aliPayMethod = false;
        this.bankPayMethod = false;
      } else if (this.PayMethodId == '3') {
        this.bankPayMethod = true;
        this.wxPayMethod = false;
        this.aliPayMethod = false;
        this.isShowUpVoucher = true;
      }
    }
    if (navParams.data.imageList != undefined) {
      if (navParams.data.imageList.length > 0) {
        console.log(navParams.data.imageList)
        this.ImagesList = navParams.data.imageList
        this.isUpimages = false;
      }
    }
  }
  getUserIP() {
    this.networkInterface.getIPAddress().then(success => {
      console.log('获取IP地址：' + success)
      this.userIp = success;
    }).catch(error => {
      console.log('获取IP地址错误：' + error)
    });
    this.networkInterface.getCarrierIPAddress().then(success => {
      console.log('获取Wi-Fi的IP地址：' + success)
      this.userIp = success;
    }).catch(error => {
      console.log('获取Wi-Fi的IP地址错误：' + error)
    });
    this.networkInterface.getCarrierIPAddress().then(success => {
      console.log('获取运营商IP地址：' + success)
      this.userIp = success;
    }).catch(error => {
      console.log('获取运营商IP地址错误：' + error)
    });

  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('TabsPage', { jumpage: 'shopping' });
  }
  getOrderInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getOederinfo, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.scInfoList.length > 0) {
          this.pagedatamodle = rs.objectData.scInfoList;
          this.totalAmount = rs.objectData.totalAmount;
          this.freightAmount = rs.objectData.freightAmount;
          this.realPaymentAmount = rs.objectData.realPaymentAmount;
          this.remissionAmount = rs.objectData.remissionAmount;
          this.totalNumber = rs.objectData.totalNumber;
          this.EInvoiceInfoViewModel.EinvoiceName = rs.objectData.einvoiceHeader;
          this.EInvoiceInfoViewModel.EtaxIdeNumber = rs.objectData.etaxIdeNumber;
          for (let i = 0; i < rs.objectData.scInfoList.length; i++) {
            let OrderCommodity: any = {
              OrderCid: rs.objectData.scInfoList[i].commId,
              CommParamId: rs.objectData.scInfoList[i].commParamId,
              OrderCprice: rs.objectData.scInfoList[i].coomPrice,//商品价格
              OrderCreliefAmount: '0',
              OrderCnumber: rs.objectData.scInfoList[i].commQuantity,
              CpayAmount: rs.objectData.scInfoList[i].subtotal,
              CAmount: rs.objectData.scInfoList[i].subtotal,
              OrderId: this._guid
            }
            this.OrderCommodity.push(OrderCommodity);
          }
        }
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  getPayMethod(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getPayMethod, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          for (let i = 0; i < rs.objectData.length; i++) {
            let tempobj = {
              payMethodDec: '',
              payMethodId: '',
              payMethodName: '',
              isDefault: 'cgrayk'
            }
            tempobj.payMethodDec = rs.objectData[i].payMethodDec;
            tempobj.payMethodId = rs.objectData[i].payMethodId;
            tempobj.payMethodName = rs.objectData[i].payMethodName;
            if (i == 0) {
              tempobj.isDefault = 'danger';
              this.PayMethodId = rs.objectData[i].payMethodId;
            }
            this.payMethod.push(tempobj)
          }
        }
      }
    })
  }
  getDistribution(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getDistribution, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          for (let i = 0; i < rs.objectData.length; i++) {
            let tempobj = {
              distributionInfoDec: '',
              distributionInfoId: '',
              distributionInfoName: '',
              isDefault: 'cgrayk'
            }
            tempobj.distributionInfoDec = rs.objectData[i].distributionInfoDec;
            tempobj.distributionInfoId = rs.objectData[i].distributionInfoId;
            tempobj.distributionInfoName = rs.objectData[i].distributionInfoName;
            if (i == 0) {
              tempobj.isDefault = 'danger';
              this.DistributionInfoId = rs.objectData[i].distributionInfoId;
            }
            this.distribution.push(tempobj)
          }
        }
      }
    })
  }
  getDeliveryDef(c_token) {
    if (this.navParams.data.address == undefined) {
      this.appService.httpGet_token(AppGlobal.API.getDeliveryDef, c_token, {}, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('LoginPage');
        }
        if (rs.isSuccess) {
          console.log(rs);
          if (rs.objectData.length > 0) {
            this.deliveryName = rs.objectData[0].deliveryName;
            this.deliveryMobile = AppStaticConfig.hideMobile(rs.objectData[0].deliveryMobile);;
            this.pccName = rs.objectData[0].pccName;
            this.address = rs.objectData[0].address;
            this.DeliveryInfoViewModel.DeliveryInfoId = rs.objectData[0].deliveryAddressId;
            this.DeliveryInfoViewModel.DeliveryInfoName = rs.objectData[0].deliveryName;
            this.DeliveryInfoViewModel.DeliveryInfoMobile = rs.objectData[0].deliveryMobile;
            this.DeliveryInfoViewModel.ProvinceId = rs.objectData[0].provinceID;
            this.DeliveryInfoViewModel.CityId = rs.objectData[0].cityID;
            this.DeliveryInfoViewModel.CountyId = rs.objectData[0].countyID;
            this.DeliveryInfoViewModel.Address = rs.objectData[0].address;
            this.DeliveryInfoViewModel.Pccname = rs.objectData[0].pccName;
            this.DeliveryInfoViewModel.DeliveryInfoCreateDate = '2018-04-08';
            this.isShowDefaultDelive = false;
          } else {
            localStorage.setItem('delivercount', rs.objectData.length)
          }
        }
      })
    }
  }


  selectdis(item, index) {
    console.log(item)
    // for (let i = 0; i < this.distribution.length; i++) {
    //   this.distribution[i].isDefault = 'cgrayk';
    // }
    // this.distribution[index].isDefault = 'danger';
  }
  setInvoice() {
    this.navCtrl.push('InvoicePage')
  }
  upVoucher(item, index) {
    for (let i = 0; i < this.payMethod.length; i++) {
      this.payMethod[i].isDefault = 'cgrayk';
    }
    this.payMethod[index].isDefault = 'danger';
    if (item.payMethodId == 3) {
      this.isShowUpVoucher = true;
    } else {
      this.isShowUpVoucher = false;
    }
    this.PayMethodId = item.payMethodId;
    this.PayMethodName = item.payMethodName
  }
  viewDetail() {
    this.navCtrl.push('OrdergoodslistPage')
  }
  settlement() {
    if (this.DeliveryInfoViewModel.DeliveryInfoId == '') {
      this.appConfigCtrl.popAlertConfirmView('你还没有设置收货地址，赶快去设置一个！', '取消', '去设置', rs => {
        localStorage.setItem('previouspage', 'OrderPage')
        sessionStorage.setItem('paymentId', this.PayMethodId)
        sessionStorage.setItem('paymentName', this.PayMethodName)
        this.navCtrl.push('ShippingaddressPage', { imageList: this.ImagesList });
        console.log(this.ImagesList)
        console.log(this.PayMethodId)
        console.log(this.PayMethodName)
      });
    } else {
      if (this.ImagesList.length < 1 && this.PayMethodId == 3) {
        this.appConfigCtrl.popAlertView('你还没有上传银行转账凭证，请上传凭证！');
        return
      }
      if (this.PayMethodId == 3) {
        let imageList: any = [];
        for (let i = 0; i < this.ImagesList.length; i++) {
          let ImagesViewModel: any = {
            ImageId: this._guid,
            ImageTypeId: 5,
            ImagePath: '123',
            RelativeImagePath: '123',
            ImageName: '银行转账凭证',
            ObjectId: this._guid,
            ImageTitle: '银行转账凭证',
            CreateDate: '2018-04-08',
            ImageOrder: i,
            ImageData: this.ImagesList[i]
          }
          imageList.push(ImagesViewModel);
        }
        let OrderInfoSubmitViewModel: any = {
          OrderId: this._guid,
          OrderCode: '1234',
          OrderStateId: 2,
          OrderCreateDate: '2018-04-08',
          OrderAmount: this.totalAmount,
          ReliefAmount: this.remissionAmount,
          PayAmount: this.realPaymentAmount,
          AccountId: this._guid,
          InvoiceTypeId: this.InvoiceTypeId,
          FreightAmount: this.freightAmount,
          OrderNumber: this.totalNumber,
          PInvoiceInfo: this.PInvoiceInfoViewModel,
          EInvoiceInfo: this.EInvoiceInfoViewModel,
          DeliveryInfo: this.DeliveryInfoViewModel,
          IsPInvoice: this.IsPInvoice,
          PayMethodId: this.PayMethodId,
          PayMethodName: this.PayMethodName,
          DistributionInfoId: 2,
          // DistributionInfoId: this.DistributionInfoId,
          OrderIsEffective: true,
          OrderCommodity: this.OrderCommodity,
          ImagesList: imageList
        }
        sessionStorage.clear();
        console.log(OrderInfoSubmitViewModel)
        this.appService.httpPost_Img_token(AppGlobal.API.postOrderInfo, this.c_token, { orderInfo: OrderInfoSubmitViewModel }, rs => {
          if (rs.status == 401 || rs.status == 403) {
            this.app.getRootNav().setRoot('LoginPage');
          }
          if (rs.isSuccess) {
            this.app.getRootNav().setRoot('OrdersuccessPage')
          } else {
            this.appConfigCtrl.popAlertView(rs.errorMessage);
          }
        }, true);
      } else if (this.PayMethodId == 1 || this.PayMethodId == 2) {
        //微信支付或支付宝，1支付宝，2微信
        let OrderInfoSubmitViewModel: any = {
          OrderId: this._guid,
          OrderCode: '1234',
          OrderStateId: 2,
          OrderCreateDate: '2018-04-08',
          OrderAmount: this.totalAmount,
          ReliefAmount: this.remissionAmount,
          PayAmount: this.realPaymentAmount,
          AccountId: this._guid,
          InvoiceTypeId: this.InvoiceTypeId,
          FreightAmount: this.freightAmount,
          OrderNumber: this.totalNumber,
          PInvoiceInfo: this.PInvoiceInfoViewModel,
          EInvoiceInfo: this.EInvoiceInfoViewModel,
          DeliveryInfo: this.DeliveryInfoViewModel,
          IsPInvoice: this.IsPInvoice,
          PayMethodId: this.PayMethodId,
          PayMethodName: this.PayMethodName,
          DistributionInfoId: 2,
          OrderIsEffective: true,
          OrderCommodity: this.OrderCommodity,
        }
        this.onlinePayPost(OrderInfoSubmitViewModel);
      }
    }
  }
  changeaddress() {
    sessionStorage.setItem('paymentId', this.PayMethodId)
    sessionStorage.setItem('paymentName', this.PayMethodName)
    localStorage.setItem('previouspage', 'OrderPage')
    this.navCtrl.push('ShippingaddressPage', { imageList: this.ImagesList });
    console.log(this.ImagesList)
    console.log(this.PayMethodId)
    console.log(this.PayMethodName)
  }
  onAddImage() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.openCamera();
          }
        }, {
          text: '从相册选取',
          handler: () => {
            this.photoAlbum();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  /**
* 打开摄像头
*/
  openCamera() {
    const options: CameraOptions = {
      quality: 50,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
    }
    this.camera.getPicture(options).then((imageData) => {
      this.ImagesList.push(imageData);
      this.isUpimages = false;
    }, (err) => {
      // Handle error
    });
  }
  /**
  * 打开相册
  */
  photoAlbum() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 60,
      width: 800,
      outputType: 1
    };
    // 获取图片
    this.imagePicker.getPictures(options).then((results) => {
      if (results != "OK") {
        for (let i = 0; i < results.length; i++) {
          this.ImagesList.push(results[i]);
          this.isUpimages = false;
        }
      }
    }, (err) => {
      console.log(err)
    });
  }
  isDeleteImage() {
    this.ImagesList = [];
    this.isUpimages = true;
  }
  wxPayCheck() {
    this.aliPayMethod = false;
    this.bankPayMethod = false;
    this.PayMethodId = 2;
    this.PayMethodName = '微信支付'
    this.wxPayMethod = true;
    this.isShowUpVoucher = false;
    console.log(this.userIp)
  }
  aliPayCheck() {
    this.wxPayMethod = false;
    this.bankPayMethod = false;
    this.PayMethodId = 1;
    this.PayMethodName = '支付宝';
    this.aliPayMethod = true;
    this.isShowUpVoucher = false;
  }
  bankPayCheck() {
    this.wxPayMethod = false;
    this.aliPayMethod = false;
    this.PayMethodId = 3;
    this.PayMethodName = '银行转账'
    this.bankPayMethod = true;
    this.isShowUpVoucher = true;
  }
  //在线支付订单提交，获取订单信息
  onlinePayPost(OrderInfoSubmitViewModel) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByLine, this.c_token, { orderInfo: OrderInfoSubmitViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log('PayMethodId是：' + this.PayMethodId)
        if (this.PayMethodId == 1) {
          this.aliPayPost(rs.objectData.orderId, rs.objectData.orderCode)
        } else {
          this.wechatPayPost(rs.objectData.orderId, rs.objectData.orderCode)
        }
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true);
  }
  //支付宝
  aliPayPost(orderId, orderCode) {
    this.alipayOrderInfoViewModel.AlipayBody = '精华直销B2B订单号：' + orderCode;
    this.alipayOrderInfoViewModel.AlipaySubject = '精华直销B2B订单号：' + orderCode;
    this.alipayOrderInfoViewModel.AlipayTotalAmount = this.realPaymentAmount;
    this.alipayOrderInfoViewModel.AlipayOutTradeNo = orderId;
    this.alipayOrderInfoViewModel.AlipayProductCode = orderId;
    sessionStorage.clear();
    this.appService.httpPost_token(AppGlobal.API.getpostOrderInfoAlipay, this.c_token, { orderInfoalipay: this.alipayOrderInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        this.alipay(rs.objectData, orderId)
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true);
  }
  alipay(data, orderId) {
    let payInfo = AppStaticConfig.unescapeHTML(data);
    cordova.plugins.alipay.payment(payInfo, (success) => {
      if (success.resultStatus == "9000") {
        //支付成功
        this.app.getRootNav().setRoot('OrdersuccessPage', { item: this.PayMethodId, orderID: orderId })
      }
    }, (error) => {
      //支付失败
      this.app.getRootNav().setRoot('OrderfailedPage')
    });
  }

  //微信支付
  wechatPayPost(orderId, orderCode) {
    sessionStorage.clear();
    console.log('微信支付---' + orderId)
    this.weChatPayInfoViewModel.WeChatOutTradeNo = orderId;
    this.weChatPayInfoViewModel.WeChatBody = '精华直销B2B订单号：' + orderCode;
    this.weChatPayInfoViewModel.WeChatTotalAmount = this.realPaymentAmount;
    this.weChatPayInfoViewModel.WeChatSpbillCreateIp = AppGlobal.domainWechat;
    sessionStorage.clear();
    console.log(this.weChatPayInfoViewModel)
    this.appService.httpPost_token(AppGlobal.API.getpostOrderInfoWechat, this.c_token, { orderInfoWeChat: this.weChatPayInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        this.wechatPay(rs.objectData, orderId)
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true);
  }
  wechatPay(paramsdata, orderId) {
    let params = JSON.parse(paramsdata)

    var wechatPayparams = {
      appid: params.appid,
      partnerid: params.partnerid, // merchant id
      prepayid: params.prepayid, // prepay id
      package: params.package,
      noncestr: params.noncestr, // nonce
      timestamp: params.timestamp + '', // timestamp
      sign: params.sign // signed string
    };
    console.log(wechatPayparams)
    WechatPlugin.sendPaymentRequest(wechatPayparams).then((result) => {
      console.log(result)
      //支付成功
      this.app.getRootNav().setRoot('OrdersuccessPage', { item: this.PayMethodId, orderID: orderId })
    }, (error) => {
      //支付失败
      this.app.getRootNav().setRoot('OrderfailedPage', { item: error })
    })
  }
  //根据订单ID获取订单信息
  getpostOrderInfo(orderid) {
    this.appService.httpPost_token(AppGlobal.API.getpostOrderInfo, this.c_token, { orderInfo: orderid }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        //this.alipay(data)
        //this.navCtrl.setRoot('OrdersuccessPage')
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true);
  }
}
