import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,App,Navbar } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：商品发布列表页面 
 */

@IonicPage()
@Component({
  selector: 'page-adminpublishlist',
  templateUrl: 'adminpublishlist.html',
})
export class AdminpublishlistPage {
  @ViewChild('scroll') scrollElement: any;
  @ViewChild(Navbar) navBar: Navbar;
  u_token: any;
  segmentStatus: string = "noPublish";
  classOpt: string;
  classifyList: Array<any> = [];
  goodsList: Array<any> = [];
  goodsListNP: Array<any> = [];
  goodsListD: Array<any> = [];
  PagesInfoViewModelp: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  PagesInfoViewModeln: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  isShowPubilsh: boolean = true;
  isShowNoPubilsh: boolean = true;
  constructor(
    public navCtrl: NavController,
    private PopoverCtrl: PopoverController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getGoodsClass(val);
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }
  getGoodsClass(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfo, u_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.classifyList = rs.objectData;
          this.classOpt = this.classifyList[0].classId;
          this.getGoodsList(this.classifyList[0].classId, 'publish')
          this.getGoodsListNP(this.classifyList[0].classId, 'noPublish')
          //this.getGoodsListD(this.classifyList[0].classId, 'invalid')
        }
      }
    })
  }
  getGoodsList(classify: any, status: any) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsPublishInfo, this.u_token, { classId: classify, publish: true, pages: this.PagesInfoViewModelp }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowPubilsh = false;
          let goodsList = rs.objectData;
          this.goodsList = this.goodsList.concat(goodsList)
          console.log(this.goodsList)
          this.PagesInfoViewModelp.PageIndex = this.PagesInfoViewModelp.PageIndex + 1;
        }
      }
    })
  }
  getGoodsListNP(classify: any, status: any) {
    console.log(classify)
    this.appService.httpPost_token(AppGlobal.API.postGoodsPublishInfo, this.u_token, { classId: classify, publish: false, pages: this.PagesInfoViewModeln }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowNoPubilsh = false;
          let goodsList = rs.objectData;
          this.goodsListNP = this.goodsList.concat(goodsList)
          this.PagesInfoViewModelp.PageIndex = this.PagesInfoViewModelp.PageIndex + 1;
        }
      }
    },true)
  }
  getGoodsListD(classify: any, status: any) {
    let goodsList = [
      { name: '王氏保赤丸-失', image: './assets/imgs/wsbcw.jpg', othername: '王氏保赤丸-未', spec: ['每120丸重0.3g，每支30丸'], status: '已发布' },
      { name: '王氏保赤丸-失', image: './assets/imgs/wsbcw.jpg', othername: '王氏保赤丸-未', spec: ['每120丸重0.3g，每支30丸'], status: '已发布' },
      { name: '王氏保赤丸-失', image: './assets/imgs/wsbcw.jpg', othername: '王氏保赤丸-未', spec: ['每120丸重0.3g，每支30丸'], status: '已发布' },
      { name: '王氏保赤丸-失', image: './assets/imgs/wsbcw.jpg', othername: '王氏保赤丸-未', spec: ['每120丸重0.3g，每支30丸'], status: '已发布' },
    ]
    this.goodsListD = this.goodsListD.concat(goodsList)
  }
  selectClassify(item: any, event) {
    let initSelected: any = document.getElementsByClassName('slidesClassify');
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("page-tabs-activat");
    }
    event.currentTarget.classList.add("page-tabs-activat");
    this.segmentStatus = "noPublish";
    this.classOpt = item.classId;
    //this.classOpt = this.classifyList[0].classId;
    this.goodsList = []
    this.goodsListNP = []
    this.goodsListD = []
    this.PagesInfoViewModelp.PageIndex = 1;
    this.PagesInfoViewModeln.PageIndex = 1;
    this.getGoodsList(this.classOpt, 'publish')
    this.getGoodsListNP(this.classOpt, 'noPublish')
    this.getGoodsListD(this.classOpt, 'invalid')
  }
  publishGoods(item) {
    let _publish = false;
    if (this.segmentStatus == 'publish') {
      _publish = true;
    }
    let popover = this.PopoverCtrl.create('AdminPartPublishPage', { commId: item.commId, publish: _publish }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.navCtrl.push('AdminpublishPage', { item: data, pageType: 'publish' })
      }
    });
  }
  publishEdit(item) { 
    let _publish = false;
    if (this.segmentStatus == 'publish') {
      _publish = true;
    }
    let popover = this.PopoverCtrl.create('AdminPartPublishPage', { commId: item.commId, publish: _publish }, {
      cssClass: 'parmasstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.navCtrl.push('AdminpublisheditPage', { item: data, pageType: 'publish' })
      }
    });
  }
  deletePublish() {
    let test = " 参数"
    this.appConfigCtrl.popAlertConfirmView('你确定要取消发布该商品吗？', '我在考虑下', '立刻取消', () => {
      console.log(test)
    });
  }
  doRefresh(refresher: any, classOpt: any, segmentStatus: any) {
    console.log(classOpt)
    console.log(segmentStatus)
    setTimeout(() => {
      switch (segmentStatus) {
        case 'publish': {
          this.getGoodsList(classOpt, 'publish');
          break;
        }
        case 'noPublish': {
          this.getGoodsListNP(classOpt, 'noPublish');
          break;
        }
        case 'invalid': {
          this.getGoodsListD(classOpt, 'invalid');
          break;
        }
      }
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll: any, classOpt: any, segmentStatus: any) {
    setTimeout(() => {
      switch (segmentStatus) {
        case 'publish': {
          this.getGoodsList(classOpt, 'publish');
          break;
        }
        case 'noPublish': {
          this.getGoodsListNP(classOpt, 'noPublish');
          break;
        }
        case 'invalid': {
          this.getGoodsListD(classOpt, 'invalid');
          break;
        }
      }
      infiniteScroll.complete();
    }, 2000);
  }
}
