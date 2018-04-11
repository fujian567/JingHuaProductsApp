import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：资料补齐列表界面
 */

@IonicPage()
@Component({
  selector: 'page-adminreplenishinfolist',
  templateUrl: 'adminreplenishinfolist.html',
})
export class AdminreplenishinfolistPage {
  replenish: string = "noReplenish";
  u_token: any;
  isNoReplenishList: boolean = true;
  isReplenishList: boolean = true;
  noReplenishList: any=[];
  replenishList: any=[];
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    private storageCtrl: Storage,
    public app:App,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getReplenishList(val);
      this.getAllReplenishList(val)
    });
  }
  getReplenishList(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getDataCompletionInfo, u_token, { _fbusinessState: 1 }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.isNoReplenishList = false;
        this.noReplenishList = rs.objectData
      }
    })
  }
  getAllReplenishList(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getDataCompletionInfo, u_token, { _fbusinessState: 2 }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.isReplenishList = false;
        this.replenishList = rs.objectData
      }
    })
  }
  replenishCompany(itemData: any) {
    this.navCtrl.push('AdminreplenishinfodetailPage', itemData)
  }
  viewReplenishCompany(itemData: any) {
    this.navCtrl.push('AdminreplenishinfodetailPage', {
      isView: true
    }, itemData)
  }
  doRefresh(refresher: any, ngSwitchCase: any) {
    if (ngSwitchCase == 'noReplenish') {
      this.isNoReplenishList = false
      let temp = [
        { companyName: '待审核的企业4' },
        { companyName: '待审核的企业5' },
        { companyName: '待审核的企业6' },
        { companyName: '待审核的企业7' },
        { companyName: '待审核的企业8' },
        { companyName: '待审核的企业9' },
        { companyName: '待审核的企业10' }]
      this.noReplenishList = this.noReplenishList.concat(temp)
      console.log(this.noReplenishList)
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    } else if (ngSwitchCase == 'replenish') {
      this.isReplenishList = false;
      let auditList = [
        { companyName: '已审核的企业21' },
        { companyName: '已审核的企业22' },
        { companyName: '已审核的企业23' },
        { companyName: '已审核的企业24' },
        { companyName: '已审核的企业25' },
        { companyName: '已审核的企业26' },
        { companyName: '已审核的企业27' }]
      this.replenishList = this.replenishList.concat(auditList)
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }
  }
  doInfinite(infiniteScroll: any, ngSwitchCase: any) {
    console.log(ngSwitchCase);
    if (ngSwitchCase == 'noReplenish') {
      this.isNoReplenishList = false
      setTimeout(() => {
        let temp = [
          { companyName: '待审核的企业4' },
          { companyName: '待审核的企业5' },
          { companyName: '待审核的企业6' },
          { companyName: '待审核的企业7' },
          { companyName: '待审核的企业8' },
          { companyName: '待审核的企业9' },
          { companyName: '待审核的企业10' }]
        this.noReplenishList = this.noReplenishList.concat(temp)
        console.log('Async operation has ended');
        infiniteScroll.complete();
      }, 500);
    } else if (ngSwitchCase == 'replenish') {
      this.isReplenishList = false;
      let auditList = [
        { companyName: '已审核的企业1' },
        { companyName: '已审核的企业2' },
        { companyName: '已审核的企业3' },
        { companyName: '已审核的企业4' },
        { companyName: '已审核的企业5' },
        { companyName: '已审核的企业6' },
        { companyName: '已审核的企业7' }]
      this.noReplenishList = this.noReplenishList.concat(auditList)
      setTimeout(() => {
        console.log('Async operation has ended');
        infiniteScroll.complete();
      }, 2000);
    }
  }
}
