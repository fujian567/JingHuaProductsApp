import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：资质审核列表界面
 */

@IonicPage()
@Component({
  selector: 'page-adminauditinfolist',
  templateUrl: 'adminauditinfolist.html',
})
export class AdminauditinfolistPage {
  @ViewChild(Navbar) navBar: Navbar;
  audit: string = "noAduit";
  u_token: any;
  noAuditList: Array<any> = []
  auditList: Array<any> = [];
  isNoAuditList: boolean = true;
  isAuditList: boolean = true;
  pagingModel = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: '40',
  }
  pagingModelA = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: '40',
  }
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getAuditInfoList(val);
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }
  selectNoAudit() {
    this.getAuditInfoList(this.u_token);
  }
  selectAllAudit() {
    this.getAllAuditInfoList(this.u_token);
  }
  getAuditInfoList(u_token) {
    this.appService.httpPost_token(AppGlobal.API.getFbenterpriseWait, u_token, { pages: this.pagingModel, fbusinessstate: 60 }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.isNoAuditList = false;
            let noAuditList = rs.objectData;
            this.noAuditList = this.noAuditList.concat(noAuditList);
            this.pagingModel.PageIndex += 1;
          }
        }
      }
    }, true)
  }
  getAllAuditInfoList(u_token) {
    this.appService.httpPost_token(AppGlobal.API.postEnterpriseInfo, u_token, { pages: this.pagingModelA }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.isAuditList = false;
            let auditList = rs.objectData;
            this.auditList = this.auditList.concat(auditList);
            this.pagingModelA.PageIndex += 1;
          }
        }
      }
    }, true)
  }
  auditCompany(itemData: any) {
    this.navCtrl.push('AdminauditinfodetailPage', {
      itemData
    })
  }
  viewCompany(itemData: any) {
    this.navCtrl.push('AdminauditinfoeditPage', {
      itemData
    })
  }
  doInfinite(infiniteScroll: any, ngSwitchCase: any) {
    switch (ngSwitchCase) {
      case 'noAduit': {
        this.getAuditInfoList(this.u_token);
        break;
      }
      case 'aduit': {
        this.getAllAuditInfoList(this.u_token);
        break;
      }
    }
    infiniteScroll.complete();
  }
}
