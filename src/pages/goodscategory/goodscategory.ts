import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
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
  hasmore = true;
  islock = false;
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
    public app:App,
    public appService: AppService) {
  }

  ionViewDidLoad() {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getCategories(val);
    });
    this.addScrollEventListener();
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
          this.getProducts(this.categories[0].classId);
        }
      }
    })
  }
  // 选中左侧菜单
  itemClick(c, event) {
    let initSelected: any = document.getElementsByClassName('menuItem');
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
    console.log(classId)
    this.appService.httpPost_token(AppGlobal.API.postGoodsListInfoC, this.c_token, { classId: classId, pages: this.pages }, rs => {
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.products = rs.objectData;
          this.pages.PageIndex += 1;
          this.hasmore = false;
        }else{
          if(this.pages.PageIndex==1){
            this.products =[]
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
    // this.appService.httpGet(AppGlobal.API.getProducts, this.pages, d => {
    //   this.islock = false;
    //   if (d.data.length > 0) {
    //     d.data=[
    //       {"PictUrl":"./assets/imgs/wsbcw.jpg","Title":"王氏保赤丸","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/dchkl.jpg","Title":"大柴胡颗粒","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/gbkcp.jpg","Title":"固本咳喘片","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/jdssyp.jpg","Title":"季德胜蛇药片","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/jxbp.jpg","Title":"精血补片","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/nnjqmp.jpg","Title":"宁宁金荞麦片","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/nnxls.jpg","Title":"宁宁锡类散","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/nnzchykl.jpg","Title":"正柴胡饮颗粒","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/nxykpkl.jpg","Title":"宁星晕可平颗粒","ZkFinalPrice":"129","ReservePrice":"199"},
    //       {"PictUrl":"assets/imgs/ykptj.jpg","Title":"晕可平糖浆","ZkFinalPrice":"129","ReservePrice":"199"},
    //     ];
    //     this.products = this.products.concat(d.data);
    //     this.pages.PageIndex += 1;
    //   } else {
    //     this.hasmore = false;
    //     console.log("没有数据啦！")
    //   }
    // });

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
