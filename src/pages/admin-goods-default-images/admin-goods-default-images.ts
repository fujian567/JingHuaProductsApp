import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService } from './../../app/app.service';

/**
管理端：商品编辑-主图编辑界面   
 */

@IonicPage()
@Component({
  selector: 'page-admin-goods-default-images',
  templateUrl: 'admin-goods-default-images.html',
})
export class AdminGoodsDefaultImagesPage {
  imagesPath: Array<string>;
  width: any;
  className:any;
  pageItem:any;
  _pageType:any;
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
  ) {
    let navParamsData = navParams.data
    this.imagesPath = navParamsData.imagesPath;
    this.pageItem=navParamsData.pageitem;
    this.className=navParams.get('className');
    this._pageType=navParams.get('pageType');
    console.log(this.pageItem)
    console.log(this.imagesPath)
  }
  ionViewWillEnter() {
    let _width = document.getElementById('addimgbg').offsetWidth;
    this.width = _width.toString() + 'px'
  }
  onAddImage() {
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
  isDeleteImage(index: number) {
    this.appConfigCtrl.popAlertConfirmView('您确定要删除这张图片?', '在考虑下', '残忍删除', () => {
      this.imagesPath.splice(index, 1);
    });
  }
  /**
 * 打开摄像头
 */
  openCamera() {
    const options: CameraOptions = {
      quality: 60,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imagesPath.push(imageData);
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
          this.imagesPath.push(results[i]);
        }
      }
    }, (err) => {
      console.log('获取图片失败');
    });
  }

  submitImg() {
    this.navCtrl.push('AdmingoodseditPage', {
      imagesPath: this.imagesPath,
      pageitemnew:this.pageItem,
      className:this.className,
      pageType:this._pageType,
    })
  }
}
