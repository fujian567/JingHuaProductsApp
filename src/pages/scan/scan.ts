import { Component } from '@angular/core';
import { IonicPage, NavController, App, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
/**
客户端：调用相机扫描二维码
 */

@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  c_token: any = '';
  constructor(
    private navCtrl: NavController,
    private storageCtrl: Storage,
    public appService: AppService,
    private appConfigCtrl: AppConfig,
    public app: App,
    public viewCtrl: ViewController,
    private qrScanner: QRScanner) {
    //默认为false
    this.light = false;
    this.frontCamera = false;
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    
  }

  ionViewDidLoad() {
    let item: any = {
      commParamId: ''
    }
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.appService.httpPost_token(AppGlobal.API.postGoodsSQ, this.c_token, { commupc: text }, rs => {
              if (rs.status == 401 || rs.status == 403) {
                this.app.getRootNav().setRoot('LoginPage');
              }
              if (rs.isSuccess) {
                if (rs.objectData.length > 0) {
                  this.qrScanner.hide(); // hide camera preview
                  scanSub.unsubscribe(); // stop scanning
                  item.commParamId=rs.objectData[0];
                  this.navCtrl.push('GoodsdetailPage', { item: item });
                }
              }
            }, true)
            //this.navCtrl.pop();
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  ionViewDidEnter() {
    //页面可见时才执行
    this.showCamera();
  }
  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  hideCamera() {
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  ionViewWillLeave() {
    this.hideCamera();
  }
  public dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
