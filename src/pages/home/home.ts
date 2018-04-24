import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/NativeService'
/**
客户端：主界面
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // slides: Array<any> = [];
  //categories: Array<any> = [];
  // products: Array<any> = [];
  test: Array<any> = [];
  c_token: any;
  messageCount: any = "0";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public app: App,
    private nativeService: NativeService,
    private storage: Storage) {
    // this.getSlides();
    //this.getCategories();
    // this.getProducts();

  }
  //this.storage.set('name', 'Max');
  //   //获取分类
  // getCategories() {
  //   this.appService.httpGet(AppGlobal.API.getCategories, { appTag: 'dress' }, rs => {
  //     console.debug(rs);
  //     this.categories = rs.data;
  //   })
  // }
  ionViewDidLoad() {
    this.storage.get('c_token').then((val) => {
      this.c_token = val;
      this.getUserAppTag(val);
      this.myGetMessageCount(val);
      this.getUserInfo(val);
    });
  }
  editClick() {

  }
  goodsDetail() {
    let item = {
      commParamId: '8256449C-2B8B-4231-AA9D-22B94921E2D3'
    }
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
  goodsDetail1() {
    let item = {
      commParamId: 'D407A42B-AD2E-4DB4-B8EB-47845985EC3A'
    }
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
  goodsDetail2() {
    let item = {
      commParamId: '904660D3-0278-4F1A-A4DB-4DA015EA151D'
    }
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
  goodsDetail3() {
    let item = {
      commParamId: 'BEA1920C-2D21-438C-B38F-543F7067FC44'
    }
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
  goodsDetail4() {
    let item = {
      commParamId: 'AE05BEAA-BD65-4FC6-AB25-B5E33F92E6B5'
    }
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
  //判断用户是否有极光推送id
  getUserAppTag(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getUserAppTag, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (!rs.isSuccess) {
        this.nativeService.getRegistrationID(c_token);
      }
    })
  }
  // spinner1: boolean = true;
  // params = {
  //   favoritesId: 2054400,
  //   pageNo: 1,
  //   pageSize: 20
  // }
  // //获取幻灯片
  // getSlides() {
  //   var params = {
  //     favoritesId: 2056439,
  //     pageNo: 1,
  //     pageSize: 5
  //   }
  //   this.appService.httpGet(AppGlobal.API.getProducts, params, rs => {
  //     console.debug(rs);
  //     this.slides = rs.data;
  //     this.spinner1 = false;
  //   })
  // }

  // //获取首页推荐列表
  // getProducts() {
  //   this.appService.httpGet(AppGlobal.API.getProducts, this.params, rs => {
  //     console.debug(rs);
  //     this.products = rs.data;
  //   })
  // }
  // //商品详情
  // goDetails(item) {
  //   console.debug('go details...')
  // }
  qrScannerPage() {
    this.navCtrl.push('ScanPage');
  }
  myMessagePage() {
    this.navCtrl.push('MessagelistPage');
  }
  myGetMessageCount(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getMessageCount, c_token, { read: false }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData > 0) {
          if (rs.objectData > 99) {
            this.messageCount = '99+'
          } else {
            this.messageCount = rs.objectData
          }
        }
      }
    })
  }
  getUserInfo(c_token) {
    // this.storage.get('userimg').then((val) => {
    //   if (val == null) {
    //     this.appService.httpGet_token(AppGlobal.API.getUserInfo, c_token, {}, rs => {
    //       if (rs.status == 401 || rs.status == 403) {
    //         this.app.getRootNav().setRoot('LoginPage');
    //       }
    //       if (rs.isSuccess) {
    //       } else {
    //         this.appService.geteImgContact().subscribe(rs => {
    //           let img64 = rs.arrayBuffer();
    //           let binary = '';
    //           let bytes = new Uint8Array(img64);
    //           for (var len = img64.byteLength, i = 0; i < len; i++) {
    //             binary += String.fromCharCode(bytes[i]);
    //           }
    //           //this.storage.set('userimg', window.btoa(binary))
    //         })
    //       }
    //     })
    //   }
    // })
  }
}
