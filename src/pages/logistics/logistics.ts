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
  logisticsData: any = [];
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
