import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Navbar } from 'ionic-angular';
import { AppConfig,AppStaticConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { ImageViewerController } from 'ionic-img-viewer';
import { DomSanitizer } from '@angular/platform-browser';  
/**
客户端：商品详情
 */

@IonicPage()
@Component({
  selector: 'page-goodsdetail',
  templateUrl: 'goodsdetail.html',
})
export class GoodsdetailPage {
  @ViewChild(Navbar) navBar: Navbar;
  _imageViewerCtrl: ImageViewerController;
  imagesPath: Array<any> = [];//['./../../assets/imgs/dchkl.jpg', './../../assets/imgs/jdssyp.jpg', './../../assets/imgs/nnzchykl.jpg', './../../assets/imgs/wsbcw.jpg'];
  goodsdetil: any = "detail";
  modelbox: any = "goods";
  c_token: any;
  rate: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  SCInfoViewModel: any = {
    SCartId: this._guid,
    CommId: '5387f80f-df36-4c5f-94d1-fc059cad2fdd',
    CommParamId: '',
    CommQuantity: '1',
    AccountId: this._guid,
    AddDate: '2018-04-08',
    EAId: this._guid,
    IsEffective: 'true',
    IsSelect: 'true',
    CoomPrice: '123.00',
    MedianPrice: '123.00',
    InventoryNum: '0',
    Subtotal: '123.00',
    magePath: '123',
    ImageData: '234',
    commName: '',
    approvedNumName: '',
    address: '',
    enterprisesName: '',
    goodsDetail:''
  }
  imagesList_DetailPage: any[] = [];
  CommParamId: any;
  Goodscomments: any = [];
  GoodsCommentNum: any = '0';
  tempComment: any = [];
  imageUrl:any='';
  // Goodscomment: any = [
  //   {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     rate: '5',
  //     assessmentScore: '80',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '80',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   }, {
  //     assessmentContent: '决定买手机的时候，我连小米官网一块看了，但是后来还是决定在京东买，京东的商品服务好售后也好，虽然同样价钱的手机，小米官网比就能多给两样东西，分期也多六个月，但是想来想去还是决定在京东买，京东我信赖，我支持。 新出的黑色小米max2使用上和感官上感觉上很不错，没有小米max1土豪金那种俗色，毕竟黑色看上去很稳重很大气的，电池不仅比以前大了待机久了，就连充电口都改成type-c的了，无论是使用上还是待机上，又或者是外观和手感上，及重量上感觉都很不错。只是不知道什么时候小米也能换上京东方的屏。',
  //     personImg: 'assets/imgs/nnzchykl.jpg',
  //     personName: '测试人员',
  //     assessmentScore: '100',
  //     assessmentCreateDate: '2018-04-08',
  //     ImageList: ['assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg', 'assets/imgs/nnzchykl.jpg']
  //   },
  // ];
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public imageViewerCtrl: ImageViewerController,
    private domSanitizer: DomSanitizer,
    public app: App,
    public navParams: NavParams) {
      this.imageUrl=AppGlobal.domainimage;
    if (this.navParams.get('item') != undefined) {
      this.CommParamId = this.navParams.get('item').commParamId;
      this.storageCtrl.get('c_token').then((val) => {
        this.c_token = val;
        this.getGoodsComments(val, this.CommParamId)
        this.getGoodsDetail(val, this.CommParamId)
      });
    } else {
      this.navCtrl.pop();
    }

    // this.storageCtrl.get('c_account').then((val) => {
    //   this.SCInfoViewModel.AccountId = val;
    // });
    // this.CommParamId = '6c7785ab-812c-423f-be62-44cd9d5cc731'

    //this.tempComment = this.Goodscomment.slice(0, 2)
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.navCtrl.push('TabsPage');
  }
  getGoodsDetail(c_token, commParamId) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsDetailInfoC, c_token, { commParamId: commParamId }, rs => {
      console.log(rs)
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          this.SCInfoViewModel.CommId = rs.objectData.commId;
          this.SCInfoViewModel.CommParamId = rs.objectData.commParamId;
          this.SCInfoViewModel.CoomPrice = rs.objectData.medianPrice;
          this.SCInfoViewModel.MedianPrice = rs.objectData.medianPrice;
          this.SCInfoViewModel.Subtotal = rs.objectData.medianPrice;
          this.SCInfoViewModel.commName = rs.objectData.commName;
          this.SCInfoViewModel.commSpecName = rs.objectData.commSpecName;
          this.imagesPath = rs.objectData.imagesList;
          this.imagesList_DetailPage = rs.objectData.imagesList_DetailPage;
          this.SCInfoViewModel.approvedNumName = rs.objectData.approvedNumName;
          this.SCInfoViewModel.address = rs.objectData.address;
          this.SCInfoViewModel.enterprisesName = rs.objectData.enterprisesName;
          this.rate = rs.objectData.transactionScore;
        }
      }
    }, true);
  }
  addshoppingcart() {
    this.appService.httpPost_token(AppGlobal.API.postShoppingCartInfo, this.c_token, { sCInfo: this.SCInfoViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.navCtrl.push('ShoppingcartPage');
      }
    }, true)
  }
  gohoppingcart() {
    this.navCtrl.push('ShoppingcartPage');
  }
  buy() {
    this.navCtrl.push('OrderPage');
  }
  showOriginal(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage, {
      enableBackdropDismiss: true
    });
    imageViewer.present();
  }
  viewAllComment() {
    this.modelbox = "goodscomment";
  }
  doInfinite(infiniteScroll) {
    infiniteScroll.complete();
    this.modelbox = "productsdetail";
  }
  doRefresh(refresher) {
    refresher.complete();
    this.modelbox = "goods";
  }
  getGoodsComments(c_token, commParamId) {
    this.appService.httpPost_token(AppGlobal.API.postGoodsComment, c_token, { commparamId: commParamId }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.GoodsCommentNum = rs.objectData.length;
            for (let i = 0; i < rs.objectData.length; i++) {
              let Goodscomment: any = {
                assessmentContent: '',
                avatarinfo: '',
                rate: '',
                mobile: '',
                assessmentScore: '',
                assessmentCreateDate: '',
                ImageList: ''
              }
              Goodscomment.assessmentContent = rs.objectData[i].assessmentContent;
              Goodscomment.assessmentScore = rs.objectData[i].assessmentScore;
              Goodscomment.assessmentCreateDate = new Date(rs.objectData[i].assessmentCreateDate).toLocaleDateString();
              Goodscomment.mobile=AppStaticConfig.hideMobile(rs.objectData[i].mobile);
              Goodscomment.avatarinfo=rs.objectData[i].avatarinfo;
              this.Goodscomments.push(Goodscomment);
            }
            if (this.Goodscomments.length > 2) {
              this.tempComment = this.Goodscomments.slice(0, 2)
            } else {
              this.tempComment = this.Goodscomments
            }
          }
        }
      }
    });
  }
  assembleHTML(strHTML:any) {
    return this.domSanitizer.bypassSecurityTrustHtml(strHTML);
    }
}
