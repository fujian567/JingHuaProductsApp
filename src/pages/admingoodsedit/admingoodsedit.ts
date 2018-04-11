import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Content, PopoverController,App,Navbar } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage'; 
/**
管理端：商品编辑界面
 */

@IonicPage()
@Component({
  selector: 'page-admingoodsedit',
  templateUrl: 'admingoodsedit.html',
})
export class AdmingoodseditPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar;
  // scrollTokeyboardHeight() {//让content向上滚动 软键盘的高度
  //   this.content.scrollTo(0, e.keyboardHeight);
  // }
  u_token: any;
  pagetitle: string = "添加商品";
  imagesPath: Array<string> = [];
  specObj: Array<any> = [['', '', '']];
  isAddImg: boolean = false;
  width: string;
  _token: any;
  isShowFirstParmas: boolean = true;
  isShowionc: boolean = false;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  _pageType: string;
  ProductBaseInfoViewModel: any = { //基本model
    CommId: '',
    ClassId: '',
    CommName: '',
    CommAlias: '',
    CommNameSpell: 'wu',
    CommIsEffective: 'true',
    CommAbbreviation: 'wu',
    ImagesList: '',
    Eaid: ''
  }
  goodsCategory: Array<string> = [];
  optGoodsCategory: string = '选择';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private appConfigCtrl: AppConfig,
    public app: App,
    public appService: AppService,
    private storageCtrl: Storage,
    private PopoverCtrl: PopoverController
  ) {
    console.log(Object.keys(navParams.data).length)
    if (Object.keys(navParams.data).length > 0) {
      let navParamsData = navParams.data
      if (navParamsData.pageitem != undefined) {
        this.pagetitle = '修改商品';
        this._pageType = 'edit'
        this.optGoodsCategory = navParams.get('className');
        this.ProductBaseInfoViewModel.CommId = navParamsData.pageitem.commId;
        this.ProductBaseInfoViewModel.ClassId = navParamsData.pageitem.classId;
        this.ProductBaseInfoViewModel.CommName = navParamsData.pageitem.commName;
        this.ProductBaseInfoViewModel.CommAlias = navParamsData.pageitem.commAlias;
        this.ProductBaseInfoViewModel.CommNameSpell = navParamsData.pageitem.commNameSpell;
        this.ProductBaseInfoViewModel.CommIsEffective = navParamsData.pageitem.commIsEffective;
        this.ProductBaseInfoViewModel.CommAbbreviation = navParamsData.pageitem.commAbbreviation;
        this.ProductBaseInfoViewModel.Eaid = navParamsData.pageitem.eaid;
        for (let i = 0; i < navParamsData.pageitem.imagesList.length; i++) {
          this.imagesPath.push(navParamsData.pageitem.imagesList[i].imageData)
        }
        this.isAddImg = true;
      } else if (navParamsData.pageitemnew != undefined) {
        console.log(navParamsData.pageitemnew)
        this._pageType = navParams.get('pageType');
        if (this._pageType == 'edit') {
          this.pagetitle = '修改商品';
        }
        this.ProductBaseInfoViewModel.CommId = navParamsData.pageitemnew.CommId;
        this.ProductBaseInfoViewModel.ClassId = navParamsData.pageitemnew.ClassId;
        this.ProductBaseInfoViewModel.CommName = navParamsData.pageitemnew.CommName;
        this.ProductBaseInfoViewModel.CommAlias = navParamsData.pageitemnew.CommAlias;
        this.ProductBaseInfoViewModel.CommNameSpell = navParamsData.pageitemnew.CommNameSpell;
        this.ProductBaseInfoViewModel.CommIsEffective = navParamsData.pageitemnew.CommIsEffective;
        this.ProductBaseInfoViewModel.CommAbbreviation = navParamsData.pageitemnew.CommAbbreviation;
        this.ProductBaseInfoViewModel.Eaid = navParamsData.pageitemnew.Eaid;
        this.optGoodsCategory = navParams.get('className');
        this.imagesPath = navParamsData.imagesPath;
        this.isAddImg = true;
      }
    }
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getCategoryData(val);
    });
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('AdmingoodslistPage');
  }
  getCategoryData(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfo, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.goodsCategory = rs.objectData
        }
      }else{
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    },true)
  }
  onAddImage() {
    if (this.imagesPath.length > 10) {
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
      this.isAddImg = true;
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
          this.isAddImg = true;
          this.imagesPath.push(results[i]);
        }
      }
    }, (err) => {
      console.log('获取图片失败');
    });
  }
  onAddImageList() {
    this.navCtrl.push('AdminGoodsDefaultImagesPage', {
      imagesPath: this.imagesPath,
      pageitem: this.ProductBaseInfoViewModel,
      className: this.optGoodsCategory,
      pageType: this._pageType
    });
  }
  selectGoodsCategory() {
    let popover = this.PopoverCtrl.create('AdminPartCategoryPage', { goodsCategory: this.goodsCategory, }, {
      cssClass: 'category',
      showBackdrop: true,
      enableBackdropDismiss: true,
    });
    popover.present({ animate: false, duration: 500 });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.optGoodsCategory = data.className;
        this.ProductBaseInfoViewModel.ClassId = data.classId;
      }
    });
  }


  subimtData() {
    if (this.ProductBaseInfoViewModel.CommName.length < 1) {
      this.appConfigCtrl.popAlertView('商品名称不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.CommAlias.length < 1) {
      this.appConfigCtrl.popAlertView('商品别名不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.classId == '') {
      this.appConfigCtrl.popAlertView('商品分类不能为空！');
      return
    }
    if (this.imagesPath.length < 1) {
      this.appConfigCtrl.popAlertView('商品图片不能为空！');
      return
    }
    /*  处理图片*/
    let tempImg = [];
    for (let i = 0; i < this.imagesPath.length; i++) {
      let ImagesViewModel: any = {
        ImageID: this._guid,
        ImageTypeID: '3',
        ImagePath: '无',
        RelativeImagePath: '无',
        ImageName: '无',
        ObjectID: '无',
        ImageTitle: '无',
        ImageCreateDate: '2018-04-08',
        ImageOrder: i,
        ImageData: this.imagesPath[i],
      }
      tempImg.push(ImagesViewModel);
    }
    this.ProductBaseInfoViewModel.ImagesList = tempImg;
    let postUrl = '';
    if (this._pageType == 'edit') {
      postUrl = AppGlobal.API.postGoodsBaseInfoEdit;
    } else {
      postUrl = AppGlobal.API.postGoodsBaseInfo;
      this.ProductBaseInfoViewModel.CommId = this._guid;
      this.ProductBaseInfoViewModel.Eaid = this._guid;
    }
    this.appService.httpPost_Img_token(postUrl, this.u_token, this.ProductBaseInfoViewModel, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdmingoodslistPage',{classify:this.ProductBaseInfoViewModel.ClassId});
      }else{
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)
  }

}
