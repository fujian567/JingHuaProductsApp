import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController, App, Navbar } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：订单管理页面
 */
enum orderStatus {
  OrderNormal = 1,
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
  selector: 'page-adminorder',
  templateUrl: 'adminorder.html',
})
export class AdminorderPage {
  @ViewChild(Navbar) navBar: Navbar;
  isShowStatusList: boolean = false;
  isShowBackDrop: boolean = true;
  isShowIcon: boolean = true;
  showStatus: any = '订单待审核'
  u_token: any = '';
  processMainID: any = '';
  datalist: any = [];
  pagedatamodle: any = [];
  pageStatus: any = [
    //{ key: 'all', value: '全部', checked: true },
    { key: 'orderAudit', value: '订单待审核', checked: false },
    { key: 'orderAllAudit', value: '已审核的订单', checked: false },
    { key: 'deliver', value: '订单待发货', checked: false },
    { key: 'allAeliver', value: '已发货的订单', checked: false },
    // { key: 'salesReturn', value: '退货待审核', checked: false },
    // { key: 'returnConfirm', value: '退款待确认', checked: false },
    // { key: 'orderClose', value: '订单关闭', checked: false },
    // { key: 'orderOver', value: '已完成', checked: false },
  ]
  pages: any = {
    ItemsCount: 0,
    PageIndex: 1,
    PageSize: 20
  }
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    private PopoverCtrl: PopoverController,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getOrderInfo(val);
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }
  //全部订单
  getAllOrderInfo(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getWaitAuditOrder, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.datalist = rs.objectData
        console.log(rs)

      }
    }, true)
  }
  //待审核
  getOrderInfo(u_token) {
    this.pagedatamodle = null;
    this.appService.httpPost_token(AppGlobal.API.postOrderByStatus, u_token, { pages: this.pages, orderstateId: orderStatus.OrderWaitAudit }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.pagedatamodle = rs.objectData;
          //this.isShowNoAudit = false;
        }
      }
    }, true)
  }
  _bdClick() {
    if (this.isShowStatusList) {
      this.isShowStatusList = false;
      this.isShowBackDrop = true;
    }
  }
  selectStatus() {
    if (this.isShowStatusList) {
      this.isShowStatusList = false;
      this.isShowBackDrop = true;
      this.isShowIcon = true;
    } else {
      this.isShowIcon = false;
      this.isShowBackDrop = false;
      this.isShowStatusList = true;
    }
  }
  selectRadio(event: any) {
    switch (event) {
      case 'all': {
        this.showStatus = '全部';
        this.getAllOrderInfo(this.u_token);
        break;
      }
      case 'orderAudit': {
        this.showStatus = '订单待审核';
        this.getOrderInfo(this.u_token);
        break;
      }
      case 'allocate': {
        this.showStatus = '订单待配货';
        break;
      }
      case 'deliver': {
        this.showStatus = '订单待发货';
        this.getOrderInfoDeliver(this.u_token)
        break;
      }
      case 'salesReturn': {
        this.showStatus = '退货待审核';
        console.log('1111')
        this.getOrderAfterSale(this.u_token);
        break;
      }
      case 'returnConfirm': {
        this.showStatus = '退款待确认';
        break;
      }
      case 'orderClose': {
        this.showStatus = '订单关闭';
        break;
      }
      case 'orderOver': {
        this.showStatus = '已完成';
        break;
      }
    }
    if (this.isShowStatusList) {
      this.isShowStatusList = false;
      this.isShowBackDrop = true;
      this.isShowIcon = true;
    }
  }
  auditOrder(item: any) {
    this.navCtrl.push("AdminorderauditPage");
  }
  searchOrder() {
    let popover = this.PopoverCtrl.create('AdminPartSearchOrderPage', { temp: '123' }, {
      cssClass: 'search',
      showBackdrop: true,
      enableBackdropDismiss: true,
    });
    popover.present({ animate: false, duration: 500 });
    popover.onDidDismiss((data) => {
      if (data != null) {
        console.log(data)
      }
    });
  }
  //viewOrder(orderId: any, processMainId: any) {
  viewOrder(orderId: any) {
    console.log(this.showStatus)
    switch (this.showStatus) {
      case '订单待审核': {
        this.navCtrl.push('AdminorderauditPage', { orderId: orderId, u_token: this.u_token })
        break;
      }
      case '订单待配货': {

        break;
      }
      case '订单待发货': {
        this.navCtrl.push('AdminorderdeliverPage', { orderId: orderId, u_token: this.u_token })
        break;
      }
      case '退货待审核': {

        break;
      }
      case '退款待确认': {
        break;
      }
      case '订单关闭': {
        break;
      }
      case '已完成': {
        break;
      }
    }

    //this.navCtrl.push('AdminorderauditPage', { orderId: orderId ,u_token:this.u_token})
  }
  //待发货
  getOrderInfoDeliver(u_token) {
    this.pagedatamodle = null;
    this.appService.httpPost_token(AppGlobal.API.postOrderByStatus, u_token, { pages: this.pages, orderstateId: orderStatus.OrderWaitDelivery }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          console.log(rs)
          this.pagedatamodle = rs.objectData;
          // this.isShowNoAudit = false;
        }
      }
    }, true)
  }
  //退货审核
  getOrderAfterSale(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getRefundWaitAuditOrder, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.datalist = rs.objectData
        this.processMainID

      }
    }, true)
  }

}
