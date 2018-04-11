import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, App, Navbar } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：商品发布界面
 */

@IonicPage()
@Component({
  selector: 'page-adminpublish',
  templateUrl: 'adminpublish.html',
})
export class AdminpublishPage {
  @ViewChild(Navbar) navBar: Navbar;
  u_token: any;
  width: any;
  //imagesPath: Array<string> = ['./assets/imgs/wsbcw.jpg', './assets/imgs/gbkcp.jpg', './assets/imgs/nnxls.jpg', './assets/imgs/nnzchykl.jpg', './assets/imgs/nxykpkl.jpg'];
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  detailImagesPath: Array<string> = [];
  dataParmas: any;
  pageModel: any = {
    goodName: '王氏保赤丸',
    otherName: '王氏保赤丸',
    goodsClass: '中成药',
    spec: '每120丸重0.3g，每支30丸',
    approval: '国药准字12345678',
    CompanyName: '精华制药',
    CompanyAddress: '江苏南通',
    goodPrice: ''
  }
  pageSubimtModel: any = {
    CommParamId: this._guid,
    CommName: '王氏保赤丸',
    InventoryNum: '0',
    ImagesList: '',
    MedianPrice: ''
  }
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    public app: App,
    private storageCtrl: Storage,
    public navParams: NavParams) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    this.dataParmas = this.navParams.data;
    if (this.dataParmas.pageType == 'publish') {
      this.pageModel.goodName = this.dataParmas.item.item.commName;
      this.pageModel.otherName = this.dataParmas.item.item.commAlias;
      this.pageModel.goodsClass = this.dataParmas.item.item.className;
      this.pageModel.spec = this.dataParmas.item.item.commSpecName;
      this.pageModel.approval = this.dataParmas.item.item.approvedNumName;
      this.pageModel.CompanyName = this.dataParmas.item.item.enterprisesName;
      this.pageModel.CompanyAddress = this.dataParmas.item.item.address;
      this.pageSubimtModel.CommParamId = this.dataParmas.item.item.commParamId;
      this.pageSubimtModel.CommName = this.dataParmas.item.item.commName;
      this.pageSubimtModel.InventoryNum = '0';
    } else {
      this.navCtrl.push('AdminpublishlistPage');
    }
  }
  ionViewWillEnter() {
    let _width = document.getElementById('addimgbg').offsetWidth;
    this.width = _width.toString() + 'px'
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdmingoodslistPage');
  }
  onAddImage() {
    if (this.detailImagesPath.length > 5) {
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
      quality: 50,                                                   //相片质量 0 -100
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
    if (this.pageModel.goodPrice.length == 0) {
      this.appConfigCtrl.popAlertView('商品价格不能为空！');
      return
    }
    if (this.detailImagesPath.length < 1) {
      this.appConfigCtrl.popAlertView('商品图片不能为空！');
      return
    }
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
    this.pageSubimtModel.ImagesList = tempImg;
    this.pageSubimtModel.MedianPrice = Math.floor(this.pageModel.goodPrice * 100) / 100;
    this.appService.httpPost_Img_token(AppGlobal.API.postGoodsPublish, this.u_token, { productPublish: this.pageSubimtModel, publish: true }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdminpublishlistPage');
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }
}
