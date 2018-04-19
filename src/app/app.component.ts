import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService } from '../providers/NativeService'
import { AppConfig } from '../app/app.config';
import { JPushService } from 'ionic2-jpush'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage: any = 'LoginPage';
  rootPage: any = 'AdminloginPage';
  //rootPage: any = 'MessagelistPage';
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private nativeService: NativeService,
    private appConfig: AppConfig,
    private jPushPlugin: JPushService,
    private events: Events,
    private splashScreen: SplashScreen) {
    if (this.nativeService.isMobile()) {
      this.jPushPlugin.openNotification()
        .subscribe(res => {
          //跳转相对应的页面
          this.nativeService.jumpMessagePage(res.title,res.alert)
          console.log(res)
        });

      this.jPushPlugin.receiveNotification()
        .subscribe(res => {
          console.log(res)
        });

      this.jPushPlugin.receiveMessage()
        .subscribe(res => {
          console.log(res)
        });
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.assertNetwork();//检测网络
      this.nativeService.detectionUpgrade();
      if (this.nativeService.isMobile()) {
        this.jPushPlugin.setDebugMode(true);
        this.jPushPlugin.init()
          .then(res => {
            console.log('初始化成功' + res)
          }).catch(err => {
            console.log(err)
          })
      }
    });
  }
  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.appConfig.popToast('未检测到网络,请连接网络', 'bottom');
    }

  }
}
