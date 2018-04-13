import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService } from '../providers/NativeService'
import { AppConfig } from '../app/app.config';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';
  //rootPage:any = 'AdminloginPage';
  //rootPage:any = 'TabsPage';
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private nativeService: NativeService,
    private appConfig: AppConfig,
    private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.assertNetwork();//检测网络
      //this.jpushService.initJPush()
      this.nativeService.detectionUpgrade();
    });
  }
  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.appConfig.popToast('未检测到网络,请连接网络', 'bottom');
    }
  }
}
