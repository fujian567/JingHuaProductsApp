import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：消息列表
 */

@IonicPage()
@Component({
  selector: 'page-messagelist',
  templateUrl: 'messagelist.html',
})
export class MessagelistPage {
  @ViewChild(Navbar) navBar: Navbar;
  read: string = "noRead";
  c_token: any;
  noReadList: Array<any> = []
  readList: Array<any> = [];
  isNoReadList: boolean = true;
  isReadList: boolean = true;
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
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getNoReadInfoList(val);
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('TabsPage');
  }
  selectNoRead() {
    this.getNoReadInfoList(this.c_token);
  }
  selectAllRead() {
    this.getAllReadInfoList(this.c_token);
  }
  getNoReadInfoList(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getUserMessage, c_token, { pages: this.pagingModel, read: false }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.isNoReadList = false;
            let noReadList = rs.objectData;
            this.noReadList = this.noReadList.concat(noReadList)
            this.pagingModel.PageIndex += 1;
          }

        }
      }
    }, true)
  }
  getAllReadInfoList(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getUserMessage, c_token, { pages: this.pagingModelA, read: true }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.isReadList = false;
            let readList = rs.objectData;
            this.readList = this.readList.concat(readList);
            this.pagingModelA.PageIndex += 1;
          }
        }
      }
    }, true)
  }
  viewMessage(item: any) {
    this.navCtrl.push('MessageinfoPage', { item: item });
  }
  doInfinite(infiniteScroll: any, ngSwitchCase: any) {
    switch (ngSwitchCase) {
      case 'noRead': {
        this.getNoReadInfoList(this.c_token);
        break;
      }
      case 'read': {
        this.getAllReadInfoList(this.c_token);
        break;
      }
    }
    infiniteScroll.complete();
  }
}
