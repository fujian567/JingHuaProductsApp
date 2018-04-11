import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController,App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
 管理端：商品参数管理
 */

@IonicPage()
@Component({
  selector: 'page-admingoodsparmas',
  templateUrl: 'admingoodsparmas.html',
})
export class AdmingoodsparmasPage {
  u_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  _pageParmas: any;
  _goodsName: any;
  _commBaseInfoId: any;
  _classId: any;
  isShowParmas: boolean = true;
  PagesInfoViewModel: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  paramsList: Array<any> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    private toastCtrl: ToastController,
    public app: App,
    private PopoverCtrl: PopoverController
  ) {
    this._pageParmas = this.navParams.data.itemparma
    this._goodsName = this._pageParmas.commName;
    this._commBaseInfoId = this._pageParmas.commId;
    this._classId = this._pageParmas.classId;
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getGoodsParmas(val);
    });
  }
  getGoodsParmas(u_token) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsBaseParmasInfo, u_token, { commBaseInfoId: this._commBaseInfoId, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.paramsList=[];
        if (rs.objectData.length > 0) {
          this.isShowParmas = false;
          console.log(this.paramsList)
          this.paramsList = rs.objectData;
          this.PagesInfoViewModel.PageIndex = this.PagesInfoViewModel.PageIndex + 1;
        } else {
          this.appConfigCtrl.popToastView('没有更多数据了！');
        }
      }
    })
  }
  addGoodsParmas() {
    let popover = this.PopoverCtrl.create('AdminPartParmasPage', { classId: this._classId }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != undefined) {
        //this.paramsList.push(data);
        this.subimtParmasData(data)
      }
    });
  }
  deleteParmas(commParamId: number) {
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该参数吗？删除后不可恢复。', '我在考虑下', '残忍删除', () => {
      this.appService.httpPost_token(AppGlobal.API.postGoodsBaseParmasDel, this.u_token, { commParamId: commParamId }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.PagesInfoViewModel.PageIndex = 1;
          this.getGoodsParmas(this.u_token);
          this.appConfigCtrl.popToastView('删除成功');
        } else {
          this.appConfigCtrl.popAlertView('该参数已有发布的商品，请先将相关商品改成未发布状态！');
        }
      }, true)
    })
  }
  subimtParmasData(data) {
    console.log(data)
    let tempData: any = {
      CommSpecData: data.CommSpecData,
      ApprovedNumData: data.ApprovedNumData,
      EnterprisesData: data.EnterprisesData
    }
    let temparray = [];
    for (let i = 0; i < 2; i++) {
      temparray.push(data.CommSpecData)
    }
    this.appService.httpPost_token(AppGlobal.API.postGoodsBaseParmas, this.u_token, { commId: this._commBaseInfoId, CommSpecData: data.CommSpecData, EnterprisesData: data.EnterprisesData, ApprovedNumData: data.ApprovedNumData ,commupc:data.CommUPC,commpackaging:data.CommPackaging}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if(rs.errorMessage=='操作成功！'){
          this.PagesInfoViewModel.PageIndex=1;
          this.getGoodsParmas(this.u_token);
        }else{
          this.appConfigCtrl.popAlertView(rs.errorMessage);
        }
        //this.navCtrl.setRoot('AdmingoodslistPage');
      }else{
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true);
  }
  // doInfinite(refresher: any) {
  //   this.getGoodsParmas(this.u_token);
  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }
  doRefresh(infiniteScroll: any) {
    this.getGoodsParmas(this.u_token);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }
}
