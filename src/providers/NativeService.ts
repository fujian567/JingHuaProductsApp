import { Injectable } from "@angular/core";
import { ToastController, LoadingController, Platform, Loading, AlertController, App, NavController } from "ionic-angular";
import { AppVersion } from "@ionic-native/app-version";
import { File, FileEntry } from "@ionic-native/file";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Network } from "@ionic-native/network";
import { JPushService } from 'ionic2-jpush'
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from '@ionic-native/file-opener';
import { Observable } from "rxjs";
import { AppConfig } from '../app/app.config';
import { AppService, AppGlobal } from '../app/app.service';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
@Injectable()
export class NativeService {
    c_token: any;
    APK_DOWNLOAD: any = AppGlobal.domainimage + AppGlobal.APK_DOWNLOAD;
    //APP_DOWNLOAD: any = AppGlobal.domainimage + AppGlobal.APP_DOWNLOAD;
    //APP_DOWNLOAD: any = AppGlobal.APP_DOWNLOAD;
    constructor(
        private platform: Platform,
        private file: File,
        private inAppBrowser: InAppBrowser,
        private network: Network,
        private transfer: FileTransfer,
        private fileOpener: FileOpener,
        private appVersion: AppVersion,
        private alertCtrl: AlertController,
        private jPushPlugin: JPushService,
        private appConfig: AppConfig,
        public app: App,
        public appService: AppService,
        private device: Device,
        private storageCtrl: Storage) {
        this.storageCtrl.get('c_token').then((val) => {
            this.c_token = val;
        });
    }
    //检查app是否需要升级
    detectionUpgrade(token: any, versiontype: any) {
        if (this.isAndroid()) {
            let appVersion: any = ''
            let appVersionData = this.getVersionNumber().then(res => {
                appVersion = res;
            });
            let systemVersion: any;
            this.getSystemVersion(token, versiontype, rs => {
                systemVersion = rs
                if (systemVersion != null) {
                    this.appVersionContrast(appVersion, systemVersion.versionAndroid, versiontype);
                } else {
                    //this.appConfig.popAlertView('当前已是最新版本')
                }

            });
        }
    }
    //下载安装app
    downloadApp(versiontype) {
        if (this.isAndroid()) {
            let alert = this.alertCtrl.create({
                title: '下载进度：0%',
                cssClass: 'download',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            alert.present();
            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.file.externalDataDirectory + 'jhzy_jhzxb2b.apk'; //apk保存的目录
            fileTransfer.download(this.APK_DOWNLOAD, apk).then((entry) => {
                console.log("download complete: " + entry.toURL());
                this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() => {
                }).catch(error => {
                    console.log(error)
                });
            }).catch(error => {
                console.log(error)
            });
            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    alert.dismiss();
                } else {
                    let title = document.getElementsByClassName('alert-title')[0];
                    title && (title.innerHTML = '下载进度：' + num + '%');
                }
            });
        }
        // if (this.isIos()) {
        //     this.openUrlByBrowser(this.APP_DOWNLOAD);
        // }
    }
    //通过浏览器打开url
    openUrlByBrowser(url: string): void {
        this.inAppBrowser.create(url, '_system');
    }
    //获得app版本号,如1.0.0
    getVersionNumber() {
        return new Promise((resolve) => {
            this.appVersion.getVersionNumber().then((value: string) => {
                resolve(value);
            }).catch(err => {
                console.log(err);
            });
        });
    }
    //获取极光推送ID
    getRegistrationID(c_token: any) {
        if (this.isMobile()) {
            this.jPushPlugin.getRegistrationID()
                .then(res => {
                    this.postUserAppTag(res, c_token);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    //提交用户极光推送id
    postUserAppTag(userappid, c_token) {
        let appOs = this.device.platform + '-' + this.device.version;
        this.appService.httpPost_token(AppGlobal.API.postUserAppTag, c_token, { appOs: appOs, appjpushid: userappid }, rs => {
            if (rs.status == 401 || rs.status == 403) {
                this.app.getRootNav().setRoot('LoginPage');
            }
        })
    }
    //获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
    getNetworkType(): string {
        if (!this.isMobile()) {
            return 'wifi';
        }
        return this.network.type;
    }
    //判断是否有网络
    isConnecting(): boolean {
        return this.getNetworkType() != 'none';
    }
    //是否真机环境
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }
    //是否android真机环境
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }
    //是否ios真机环境
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }
    jumpMessagePage(title, alert) {
        //this.navCtrl.push('MessagetempPage',{title:title,alert:alert});
        this.app.getRootNav().setRoot('MessagetempPage', { title: title, alert: alert });
    }
    startPage(): boolean {
        let retData = false;
        this.storageCtrl.get('c_token').then((val) => {
            if (val != null) {
                retData = true;
            }
        });
        return retData;
    }
    getSystemVersion(token: any, versiontype: any, callback) {
        this.appService.httpPost_token(AppGlobal.API.getSystemVersion, token, { versiontype: versiontype }, rs => {
            if (rs.isSuccess) {
                callback(rs.objectData);
            }
        })
    }
    appVersionContrast(oldversion, newversion, versiontype) {
        console.log(oldversion)
        console.log(newversion)
        let oldversionC = oldversion.split(".");
        let newversionC = newversion.split(".");
        if (oldversionC[0] != newversionC[0]) {
            this.appConfig.popAlertConfirmViewExit('发现新版本,是否立即升级？', '取消', '确定', (rs) => {
                if (rs == 'exit') {
                    this.showExit()
                } else {
                    this.downloadApp(versiontype);
                }
            })
            return
        }
        if (oldversionC[1] != newversionC[1]) {
            this.appConfig.popAlertConfirmViewExit('发现新版本,是否立即升级？', '取消', '确定', (rs) => {
                if (rs == 'exit') {
                    this.showExit()
                } else {
                    this.downloadApp(versiontype);
                }
            })
            return
        }
        if (oldversionC[2] != newversionC[2]) {
            this.appConfig.popAlertConfirmViewExit('发现新版本,是否立即升级？', '取消', '确定', (rs) => {
                if (rs == 'exit') {
                    this.showExit()
                } else {
                    this.downloadApp(versiontype);
                }
            })
            return
        }
    }
    //退出app
    showExit() {
        this.platform.exitApp();
    }
}