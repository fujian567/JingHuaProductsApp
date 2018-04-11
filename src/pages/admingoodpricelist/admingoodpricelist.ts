import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , PopoverController ,App} from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：后台管理价格管理
 */

@IonicPage()
@Component({
  selector: 'page-admingoodpricelist',
  templateUrl: 'admingoodpricelist.html',
})
export class AdmingoodpricelistPage {
  @ViewChild('scroll') scrollElement: any;
  u_token: any;
  classifyList: Array<any> = [];
  classOpt: string;
  goodsList: Array<any> = [];
  isShowPrice = true;
  PagesInfoViewModel: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  constructor(
    public navCtrl: NavController,
    private PopoverCtrl: PopoverController,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getGoodsClass(val);
    });
  }
  getGoodsClass(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfo, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.classifyList = rs.objectData;
          this.classOpt = this.classifyList[0].classId;
          this.getGoodsList(this.classifyList[0].classId)
        }
      }
    })
  }
  getGoodsList(classify: any) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsPublishInfo, this.u_token, { classId: classify, publish: true, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowPrice = false;
          let goodsList = rs.objectData;
          this.goodsList = this.goodsList.concat(goodsList)
          this.PagesInfoViewModel.PageIndex = this.PagesInfoViewModel.PageIndex + 1;
        }
      }
    },true)
  }
  selectClassify(item: any, event) {
    this.classOpt = item.id;
    let initSelected: any = document.getElementsByClassName('slidesClassify');
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("page-tabs-activat");
    }
    event.currentTarget.classList.add("page-tabs-activat");
    this.goodsList = []
    this.getGoodsList(item.classId)
  }
  goodsPrice(item:any) {
    let _publish = false;
    let popover = this.PopoverCtrl.create('AdminPartPublishPage', { commId: item.commId, publish: true }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    let defaultImg=item.imagesList[0].imageData;
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.navCtrl.push('AdmingoodpricePage', { item: data,defaultImg:defaultImg })
      }
    });
  }
  doRefresh(refresher: any, classOpt: any) {
    console.log(classOpt)
    setTimeout(() => {
      this.getGoodsList(classOpt)
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll: any, classOpt: any) {
    console.log(classOpt)
    setTimeout(() => {
      this.getGoodsList(classOpt)
      infiniteScroll.complete();
    }, 2000);
  }
}