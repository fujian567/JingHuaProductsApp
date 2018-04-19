import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/NativeService'
/**
客户端：个人中心界面
 */

@IonicPage()
@Component({
  selector: 'page-personalcenter',
  templateUrl: 'personalcenter.html',
})
export class PersonalcenterPage {
  isLogin: boolean = true;
  c_token: any = '';
  constructor(
    public navCtrl: NavController,
    private callNumber: CallNumber,
    private storageCtrl: Storage,
    public appService: AppService,
    private nativeService: NativeService,
    public app: App,
    public navParams: NavParams) {
      this.storageCtrl.get('c_token').then((val) => {
        this.c_token = val;
      });
  }

  login() {
    this.navCtrl.push('LoginPage');
  }
  accountSecurity() {
    if (this.isLogin) {
      this.navCtrl.push('AccountsecurityPage');
    }
  }
  mypoint() {
    this.navCtrl.push('MypointPage');
  }

  address() {
    if (this.isLogin) {
      this.navCtrl.push('ShippingaddressPage');
    }
  }
  viewOrder(type: any) {
    if (this.isLogin) {
      this.navCtrl.push('OrdermanagePage', { type: type, c_token: this.c_token });
    }
  }
  callServies() {
    if (this.isLogin) {
      this.callNumber.callNumber(AppGlobal.systemPhone.servicePhone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    }
  }
  personalinfo() {
    this.navCtrl.push('PersonalinfoPage');
  }
  checkVersion() {
    this.nativeService.detectionUpgrade();
    // let apkUrl=""
    // if (allowChoose) {
    //   this.alertCtrl.create({
    //     title: '升级提示',
    //     subTitle: '发现新版本,是否立即升级？',
    //     buttons: [{
    //       text: '取消'
    //     }, {
    //       text: '确定',
    //       handler: () => {
    //         this.downloadApp(apkUrl);
    //       }
    //     }]
    //   }).present();
    // } else {
    //   this.downloadApp(apkUrl);
    // }
  }
  downloadApp(apkUrl) {
    //   let alert = this.alertCtrl.create({
    //     title: '下载进度：0%',
    //     enableBackdropDismiss: false,
    //     buttons: ['后台下载']
    //   });
    //   alert.present();

    //   const fileTransfer: FileTransferObject = this.transfer.create();
    //   const apk = this.file.externalRootDirectory + 'app.apk'; //apk保存的目录  
    //   fileTransfer.download(apkUrl, apk).then(() => {
    //     this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() => {
    //       console.log('File is opened')
    //     }).catch(e => {
    //       console.log('Error openening file', e)
    //     });
    //   });
    //   fileTransfer.onProgress((event: ProgressEvent) => {
    //     let num = Math.floor(event.loaded / event.total * 100);
    //     if (num === 100) {
    //       alert.dismiss();
    //     } else {
    //       let title = document.getElementsByClassName('alert-title')[0];
    //       title && (title.innerHTML = '下载进度：' + num + '%');
    //     }
    //   });
  }
  logOut() {
    this.storageCtrl.clear();
    this.app.getRootNav().setRoot('LoginPage');
  }
}
