import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig } from './../../app/app.config';
import { Storage } from '@ionic/storage';
/**
管理端：资料补齐详细界面
 */

@IonicPage()
@Component({
  selector: 'page-adminreplenishinfodetail',
  templateUrl: 'adminreplenishinfodetail.html',
})
export class AdminreplenishinfodetailPage {
  _imageViewerCtrl: ImageViewerController;
  _servePath: any = AppGlobal.domain;
  u_token: any;
  pageModel: any = {
    companyName: '陇西保和堂',
    clientName: '陇西保和堂',
    mobile: '陇西保和堂',
    imagesList: ['./assets/imgs/wsbcw.jpg', './assets/imgs/dchkl.jpg', './assets/imgs/gbkcp.jpg'],
    property: ''
  }
  isViewPage: any = false;
  pageParmasData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public app: App,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    public imageViewerCtrl: ImageViewerController) {
    this._imageViewerCtrl = imageViewerCtrl;
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    this.isViewPage = navParams.get("isView");
    this.pageParmasData = navParams.data
  }
  showOriginal(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
  }
  replenishSubimt() {
    if (this.pageModel.property == "") {
      this.appConfig.popAlertView('企业属性不能为空！')
      return
    } else {
      console.log(this.pageModel)
      this.appService.httpPost_token(AppGlobal.API.postDataCompletionSubmit, this.u_token, { _fbusinessState: 1 }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {

        }
      })
    }
  }
}
