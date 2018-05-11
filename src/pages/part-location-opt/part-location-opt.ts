import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { Storage } from '@ionic/storage';
/**
省市区地区选择
 */

@IonicPage()
@Component({
  selector: 'page-part-location-opt',
  templateUrl: 'part-location-opt.html',
})
export class PartLocationOptPage {
  u_token: any;
  showData: any;
  locationModel: any = {
    pccName: '',
    ProvinceID: '',
    CityId: '',
    CountyId: '',
  }
  Province: any = '请选择';
  City: any = '';
  County: any = '';
  pagename: any;
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    private app: App,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.pagename = this.navParams.data.page;
    //管理端
    this.storageCtrl.get('u_token').then((val) => {
      if (val != null) {
        this.u_token = val;
        this.getLocation(val, '');
      }
    });
    //客户端
    this.storageCtrl.get('c_token').then((val) => {
      if (val != null) {
        this.u_token = val;
        this.getLocation(val, '');
      }
    });
  }
  getLocation(u_token, itemid) {
    this.appService.httpPost_token(AppGlobal.API.postRegionalinfo, u_token, { parentitemid: itemid }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.showData = rs.objectData;
        }
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    });
  }
  itemClicked(itemid: any, isSingleCity: any, item: any) {
    if (isSingleCity == 1) {
      this.locationModel.ProvinceID = itemid;
      this.Province = item;
      this.City = '请选择';
      this.getLocation(this.u_token, itemid);
    } else if (isSingleCity == 2) {
      this.locationModel.CityId = itemid;
      this.City = item;
      this.County = '请选择';
      this.getLocation(this.u_token, itemid);
    } else {
      this.locationModel.CountyId = itemid;
      this.County = item;
      this.locationModel.pccName = this.Province + ' ' + this.City + ' ' + this.County
      this.viewCtrl.dismiss(this.locationModel, this.pagename, {
        animate: false
      });
    }
  }
  closePop() {
    this.viewCtrl.dismiss();
  }
  selectP() {
    this.getLocation(this.u_token, '');
  }
  selectC() {
    this.getLocation(this.u_token, this.locationModel.ProvinceID);
  }
}
