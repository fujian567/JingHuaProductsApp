import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar, ViewController } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
 客户端：订单管理
 */
enum orderStatus {
  OrderSubmit = 2,
  OrderPayment = 3,
  OrderWaitAudit = 4,
  OrderWaitDelivery = 5,
  OrderDelivery = 6,
  OrderWaitReceipt = 7,
  OrderConfirmReceipt = 8,
  OrderEvaluation = 9,
  OrderComplete = 10,
}
@IonicPage()
@Component({
  selector: 'page-ordermanage',
  templateUrl: 'ordermanage.html',
})
export class OrdermanagePage {
  @ViewChild(Navbar) navBar: Navbar;
  c_token: any;
  imageUrl = AppGlobal.domainimage;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  allorder: string = "all";
  isNoOrder: boolean = false;
  pages: any = {
    ItemsCount: 0,
    PageIndex: 1,
    PageSize: 20
  }
  pagedatamodleAll = [];
  isShowAll: boolean = true;
  pagedatamodleNoPay = [];
  isShowNoPay: boolean = true;
  pagedatamodleNoAudit = [];
  isShowNoAudit: boolean = true;
  pagedatamodleNoDeliver = [];
  isShowNoDeliver: boolean = true;
  pagedatamodleNoTakeDelivery = [];
  isShowNoTakeDelivery: boolean = true;
  pagedatamodleNoComment = [];
  isShowNoComment: boolean = true;
  pagedatamodleAfterSale = [];
  isShowAfterSale: boolean = true;
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
  }
  ionViewWillEnter() {
    console.log(this.navParams.data)
    if (this.navParams.data != undefined) {
      this.c_token = this.navParams.data.c_token;
      let type = this.navParams.data.type;
      switch (type) {
        case 'nopay': {
          this.allorder = type;
          this.getOrderInfoNoPay(this.c_token)
          break;
        }
        case 'noaudit': {
          this.allorder = type;
          this.getOrderInfoNoAudit(this.c_token)
          break;
        }
        case 'nodeliver': {
          this.allorder = type;
          this.getOrderInfoNoDeliver(this.c_token)
          break;
        }
        case 'notakedelivery': {
          this.allorder = type;
          this.getOrderInfoNoTakeDelivery(this.c_token);
          break;
        }
        case 'nocomment': {
          this.getOrderInfoNoComment(this.c_token)
          this.allorder = type;
          break;
        }
        case 'aftersale': {
          this.allorder = type;
          break;
        }
        default: {
          this.allorder = 'all';
          this.getAllOrder(this.c_token)
          break;
        }
      }
    }
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    this.navCtrl.setRoot('TabsPage', { jumpage: 'person' });
    //this.navCtrl.setRoot('PersonalcenterPage');
    //this.navCtrl.i
  }
  doRefresh(refresher: any) {
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll: any) {
    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
  viewlogistics(item: any) {
    this.navCtrl.push('ExpressPage', { item: item, c_token: this.c_token })

    //this.navCtrl.push('LogisticsPage', { item: item, c_token: this.c_token })
  }
  confirmOrder(item: any) {
    this.appService.httpPost_token(AppGlobal.API.postOrderConfirm, this.c_token, { orderid: item.orderId }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('OrdermanagePage', { type: 'nocomment', c_token: this.c_token });
        this.getOrderInfoNoTakeDelivery(this.c_token)
      }
    })
  }
  goComment(item: any) {
    this.navCtrl.push('CommentPage', { item: item, c_token: this.c_token })
  }
  aftersale(item: any) {
    this.navCtrl.push('AftersalePage', { item: item, c_token: this.c_token })

  }
  //全部订单
  getAllOrder(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: '-1' }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodleAll = rs.objectData;
          this.isShowAll = false;
        }
      }
    }, true)
  }

  getOrderInfo(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByAccount, c_token, { pages: this.pages }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.pagedatamodleAll = [];
      }
    })
  }
  //待付款
  getOrderInfoNoPay(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: orderStatus.OrderPayment }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodleNoPay = rs.objectData;
          this.isShowNoPay = false;
        }
      }
    }, true)
  }
  //待审核
  getOrderInfoNoAudit(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: orderStatus.OrderWaitAudit }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodleNoAudit = rs.objectData;
          this.isShowNoAudit = false;
        }
      }
    }, true)
  }
  //待发货
  getOrderInfoNoDeliver(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: orderStatus.OrderWaitDelivery }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodleNoDeliver = rs.objectData;
          this.isShowNoDeliver = false;
        }
      }
    }, true)
  }
  //待收货
  getOrderInfoNoTakeDelivery(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: orderStatus.OrderWaitReceipt }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.pagedatamodleNoTakeDelivery = [];
        if (rs.objectData.length > 0) {
          this.pagedatamodleNoTakeDelivery = rs.objectData;
          this.isShowNoTakeDelivery = false;
        }
      }
    }, true)
  }
  //待评价
  getOrderInfoNoComment(c_token) {
    this.appService.httpPost_token(AppGlobal.API.postOrderInfoByStatus, c_token, { pages: this.pages, orderstateId: orderStatus.OrderEvaluation }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.pagedatamodleNoComment = [];
        if (rs.objectData.length > 0) {
          this.pagedatamodleNoComment = rs.objectData;
          this.isShowNoComment = false;
        }
      }
    }, true)
  }
  //售后
  getOrderInfoAfterSale(c_token) {
    this.appService.httpGet_token(AppGlobal.API.postOrderInfoAfterSale, c_token, { pages: this.pages }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodleAfterSale = rs.objectData;
          this.isShowAfterSale = false;
        }
      }
    }, true)
  }
  viewOrder(orderId: any, type: any) {
    console.log(orderId)
    console.log(type)
    this.navCtrl.push('OrderdetailPage', { orderId: orderId, c_token: this.c_token, orderType: type })
  }
  selectedAll() {
    this.getAllOrder(this.c_token)
  }
  selectedNopay() {
    this.getOrderInfoNoPay(this.c_token);
  }
  selectedNoaudit() {
    this.getOrderInfoNoAudit(this.c_token);
  }
  selectedNodeliver() {
    this.getOrderInfoNoDeliver(this.c_token);
  }
  selectedNotakedelivery() {
    this.getOrderInfoNoTakeDelivery(this.c_token);
  }
  selectedNocomment() {
    this.getOrderInfoNoComment(this.c_token);
  }
  selectedAftersale() {
    this.getOrderInfoAfterSale(this.c_token);
  }
  payOrder(orderId) {
    this.navCtrl.push('NopaydetailPage', { orderId: orderId, c_token: this.c_token })
  }
}
