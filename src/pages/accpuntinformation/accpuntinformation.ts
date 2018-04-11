import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, App } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
客户端：资质填写界面
 */

@IonicPage()
@Component({
  selector: 'page-accpuntinformation',
  templateUrl: 'accpuntinformation.html',
})
export class AccpuntinformationPage {
  imagesTempPath: Array<any> = [];
  imagesPath: Array<any> = [];
  width: string;
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  ClientInfoViewModel: any = {
    ClientName: '',
    Mobile: '',
    CompanyName: '',
    SalesmanCode: '',
    ExpiredDate: '2018-04-08',
    ImagesList: Array,
    FbusinessId: this._guid
  }
  pagestatus: string;
  pagestatusdata: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public app: App,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
  ) {
    this.pagestatus = navParams.get("status");
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
    });
    if (this.pagestatus != "reRubmit") {
      this.storageCtrl.get('c_token').then((val) => {
        this.c_token = val;
        this.getClinetStatus(val);
      });
    } else {
      this.pagestatusdata = navParams.data.pagedata.infodata
      this.ClientInfoViewModel.ClientName = this.pagestatusdata.clientName;
      this.ClientInfoViewModel.Mobile = this.pagestatusdata.mobile;
      this.ClientInfoViewModel.CompanyName = this.pagestatusdata.companyName;
      this.ClientInfoViewModel.FbusinessId = this.pagestatusdata.fbusinessId;
      this.ClientInfoViewModel.SalesmanCode = this.pagestatusdata.SalesmanCode;
    }
  }
  ionViewWillEnter() {
    let _width = document.getElementById('addimgbg').offsetWidth;
    this.width = _width.toString() + 'px'

  }
  getClinetStatus(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getfbenterpriseStatus, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        let infodata: any;
        if (rs.objectData == 60 || rs.objectData == 2) {//首营待审核
          infodata = ""
          this.navCtrl.setRoot('InfoauditPage', {
            auditStatus: true,
            infodata
          });
        } else if (rs.objectData == 4) {//不通过
          infodata = "不通过"
          this.navCtrl.setRoot('InfoauditPage', {
            auditStatus: false,
            infodata
          });
        } else if (rs.objectData == 3) {//通过
          this.navCtrl.setRoot('TabsPage');
        } else if (rs.objectData == 61) {//未首营
          this.getClinetInfo(this.c_token)
        }
      }
    })
  }
  getClinetInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getfbenterprise, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs.objectData)
        this.ClientInfoViewModel.ClientName = rs.objectData.clientName;
        this.ClientInfoViewModel.Mobile = rs.objectData.mobile;
        this.ClientInfoViewModel.CompanyName = rs.objectData.companyName;
        this.ClientInfoViewModel.FbusinessId = rs.objectData.fbusinessId;
        this.ClientInfoViewModel.SalesmanCode = rs.objectData.salesmanCode;
      }
    }, true)
  }
  isDeleteImage(index: number) {
    this.appConfigCtrl.popAlertConfirmView('您确定要删除这张图片?', '我在考虑下', '残忍删除', () => {
      this.imagesPath.splice(index, 1);
    });
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
      console.log(err)
      console.log('获取图片失败');
    });
  }
  submitImg() {
    console.log(this.c_token)
    this.imagesTempPath.splice(0, this.imagesTempPath.length)
    if (this.ClientInfoViewModel.CompanyName == "") {
      this.appConfigCtrl.popAlertView('请输入您的公司名称');
      return
      // } else if (this.ClientInfoViewModel.SalesmanCode == "") {
      //   this.appConfigCtrl.popAlertView('请输入与您联系的业务员姓名');
      //   return
      // } else if (this.ClientInfoViewModel.ExpiredDate == "") {
      //   this.appConfigCtrl.popAlertView('请输入您企业证件的过期日期');
      //   return
    } else if (this.imagesPath.length == 0) {
      this.appConfigCtrl.popAlertView('请最少上传一张图片');
      return
    } else if (this.imagesPath.length > 5) {
      this.appConfigCtrl.popAlertView('您最多可上传5张图片');
      return
    } else {
      for (let i = 0; i < this.imagesPath.length; i++) {
        let ImagesListModel: any = {
          ImageOrder: '',
          ImageData: ''
        }
        ImagesListModel.ImageData = this.imagesPath[i];
        ImagesListModel.ImageOrder = i.toString();
        this.imagesTempPath.push(ImagesListModel)
      }
      this.ClientInfoViewModel.ImagesList = this.imagesTempPath;
      if (this.ClientInfoViewModel.SalesmanCode.length < 1) {
        this.ClientInfoViewModel.SalesmanCode = "无"
      }
      this.appService.httpPost_Img_token(AppGlobal.API.postClientInfo, this.c_token, this.ClientInfoViewModel, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.imagesTempPath = [];
          this.app.getRootNav().setRoot('LoginPage');
        }
        if (rs.isSuccess) {
          this.appConfigCtrl.popAlertView('您的资料我们已经收到并正在审核中，请耐心等待1-3个工作日，您也可以联系您的业务员查询审核进度。');
          this.navCtrl.push('InfoauditPage', {
            auditStatus: true
          });
        } else {
          this.imagesTempPath = [];
        }
      }, true)
    }
  }
}
  // compressImage(file) {
  //   const imgobj = new Image;
  //   imgobj.src = file.localURL
  //   var canvas = document.createElement('canvas');
  //   var context = canvas.getContext('2d');
  //   imgobj.onload = () => {
  //     let originWidth = imgobj.width;
  //     let originHeight = imgobj.height;
  //     let targetWidth = originWidth;
  //     let targetHeight = originHeight;
  //     if (originWidth > this._maxWidth || originHeight > this._maxHeight) {
  //       if (originWidth / originHeight > this._maxWidth / this._maxHeight) {
  //         // 更宽，按照宽度限定尺寸
  //         targetWidth = this._maxWidth;
  //         targetHeight = Math.round(this._maxWidth * (originHeight / originWidth));
  //       } else {
  //         targetHeight = this._maxHeight;
  //         targetWidth = Math.round(this._maxHeight * (originWidth / originHeight));
  //       }
  //       // canvas对图片进行缩放
  //       canvas.width = targetWidth;
  //       canvas.height = targetHeight;
  //       // 清除画布
  //       context.clearRect(0, 0, targetWidth, targetHeight);
  //       // 图片压缩
  //       context.drawImage(imgobj, 0, 0, targetWidth, targetHeight);
  //       canvas.toBlob((blob) => {
  //         this.canvasBlob = blob
  //       });
  //     }
  //   }
  // }
  // convterBlod(imageURI, index) {
  //   this.FileCtrl.resolveLocalFilesystemUrl(imageURI).then(entry => {
  //     (<FileEntry>entry).file(file => {
  //       //this.compressImage(file)
  //       //let blob: Blob = this.canvasBlob;
  //       let blob: Blob = <Blob>file;
  //       const reader = new FileReader();
  //       reader.onloadend = (e) => {
  //         //console.log(this.canvasBlob);
  //         const imgBlob = new Blob([reader.result], { type: blob.type });
  //         console.log(imgBlob)
  //         this.formdata.append('ByteImage' + index, imgBlob, 'ByteImage' + index);
  //       };
  //      reader.readAsArrayBuffer(blob);
  //     });
  //   });
  // }