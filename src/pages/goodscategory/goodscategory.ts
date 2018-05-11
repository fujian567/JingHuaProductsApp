import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from '../../app/app.service'
import { Storage } from '@ionic/storage';

/**
客户端：商品分类界面
 */

@IonicPage()
@Component({
  selector: 'page-goodscategory',
  templateUrl: 'goodscategory.html',
})
export class GoodscategoryPage {
  @ViewChild('scroll') scrollElement: any;
  @ViewChild('spinner') spinnerElement: any;
  c_token: any;
  categories: Array<any> = [];
  selectedMenuTarget: any;
  products: Array<any> = [];
  getClassid: any;
  getClassTitle: any;
  hasmore = true;
  islock = false;
  active: any = 'active';
  temp64 = './../../assets/imgs/dchkl.jpg';
  pages = {
    ItemsCount: 0,
    PageIndex: 1,
    PageSize: 24
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appConfigCtrl: AppConfig,
    private storageCtrl: Storage,
    public app: App,
    public appService: AppService) {
  }

  ionViewDidLoad() {
    if (this.navParams.data.item != undefined) {
      this.getClassid = this.navParams.data.item;
      this.getClassTitle = this.navParams.data.title;
    }
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getCategories(val);
    });
    this.addScrollEventListener();
  }

  ionViewDidEnter() {
    if (this.getClassid != undefined) {
      let initSelected = document.getElementsByClassName('menuItem');
      let itemIndex: number = 0;
      console.log(initSelected.length)
      for (let i = 0; i < initSelected.length; i++) {
        initSelected[i].classList.remove('active');
        if (initSelected[i].id == this.getClassid) {
          itemIndex = i;
        }
      }
      initSelected[itemIndex].classList.add('active')
    }
  }

  addScrollEventListener() {
    this.scrollElement._scrollContent.nativeElement.onscroll = event => {
      if (this.spinnerElement) {
        //元素顶端到可见区域顶端的距离
        var top = this.spinnerElement.nativeElement.getBoundingClientRect().top;
        //可见区域高度
        var clientHeight = document.documentElement.clientHeight;
        if (top <= clientHeight) {
          console.log("ready loadmore...");
          this.doInfinite();
        }
      }
    }
  }
  // 获取左侧菜单
  getCategories(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfoC, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.categories = rs.objectData;
          if (this.getClassid != undefined) {
            console.log('首页跳转')
            this.getProducts(this.getClassid);
          } else {
            console.log('分类跳转')
            this.getProducts(this.categories[0].classId);
          }
        }
      }
    })
  }
  // 选中左侧菜单
  itemClick(c, event) {
    let initSelected: any = document.getElementsByClassName('menuItem');
    console.log(initSelected.length)
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("active");
    }
    //修改本次选中菜单的样式
    event.currentTarget.classList.add("active");
    //将本次选中的菜单记录
    this.selectedMenuTarget = event.currentTarget;
    this.hasmore = true;
    this.pages.PageIndex = 1;
    this.getProducts(c.classId);
  }

  getProducts(classId: any) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsListInfoC, this.c_token, { classId: classId, pages: this.pages }, rs => {
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.products = rs.objectData;
          this.pages.PageIndex += 1;
          this.hasmore = false;
        } else {
          if (this.pages.PageIndex == 1) {
            this.products = []
          }
          this.hasmore = false;
        }
      }
    })
  }

  doInfinite() {
    if (this.islock) {
      return;
    }
    if (this.hasmore == false) {
      return;
    }
    this.islock = true;

    this.islock = false;
    let d_data = [
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
      { commName: "王氏保赤丸", medianPrice: "129", commParamId: '328121a9-7839-4352-bbe8-05cb95030eda', imagesList: [{ imageData: this.temp64 }] },
    ];
    this.products = this.products.concat(d_data);
    this.pages.PageIndex += 1;
  }
}
