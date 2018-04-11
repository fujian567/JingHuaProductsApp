import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController ,App} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：编辑发布商品
 */

@IonicPage()
@Component({
  selector: 'page-adminpublishedit',
  templateUrl: 'adminpublishedit.html',
})
export class AdminpublisheditPage {
  u_token: any;
  width: any;
  _width: number = 80;
  //imagesPath: Array<string> = ['./assets/imgs/wsbcw.jpg', './assets/imgs/gbkcp.jpg', './assets/imgs/nnxls.jpg', './assets/imgs/nnzchykl.jpg', './assets/imgs/nxykpkl.jpg'];
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  detailImagesPath: Array<string> = [];
  dataParmas: any;
  pageSubimtModel: any = {
    CommParamId: this._guid,
    commName: '',
    InventoryNum: '0',
    ImagesList: '',
    MedianPrice: '',
    commAlias: '',
    className: '',
    commSpecName: '',
    approvedNumName: '',
    enterprisesName: '',
    address: '',
    imagesList_DetailPage: ''
  }
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public app: App,
    private imagePicker: ImagePicker,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    this.dataParmas = this.navParams.data;
    if (this.dataParmas.pageType == 'publish') {
      this.pageSubimtModel.commName = this.dataParmas.item.item.commName;
      this.pageSubimtModel.commAlias = this.dataParmas.item.item.commAlias;
      this.pageSubimtModel.className = this.dataParmas.item.item.className;
      this.pageSubimtModel.commSpecName = this.dataParmas.item.item.commSpecName;
      this.pageSubimtModel.approvedNumName = this.dataParmas.item.item.approvedNumName;
      this.pageSubimtModel.enterprisesName = this.dataParmas.item.item.enterprisesName;
      this.pageSubimtModel.address = this.dataParmas.item.item.address;
      this.pageSubimtModel.CommParamId = this.dataParmas.item.item.commParamId;
      this.pageSubimtModel.MedianPrice = this.dataParmas.item.item.medianPrice;
      this.pageSubimtModel.ImagesList = this.dataParmas.item.item.imagesList_DetailPage;
      this.pageSubimtModel.imagesList_DetailPage = this.dataParmas.item.item.imagesList_DetailPage;
      for (let i = 0; i < this.dataParmas.item.item.imagesList_DetailPage.length; i++) {
        this.detailImagesPath.push(this.dataParmas.item.item.imagesList_DetailPage[i].imageData)
      }
      this.pageSubimtModel.InventoryNum = '0';
    } else {
      this.navCtrl.push('AdminpublishlistPage');
    }
  }
  ionViewWillEnter() {
    this._width = document.getElementById('addimgbg').offsetWidth;
    if (this._width == 0) {
      this._width = 79
    }
    this.width = this._width.toString() + 'px'

  }
  onAddImage() {
    if (this.detailImagesPath.length > 10) {
      this.appConfigCtrl.popAlertView('你最多只能添加10张图片！');
    } else {
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
      this.detailImagesPath.push(imageData);
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
          this.detailImagesPath.push(results[i]);
        }
      }
    }, (err) => {
      console.log('获取图片失败');
    });
  }
  isDeleteImage(index: number) {
    this.appConfigCtrl.popAlertConfirmView('您确定要删除这张图片?', '我在考虑下', '残忍删除', () => {
      this.detailImagesPath.splice(index, 1);
    });
  }
  submitData() {
    if (this.pageSubimtModel.MedianPrice.length == 0) {
      this.appConfigCtrl.popAlertView('商品价格不能为空！');
      return
    }
    if (this.detailImagesPath.length < 1) {
      this.appConfigCtrl.popAlertView('商品图片不能为空！');
      return
    }
    console.log(this.detailImagesPath)
    /*  处理图片*/
    let tempImg = [];
    for (let i = 0; i < this.detailImagesPath.length; i++) {
      let ImagesViewModel: any = {
        ImageID: this._guid,
        ImageTypeID: '4',
        ImagePath: '无',
        RelativeImagePath: '无',
        ImageName: '无',
        ObjectID: '无',
        ImageTitle: '无',
        ImageCreateDate: '2018-04-08',
        ImageOrder: i,
        ImageData: this.detailImagesPath[i],
      }
      tempImg.push(ImagesViewModel);
    }
    console.log(tempImg)
    this.pageSubimtModel.ImagesList = tempImg;
    this.pageSubimtModel.MedianPrice = Math.floor(this.pageSubimtModel.MedianPrice * 100) / 100;

    this.appService.httpPost_Img_token(AppGlobal.API.postGoodsPublishModify, this.u_token, { productPublish: this.pageSubimtModel, publish: true }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdminpublishlistPage');
      }
    }, true)
  }
  deletePublish() {
    this.appConfigCtrl.popAlertConfirmView('您确定要取消发布该商品?取消后已上传的商品将被删除并且不可恢复！', '我在考虑下', '残忍删除', () => {
      this.pageSubimtModel.MedianPrice = Math.floor(this.pageSubimtModel.MedianPrice * 100) / 100;
      this.appService.httpPost_Img_token(AppGlobal.API.postGoodsPublish, this.u_token, { productPublish: this.pageSubimtModel, publish: false }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.navCtrl.push('AdminpublishlistPage');
        }
      }, true)
    });
  }
  cancel(){
    this.navCtrl.push('AdminpublishlistPage');
  }
}
