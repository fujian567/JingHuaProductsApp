import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,App ,Navbar} from 'ionic-angular'; 
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：商品列表界面
 */

@IonicPage()
@Component({
  selector: 'page-admingoodslist',
  templateUrl: 'admingoodslist.html',
})

export class AdmingoodslistPage {
  @ViewChild('scroll') scrollElement: any;
  @ViewChild(Navbar) navBar: Navbar;
  u_token: any;
  classifyList: any = []
  classOpt: string;
  goodsList: any = [];
  isShowGoods: boolean = true;
  selectClassName: string;
  PagesInfoViewModel: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  //hostpath: any = AppGlobal.domain + '/Images/FBImages/陇西保和堂/18668000918/FBIMe6cd43214ff74ec4a6d565b81b5295a7.jpg'
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    private PopoverCtrl: PopoverController,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getGoodsClass(val);
    });
    if(this.navParams.data.classify!=undefined){
      console.log(this.navParams.data.classify)
    }
  }
  getGoodsClass(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfo, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.classifyList = rs.objectData
          this.classOpt = this.classifyList[0].classId;
          this.getGoodsList(this.classifyList[0].classId);
          this.selectClassName = this.classifyList[0].className;
        }
      }
    })
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdminhomePage');
  }
  getGoodsList(classify: any) {
    let goodsList: any;
    this.appService.httpPost_token(AppGlobal.API.postGoodsList, this.u_token, { classId: classify, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowGoods = false;
          goodsList = rs.objectData;
          this.goodsList = this.goodsList.concat(goodsList);
          this.PagesInfoViewModel.PageIndex = this.PagesInfoViewModel.PageIndex + 1;
        }
      }
    })
  }
  goodsedit(type: string, item: any) {
    if (type == 'etit') {
      this.navCtrl.push('AdmingoodseditPage', {
        pageitem: item,
        className: this.selectClassName
      });
    } else {
      this.navCtrl.push('AdmingoodseditPage');
    }
  }
  selectClassify(item: any, event) {
    this.isShowGoods = true;
    let initSelected: any = document.getElementsByClassName('slidesClassify');
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("page-tabs-activat");
    }
    this.selectClassName = item.className;
    this.PagesInfoViewModel.PageIndex = 1;
    this.goodsList = []
    event.currentTarget.classList.add("page-tabs-activat");
    this.getGoodsList(item.classId)
  }
  parmasEdit(item:any){
    this.navCtrl.push('AdmingoodsparmasPage',{
      itemparma:item
    });
  }
  deletegood(item:any) {
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该商品吗？删除后不可恢复。', '我在考虑下', '残忍删除', () => {
      this.appService.httpPost_token(AppGlobal.API.postGoodsBaseInfoDet, this.u_token, {baseInfoId:item.commId}, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.PagesInfoViewModel.PageIndex=1;
          this.getGoodsList(item.classId)
        }else{
          this.appConfigCtrl.popAlertView(rs.errorMessage);
        }
      },true)
    })
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
      this.getGoodsList_doInfin(classOpt)
      infiniteScroll.complete();
    }, 2000);
  }
  getGoodsList_doInfin(classify: any) {
    let goodsList: any;
    this.appService.httpPost_token(AppGlobal.API.postGoodsList, this.u_token, { classId: classify, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.isShowGoods = false;
          goodsList = rs.objectData;
          this.goodsList = this.goodsList.concat(goodsList);
          this.PagesInfoViewModel.PageIndex = this.PagesInfoViewModel.PageIndex + 1;
        }
      }
    })
  }
}
