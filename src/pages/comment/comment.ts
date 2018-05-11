import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ActionSheetController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
/**
客户端：评论界面
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  c_token: any;
  orderinfo: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  pagedatamodle: any = {
    AssessmentId: this._guid,
    OrderId: '',
    CommId: '',
    CommParamId: '',
    AssessmentContent: '',
    AssessmentScore: '5',
    AccountId: this._guid,
    AssessmentCreateDate: '2018-04-08',
    AssessmentMark: '无',
    IsEffective: true,
    ImagesList: '',
  }
  imgUrl: any = AppGlobal.domainimage;
  imagesPath: any = [];
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    private appConfigCtrl: AppConfig,
    public imageViewerCtrl: ImageViewerController,
    private storageCtrl: Storage,
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.navParams.data.item != undefined) {
      this.orderinfo = this.navParams.data.item;
      this.pagedatamodle.OrderId = this.orderinfo.orderId;
      this.pagedatamodle.CommId = this.orderinfo.paramsInfo[0].commId;
      this.pagedatamodle.CommParamId = this.orderinfo.paramsInfo[0].commParamId;
      //this.imagesPath.push(this.orderinfo.paramsInfo[0].productImageData) ;
      console.log(this.orderinfo)
    }
  }

  comment() {
    if (this.pagedatamodle.AssessmentContent.length < 1) {
      this.pagedatamodle.AssessmentContent = '用户采用默认评价'
    }
    if (this.pagedatamodle.AssessmentContent.length > 100) {
      this.appConfigCtrl.popAlertView('评论内容不能大于100个字');
      return
    }
    let imagesTempPath: any = [];
    for (let i = 0; i < this.imagesPath.length; i++) {
      let ImagesViewModel: any = {
        ImageId: this._guid,
        ImageTypeId: '6',
        ImagePath: '123',
        RelativeImagePath: '123',
        ImageName: '123',
        ObjectId: this.pagedatamodle.CommParamId,
        ImageTitle: '商品晒图',
        CreateDate: '2018-04-08',
        ImageOrder: i,
        ImageData: this.imagesPath[i],
      }
      imagesTempPath.push(ImagesViewModel)
    }
    this.pagedatamodle.AssessmentContent=AppStaticConfig.clearHTML(this.pagedatamodle.AssessmentContent)
    if (imagesTempPath.length > 0) {
      this.pagedatamodle.ImagesList = imagesTempPath;
    } else {
      this.pagedatamodle.ImagesList = null
    }
    console.log(this.pagedatamodle)
    this.appService.httpPost_token(AppGlobal.API.postOrderCommentInfo, this.c_token, { ordersassessment: this.pagedatamodle }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      console.log(rs)
      if (rs.isSuccess) {
        this.navCtrl.pop();
      } else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
    //this.appConfigCtrl.popAlertView('感谢你对本商品的评论');
  }
  isDeleteImage(index: number) {
    this.appConfigCtrl.popAlertConfirmView('您确定要删除这张图片?', '再考虑下', '残忍删除', () => {
      this.imagesPath.splice(index, 1);
    });
  }
  onModelChange(event: any) {
    this.pagedatamodle.AssessmentScore = event;
    console.log(event)
  }
  onAddImage() {
    if (this.imagesPath.length > 5) {
      this.appConfigCtrl.popAlertView('您最多只能上传5张图片');
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
      quality: 90,                                                   //相片质量 0 -100
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
      console.log(err)
      console.log('获取图片失败');
    });
  }
}
