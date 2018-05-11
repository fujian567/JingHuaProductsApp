import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/NativeService'
/**
客户端：主界面
 */
enum pageClass {
  topAd = '043b6d64-017d-4143-8602-125236dcad60',//顶部广告
  classAd = '775e9ef0-7e09-4ebd-b4be-2f0dc056fcfe',//分类图片
  middleAd = 'fd2f9cb5-a5a0-47ea-842d-36761556ee82',//中部广告
  seasonPro = 'c2668495-b821-4dd2-8bf7-66cf1c69dc25',//当季用药
  hotSell = '27f9a319-7198-4724-96a8-88776caa8fba',//热销产品
}
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  classAdData: Array<any> = [];
  isShowclassAdData: boolean = false;
  topAdData: Array<any> = [];
  isShowtopAdData: boolean = false;
  middleAdData: Array<any> = [];
  isShowmiddleAdData: boolean = false;
  seasonProData: Array<any> = [];
  seasonProDataMore: boolean = false;
  isShowseasonProData: boolean = false;
  hotSellData: Array<any> = [];
  hotSellDataMore: boolean = false;
  isShowhotSellData: boolean = false;
  c_token: any;
  imageUrl = AppGlobal.domainimage;
  messageCount: any = "0";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public app: App,
    public appConfigCtrl: AppConfig,
    private nativeService: NativeService,
    private storage: Storage) {

  }
  ionViewDidLoad() {
    this.storage.get('c_token').then((val) => {
      this.c_token = val;
      //this.getUserAppTag(val);
      this.accountStatus(val);
      this.myGetMessageCount(val);
            //this.getUserInfo(val);
            // this.getHomePageType(val);
            // this.getHomePageInfo(val);
            // this.getHomePageClass(val)
      this.getHomePageByClassID_classAd(val);
      this.getHomePageByClassID_hotSell(val);
      this.getHomePageByClassID_middleAd(val);
      this.getHomePageByClassID_seasonPro(val);
      this.getHomePageByClassID_topAd(val);
      this.checkVersion(val);
    });
  }
  goodsDetail(item) {
    console.log(item)
    this.navCtrl.push('GoodsdetailPage', { parms: item });
  }
  classid(item, title) {
    this.navCtrl.push('GoodscategoryPage', { item: item, title: title });
  }
  classid1() {
    this.navCtrl.push('GoodscategoryPage');
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
  //判断账户状态
  accountStatus(c_token) {
    if (c_token == null) {
      c_token = '123'
    }
    this.appService.httpGet_token(AppGlobal.API.getAccountStatus, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.objectData == '0') {
        this.app.getRootNav().setRoot('AccpuntinformationPage');
      } else if (rs.objectData == '2') {
        this.navCtrl.setRoot('InfoauditPage', {
          auditStatus: true
        });
      } else if (rs.objectData == '-1') {
        this.appConfigCtrl.popAlertView('您的账户已被停用，请联系客服进行咨询！');
        this.app.getRootNav().setRoot('LoginPage');
      } else if (rs.objectData == '-2') {
        this.appConfigCtrl.popAlertView('您的账户状态异常，请联系客服进行咨询！');
        this.app.getRootNav().setRoot('LoginPage');
      }
    })
  }
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
  //获取首页页面类型
  getHomePageType(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getHomePageType, c_token, {}, rs => {

    })
  }
  //获取首页页面分类页
  getHomePageClass(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getHomePageClass, c_token, {}, rs => {

    })
  }
  //获取首页页面信息_所有
  getHomePageInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getHomePageInfo, c_token, {}, rs => {

    })
  }
  //获取首页页面信息_分类ID--分类图片
  getHomePageByClassID_classAd(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getHomePageByClassID, c_token, { categoryid: pageClass.classAd }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.classAdData = rs.objectData;
          this.isShowclassAdData = true;
        }
      }
    })
  }
  //获取首页页面信息_分类ID--顶部图片
  getHomePageByClassID_topAd(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getHomePageByClassID, c_token, { categoryid: pageClass.topAd }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.topAdData = rs.objectData;
          this.isShowtopAdData = true;
        }
      }
    }, true);
  }
  //获取首页页面信息_分类ID--中部广告
  getHomePageByClassID_middleAd(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getHomePageByClassID, c_token, { categoryid: pageClass.middleAd }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.middleAdData = rs.objectData;
          this.isShowmiddleAdData = true;
        }
      }
    });
  }
  //获取首页页面信息_分类ID--当季用药广告
  getHomePageByClassID_seasonPro(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getHomePageByClassID, c_token, { categoryid: pageClass.seasonPro }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.seasonProData = rs.objectData;
          this.isShowseasonProData = true;
          if (rs.objectData.length < 8) {
            this.seasonProDataMore = true;
          }
        }
      }
    });
  }
  //获取首页页面信息_分类ID--热销广告
  getHomePageByClassID_hotSell(c_token) {
    this.appService.httpPost_token(AppGlobal.API.getHomePageByClassID, c_token, { categoryid: pageClass.hotSell }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.hotSellData = rs.objectData;
          this.isShowhotSellData = true;
        }
        if (rs.objectData.length < 8) {
          this.hotSellDataMore = true;
        }
      }
    });
  }
  //检测是否升级
  checkVersion(c_token) {
    //1、前台，2、后台
    let versiontype = 1;
    this.nativeService.detectionUpgrade(c_token, versiontype);
  }
}
