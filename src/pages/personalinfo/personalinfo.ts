import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController,App } from 'ionic-angular';
import { AppService } from './../../app/app.service';
import { AppConfig } from './../../app/app.config';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public app: App,
    private imagePicker: ImagePicker,
    public navParams: NavParams) {
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
      quality: 90,                                                   //相片质量 0 -100
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
      quality: 60,
      width: 1000,
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
}
