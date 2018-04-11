import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：查看物流
 */

@IonicPage()
@Component({
  selector: 'page-logistics',
  templateUrl: 'logistics.html',
})
export class LogisticsPage {
  c_token: any;
  orderinfo: any;
  pagedatamodle: any = {

  }
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
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data.item != undefined) {
      this.orderinfo = this.navParams.data.item;
      console.log(this.orderinfo)
      //this.getLogisticsDetail(this.orderid, this.navParams.data.c_token)
    }
  }
  goexpress(orderinfo: any) {
    this.navCtrl.push('ExpressPage', { item: orderinfo, c_token: this.c_token })
  }
}
