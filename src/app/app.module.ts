import { HttpModule } from '@angular/http';
import { AppService } from './app.service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppConfig } from './app.config';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MultiPickerModule } from 'ion-multi-picker';
import { SQLite } from "@ionic-native/sqlite";
import { DataProvider } from './app.sql';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { NativeService } from '../providers/NativeService'
import { AppVersion } from "@ionic-native/app-version";
// import { AppUpdate } from "@ionic-native/app-update";
import { FileOpener } from "@ionic-native/file-opener";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Network } from "@ionic-native/network";
// import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { CallNumber } from '@ionic-native/call-number';
import { QRScanner } from '@ionic-native/qr-scanner';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { IonJPushModule } from 'ionic2-jpush'
import { Logger } from "../providers/Logger";
import { Device } from '@ionic-native/device';
import { StreamingMedia } from '@ionic-native/streaming-media';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonJPushModule, 
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',
      mode: 'ios',
      modalEnter: 'modal-slide-in',     //设置返回的动画效果
      modalLeave: 'modal-slide-out',    //设置返回的动画效果
      tabsHideOnSubPages: 'true'
    }),
    IonicStorageModule.forRoot({
      name: 'jhApp',
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
    IonicImageViewerModule,
    MultiPickerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    AppConfig,
    Camera,
    ImagePicker,
    SQLite,
    DataProvider,
    ScreenOrientation,
    AppVersion,
    FileOpener,
    File,
    FileTransfer,
    FileTransferObject,
    //AppUpdate,
    Network,
    // SQLitePorter,
    CallNumber,
    QRScanner,
    NativeService,
    InAppBrowser,
    Logger,
    Device,StreamingMedia,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
