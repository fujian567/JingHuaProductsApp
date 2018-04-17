import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService } from '../providers/NativeService'
import { AppConfig } from '../app/app.config';
import { JPushService } from 'ionic2-jpush'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';
  //rootPage:any = 'AdminloginPage';
  //rootPage: any = 'JpushtestPage';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private nativeService: NativeService,
    private appConfig: AppConfig,
    private jPushPlugin: JPushService,
    private events: Events,
    private splashScreen: SplashScreen) {
    this.jPushPlugin.openNotification()
      .subscribe(res => {
        alert('点击通知内容 openNotification');
      });

    this.jPushPlugin.receiveNotification()
      .subscribe(res => {
        alert('收到通知推送 receiveNotification');
      });

    this.jPushPlugin.receiveMessage()
      .subscribe(res => {
        alert('收到定义消息推送 receiveMessage');
      });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.assertNetwork();//检测网络
      this.nativeService.detectionUpgrade();
      this.jPushPlugin.setDebugMode(true);
      this.jPushPlugin.init()
        .then(res => {
          console.log('初始化成功'+res)
        }).catch(err => {
          console.log(err)
        })
      
    });
  }
  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.appConfig.popToast('未检测到网络,请连接网络', 'bottom');
    }

  }
}
