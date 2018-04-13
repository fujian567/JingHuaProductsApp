import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
 * 
管理端：商品上下架列表页面 
 */

@IonicPage()
@Component({
  selector: 'page-admingoodputaway',
  templateUrl: 'admingoodputaway.html',
})
export class AdmingoodputawayPage {
  u_token: any;
  @ViewChild('scroll') scrollElement: any;
  segmentStatus: string = "putAway";
  bottomFont: string = "下架";
  classOpt: string;
  classifyList: Array<any> = [];
  goodsList: Array<any> = [];
  goodsListD: Array<any> = [];
  batch: Array<any> = [];
  batchputaway: boolean = false;
  batchsoldout: boolean = false;
  isShowButton: boolean = false;
  isShowPutAway: boolean = true;
  isShowSoldOut: boolean = true;
  PagesInfoViewModelp: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  PagesInfoViewModels: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  productShelves: any = {
    CommParamId: '',
    Isshelves: true
  }
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public app: App,
    private PopoverCtrl: PopoverController,
    public appService: AppService,
    private storageCtrl: Storage,
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
          this.getGoodsList(this.classifyList[0].classId, 'putAway')
          this.getGoodsListD(this.classifyList[0].classId, 'soldOut')
        }
      }
    })
  }
  getGoodsList(classify: any, status: any) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsShelvesInfo, this.u_token, { classId: classify, shelves: true, pages: this.PagesInfoViewModelp }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowPutAway = false;
          let goodsList = rs.objectData;
          this.goodsList = this.goodsList.concat(goodsList)
          this.PagesInfoViewModelp.PageIndex = this.PagesInfoViewModelp.PageIndex + 1;
        }
      }
    },true)
  }
  getGoodsListD(classify: any, status: any) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsShelvesInfo, this.u_token, { classId: classify, shelves: false, pages: this.PagesInfoViewModels }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowSoldOut = false;
          let goodsList = rs.objectData;
          this.goodsListD = this.goodsListD.concat(goodsList)
          this.PagesInfoViewModels.PageIndex = this.PagesInfoViewModels.PageIndex + 1;
        }
      }
    },true)
  }

  selectClassify(item: any, event) {
    this.isShowButton = false;
    this.batchputaway = false;
    this.batchsoldout = false;
    let initSelected: any = document.getElementsByClassName('slidesClassify');
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("page-tabs-activat");
    }
    event.currentTarget.classList.add("page-tabs-activat");
    this.segmentStatus = "putAway";
    this.classOpt = item.classId;
    //this.classOpt = this.classifyList[0].id;
    this.goodsList = []
    this.goodsListD = []
    this.PagesInfoViewModelp.PageIndex = 1;
    this.PagesInfoViewModels.PageIndex = 1;
    this.getGoodsList(this.classOpt, 'putAway');
    this.getGoodsListD(this.classOpt, 'soldOut');
  }
  doRefresh(refresher: any, classOpt: any, segmentStatus: any) {
    setTimeout(() => {
      switch (segmentStatus) {
        case 'putAway': {
          this.getGoodsList(classOpt, 'putAway');
          break;
        }
        case 'soldOut': {
          this.getGoodsListD(classOpt, 'soldOut');
          break;
        }
      }
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll: any, classOpt: any, segmentStatus: any) {
    setTimeout(() => {
      switch (segmentStatus) {
        case 'putAway': {
          this.getGoodsList(classOpt, 'putAway');
          break;
        }
        case 'soldOut': {
          this.getGoodsListD(classOpt, 'soldOut');
          break;
        }
      }
      infiniteScroll.complete();
    }, 2000);
  }
  soldOutGoods(item: any) {
    this.isShowButton = false;
    this.batchputaway = false;
    this.batchsoldout = false;
    let popover = this.PopoverCtrl.create('AdminPartPublishPage', { commId: item.commId, publish: true }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.appConfigCtrl.popAlertConfirmView('你确定要下架该商品吗？', '我在考虑下', '立刻下架', () => {
        this.productShelves.CommParamId = item.commParamId;
        this.productShelves.Isshelves = false;
        this.subimtPutAwayData();
        });
      }
    });


  }
  putAwayGoods(item: any) {
    this.isShowButton = false;
    this.batchputaway = false;
    this.batchsoldout = false;
    let popover = this.PopoverCtrl.create('AdminPartPublishPage', { commId: item.commId, publish: true }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.appConfigCtrl.popAlertConfirmView('你确定要上架架该商品吗？', '我在考虑下', '立刻上架', () => {
        this.productShelves.CommParamId = item.commParamId;
        this.productShelves.Isshelves = true;
        this.subimtPutAwayData();
        });
      }
    });

  }
  segmentChanged(event: any) {
    this.isShowButton = false;
    this.batchputaway = false;
    this.batchsoldout = false;
    this.batch = [];
    if (event.value == "soldOut") {
      this.bottomFont = "上架";
    } else {
      this.bottomFont = "下架";
    }
  }
  updateCucumber(item: any) {
    this.batch.push(item.itemid)
    console.log(this.batch);
  }
  batchgoods(segmentStatus: any) {
    this.isShowButton = true;
    if (segmentStatus == "soldOut") {
      this.batchputaway = true;
    } else {
      this.batchsoldout = true;
    }
  }
  cancelbatch() {
    this.batch = []
    this.batchputaway = false;
    this.batchsoldout = false;
    this.isShowButton = false;
  }
  batchconfirm() {
    this.appConfigCtrl.popAlertConfirmView('你确定要操作这些商品吗？', '我在考虑下', '立刻取消', () => {
      this.batchputaway = false;
      this.batchsoldout = false;
      console.log(this.batch);
      this.isShowButton = false;
    });
  }
  subimtPutAwayData() {
    this.appService.httpPost_token(AppGlobal.API.postGoodsShelves, this.u_token, this.productShelves, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.PagesInfoViewModelp.PageIndex = 1;
        this.PagesInfoViewModels.PageIndex = 1;
        this.goodsList=[];
        this.goodsListD=[];
        this.getGoodsList(this.classOpt, 'putAway')
        this.getGoodsListD(this.classOpt, 'soldOut')
      }else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
}

