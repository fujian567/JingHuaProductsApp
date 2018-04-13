import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, PopoverController ,App} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';

/**
管理端：商品基本信息修改页面 
 */

@IonicPage()
@Component({
  selector: 'page-admingoodsmodify',
  templateUrl: 'admingoodsmodify.html',
})
export class AdmingoodsmodifyPage {
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
  ProductBaseInfoViewModel: any = { //基本model
    CommId: '',
    ClassId: '',
    CommName: '',
    CommAlias: '',
    CommNameSpell: 'wu',
    CommIsEffective: 'true',
    CommAbbreviation: 'wu',
    CommSpecName: '',
    ApprovedNumName: '',
    EnterprisesName: '',
    Address: '',
    imagesPath: '',
    Eaid: ''
  }
  ProductSpecViewModel: any = { //规格model
    CommSpecId: '',
    CommSpecName: '',
    CommSpecDec: '无',
    CommSpecIsEffective: 'true',
    CommSpecSpell: 'wu',
    ClassId: '',
    Eaid: ''
  }
  ProductEnterprisesViewModel: any = { //企业model
    EnterprisesId: '',
    EnterprisesName: '',
    ProvinceId: '110000',
    CityId: '110100',
    CountyId: '110101',
    Address: '',
    PccName: '北京 北京市 东城区',
    EnterprisesDec: '无',
    EnterprisesTypeId: '5',
    EnterprisesSpell: 'wu',
    Eaid: '',
    IsEffective: 'true',
  }
  ProductApprovedNumViewModel: any = { //批准文号model
    ApprovedNumId: '',
    ApprovedNumName: '',
    ApprovedNumDec: '无',
    ApprovedNumTypeId: '1',
    Eaid: '',
    IsEffective: 'true',
  }
  ProductParamModelViewModel: any = {
    ProductApprovedNumViewModel: '',
    ProductSpecViewModel: '',
    ProductEnterprisesViewModel: '',
  }
  ProductParamListViewModel: any = { //提交model
    ProductBaseInfoViewModel: '',
    ProductParamModelViewModel: ''
  }
  paramsList: Array<any> = [];
  goodsCategory: Array<string> = [];
  optGoodsCategory: string = '选择';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    private PopoverCtrl: PopoverController
  ) {
    console.log(Object.keys(navParams.data).length)
    if (Object.keys(navParams.data).length > 0) {
      let navParamsData = navParams.data
      this.imagesPath = navParamsData.imagesPath;
    }
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getCategoryData(val);
    });
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
      }
    })
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
      quality: 80,                                                   //相片质量 0 -100
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
  onAddImageList() {
    this.navCtrl.push('AdminGoodsDefaultImagesPage', {
      imagesPath: this.imagesPath
    });
  }
  selectGoodsCategory() {
    let popover = this.PopoverCtrl.create('AdminPartCategoryPage', { goodsCategory: this.goodsCategory, }, {
      cssClass: 'category',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 500 });
    popover.onDidDismiss((data) => {
      if (data != null) {
        this.optGoodsCategory = data.className;
        this.ProductBaseInfoViewModel.ClassId = data.classId;
      }
    });
  }
  addGoodsParmas() {
    if (this.ProductBaseInfoViewModel.CommSpecName.length < 1 || this.ProductBaseInfoViewModel.ApprovedNumName.length < 3 || this.ProductBaseInfoViewModel.EnterprisesName.length < 3 || this.ProductBaseInfoViewModel.Address.length < 3) {
      this.appConfigCtrl.popAlertView('请填写完整的参数，再添加！');
    } else {
      this.isShowionc = true;
      let popover = this.PopoverCtrl.create('AdminPartParmasPage', {}, {
        cssClass: 'parmasstyle',
        showBackdrop: true,
        enableBackdropDismiss: false,
      });
      popover.present({ animate: false, duration: 500 });
      popover.onDidDismiss((data) => {
        if (data != null) {
          console.log(data)
          this.paramsList.push(data);
        }
      });
    }
  }
  deleteParmas(index: number) {
    this.paramsList.splice(index, 1);
  }
  subimtData() {
    if (this.ProductBaseInfoViewModel.CommName.length < 3) {
      this.appConfigCtrl.popAlertView('商品名称不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.CommAlias.length < 3) {
      this.appConfigCtrl.popAlertView('商品别名不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.classId.length == '') {
      this.appConfigCtrl.popAlertView('商品分类不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.CommSpecName.length < 3) {
      this.appConfigCtrl.popAlertView('商品规格不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.ApprovedNumName.length < 3) {
      this.appConfigCtrl.popAlertView('批准文号不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.EnterprisesName.length < 3) {
      this.appConfigCtrl.popAlertView('生产企业不能为空！');
      return
    }
    if (this.ProductBaseInfoViewModel.Address.length < 3) {
      this.appConfigCtrl.popAlertView('生产地址不能为空！');
      return
    }
    if (this.imagesPath.length < 1) {
      this.appConfigCtrl.popAlertView('商品图片不能为空！');
      return
    }
    /* 规格赋值*/
    this.ProductSpecViewModel.CommSpecId = this._guid;
    this.ProductSpecViewModel.CommSpecName = this.ProductBaseInfoViewModel.CommSpecName;
    this.ProductSpecViewModel.ClassId = this.ProductBaseInfoViewModel.ClassId;
    this.ProductSpecViewModel.Eaid = this._guid;
    /* 批准文号赋值*/
    this.ProductApprovedNumViewModel.ApprovedNumId = this._guid;
    this.ProductApprovedNumViewModel.ApprovedNumName = this.ProductBaseInfoViewModel.ApprovedNumName;
    this.ProductApprovedNumViewModel.Eaid = this._guid;
    /* 生产企业及生产地址赋值*/
    this.ProductEnterprisesViewModel.EnterprisesId = this._guid;
    this.ProductEnterprisesViewModel.EnterprisesName = this.ProductBaseInfoViewModel.EnterprisesName;
    this.ProductEnterprisesViewModel.Address = this.ProductBaseInfoViewModel.Address;
    this.ProductEnterprisesViewModel.Eaid = this._guid;
    /* 提交参数model赋值*/
    this.ProductParamModelViewModel.ProductApprovedNumViewModel = this.ProductApprovedNumViewModel;
    this.ProductParamModelViewModel.ProductSpecViewModel = this.ProductSpecViewModel;
    this.ProductParamModelViewModel.ProductEnterprisesViewModel = this.ProductEnterprisesViewModel;

    this.paramsList.push(this.ProductParamModelViewModel)
    this.isShowFirstParmas = false;
    this.ProductBaseInfoViewModel.imagesPath = this.imagesPath;
    this.ProductBaseInfoViewModel.CommId = this._guid;
    this.ProductBaseInfoViewModel.Eaid = this._guid;
    this.ProductParamListViewModel.ProductBaseInfoViewModel = this.ProductBaseInfoViewModel;
    this.ProductParamListViewModel.ProductParamModelViewModel = this.paramsList;
    console.log(this.ProductParamListViewModel)
    this.appService.httpPost_token(AppGlobal.API.postGoodsBaseInfo, this.u_token, this.ProductParamListViewModel, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('AdmingoodslistPage');
      }else {
        this.appConfigCtrl.popAlertView(rs.errorMessage);
      }
    }, true)

  }
}
