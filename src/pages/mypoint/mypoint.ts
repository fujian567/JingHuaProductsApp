import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：我的积分
 */

@IonicPage()
@Component({
  selector: 'page-mypoint',
  templateUrl: 'mypoint.html',
})
export class MypointPage {
  c_token: any;
  pages: any = {
    ItemsCount: 0,
    PageIndex: 1,
    PageSize: 20
  }
  isShowMypoint = false;
  myPoint: any = [];
  mypointAmount:any='0';
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      //this.getOrderInfo(val);
      this.getMyPoint(val);
    });
  }
  getMyPoint(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getMyPointInfo, c_token, { pages: this.pages }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.myPoint = rs.objectData.AccountIntegralRecords;
          this.mypointAmount=rs.objectData.TotalIntegral;
        } else {
          this.isShowMypoint = true;
        }
      }
    }, true)
  }


}
