import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
客户端：查看快递物流
 */

@IonicPage()
@Component({
  selector: 'page-express',
  templateUrl: 'express.html',
})
export class ExpressPage {
  @ViewChild(Navbar) navBar: Navbar;
  c_token: any;
  orderinfo: any;
  pagedatamodle: any = {
    logisticsNum: '1234567890',
    logistics: '顺丰速运',
  }
  imgUrl: any = AppGlobal.domainimage;
  expressStatus:any='1';
  logisticsData: any = [
    { date: '04-08', time: '07:46', log: '186****3906-已签收', status: '1' },
    { date: '04-08', time: '07:46', log: '快件派送至快递柜【丰巢】，派件员:杨国胜', status: '0' },
    { date: '04-08', time: '07:46', log: '甘肃兰州七里河区公司-杨国胜-派件中', status: '0' },
    { date: '04-08', time: '07:46', log: '已到达-甘肃兰州七里河区公司', status: '0' },
    { date: '04-08', time: '07:46', log: '甘肃兰州中转部-已发往-甘肃兰州七里河区公司', status: '0' },
    { date: '04-08', time: '07:46', log: '已到达-甘肃兰州中转部', status: '0' },
    { date: '04-08', time: '07:46', log: '福建泉州航空部-已装袋发往-甘肃兰州航空部', status: '0' },
    { date: '04-08', time: '07:46', log: '福建安海公司-已装袋发往-福建泉州航空部', status: '0' },
    { date: '04-08', time: '07:46', log: '福建安海公司-已发往-福建泉州航空部', status: '0' },
    { date: '04-08', time: '07:46', log: '福建安海公司-已进行装袋扫描', status: '0' },
    { date: '04-08', time: '07:46', log: '福建安海公司-已收件', status: '0' },
  ]
  constructor(
    public navCtrl: NavController,
    public imageViewerCtrl: ImageViewerController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams) {
    if (this.navParams.data.item != undefined) {
      this.orderinfo = this.navParams.data.item;
      console.log(this.orderinfo)
      this.getLogisticsDetail(this.orderinfo.orderId, this.navParams.data.c_token)
    }
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('OrdermanagePage', { type: 'notakedelivery', c_token: this.c_token });
    // this.navCtrl.push('OrdermanagePage', { jumpage: 'person' });
  }
  getLogisticsDetail(orderid: any, c_token: any) {
    this.appService.httpPost_token(AppGlobal.API.postExpressInfo, c_token, { orderId: orderid }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs.objectData)
      this.pagedatamodle.logisticsNum=rs.objectData.orderLogisticsNumber;
      this.pagedatamodle.logistics=rs.objectData.orderCourierCompanyName; 
      this.getExpressInfo(rs.objectData.orderLogisticsNumber,rs.objectData.orderCourierCompanyCode);

    }, true);
  }
  getExpressInfo(expressNum: any,express:any){
    this.appService.httpPost_token(AppGlobal.API.posLogisticsInfo, this.c_token, { orderLogisticsNumber: expressNum, couriercompanycode:express}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      
      let express=JSON.parse(rs.objectData);
      console.log(express.Traces)
      this.logisticsData=express.Traces.reverse();
      this.expressStatus=express.State
      console.log(express)
    });
  }
}



