import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：商品发布-选择商品参数界面   
 */

@IonicPage()
@Component({
  selector: 'page-admin-part-publish',
  templateUrl: 'admin-part-publish.html',
})
export class AdminPartPublishPage {
  _commId: any;
  u_token: any;
  _publish: boolean = false;
  isShowParmas: boolean = true;
  PagesInfoViewModel: any = {
    ItemsCount: '0',
    PageIndex: 1,
    PageSize: 20
  }
  goodsParmas: Array<any> = [];
  // { spec: '每120丸重0.3g，每支30丸', approval: '国药准字：1234567', CompanyName: '精华制药', CompanyAddress: '江苏南通' },
  // { spec: '每120丸重0.3g，每支30丸', approval: '国药准字：1234567', CompanyName: '精华制药', CompanyAddress: '江苏南通' },
  // { spec: '每120丸重0.3g，每支30丸', approval: '国药准字：1234567', CompanyName: '精华制药', CompanyAddress: '江苏南通' },
  // { spec: '每120丸重0.3g，每支30丸', approval: '国药准字：1234567', CompanyName: '精华制药', CompanyAddress: '江苏南通' },
  // { spec: '每120丸重0.3g，每支30丸', approval: '国药准字：1234567', CompanyName: '精华制药', CompanyAddress: '江苏南通' },

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appService: AppService,
    private storageCtrl: Storage,
  ) {
    this._commId = this.navParams.data.commId;
    this._publish = this.navParams.data.publish;
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getgoodsParmas(val);
    });
  }

  getgoodsParmas(u_token, ) {
    // this._commId='a67698d4-33f6-4910-93ae-6e81cf526003'
    // console.log('111')
    this.appService.httpPost_token(AppGlobal.API.postGoodsPublishParmas, u_token, { commId: this._commId, publish: this._publish, pages: this.PagesInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.navCtrl.setRoot('AdminloginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.goodsParmas = rs.objectData;
          this.isShowParmas=false;
        }
      }
    })
  }

  closePop() {
    this.viewCtrl.dismiss();
  }
  selectParam(item) {
    this.viewCtrl.dismiss({
      item:item
    }, 'AdminpublishPage', {
      animate: false
    });
  }
}
