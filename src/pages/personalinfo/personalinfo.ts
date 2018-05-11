import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig } from './../../app/app.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
/**
客户端：个人信息中心
 */

@IonicPage()
@Component({
  selector: 'page-personalinfo',
  templateUrl: 'personalinfo.html',
})
export class PersonalinfoPage {
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  userImg: any = 'assets/imgs/userImg.jpg';
  pageModel: any = {
    birthday: '2018/04/08',
    sex: '男',
    userName: '',
    userImg: ''
  }
  dependentColumns: any[] = [
    {
      options: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
        { text: '保密', value: '保密' }
      ]
    }
  ];
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public app: App,
    private imagePicker: ImagePicker,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (navParams.data.img != undefined) {
      this.userImg = navParams.data.img;
    }
  }
  userName() {
    this.appConfig.popPromptView('', 'alert-bg-c', '请输入您的姓名', 'name', '请输入您的姓名', rs => {
      this.pageModel.userName = rs.name
    })
  }
  addUserImg() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.openCamera();
          }
        }, {
          text: '从相册选取',
          handler: () => {
            this.photoAlbum();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  /**
* 打开摄像头
*/
  openCamera() {
    const options: CameraOptions = {
      quality: 40,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
    }
    this.camera.getPicture(options).then((imageData) => {
      this.pageModel.userImg = imageData;
    }, (err) => {
      // Handle error
    });
  }
  /**
  * 打开相册
  */
  photoAlbum() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 40,
      width: 300,
      outputType: 1
    };
    // 获取图片
    this.imagePicker.getPictures(options).then((results) => {
      if (results != "OK") {
        for (let i = 0; i < results.length; i++) {
          this.pageModel.userImg = results[i];
        }
      }
    }, (err) => {
      console.log(err)
      console.log('获取图片失败');
    });
  }
  saveImg() {
    let ImagesViewModel: any = {
      ImageId: this._guid,
      ImageTypeId: 7,
      ImagePath: '123',
      RelativeImagePath: '123',
      ImageName: '用户头像',
      ObjectId: this._guid,
      ImageTitle: '用户头像',
      CreateDate: '2018-04-08',
      ImageOrder: '1',
      ImageData: this.pageModel.userImg
    }
    this.appService.httpPost_Img_token(AppGlobal.API.postUserImg, this.c_token, { customerimages: ImagesViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs.isSuccess)
        this.getUserInfo(this.c_token);
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  getUserInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getUserInfo, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.userImg = AppGlobal.domainimage + rs.objectData.imagePath + rs.objectData.imageName
      }
    })
  }
}
