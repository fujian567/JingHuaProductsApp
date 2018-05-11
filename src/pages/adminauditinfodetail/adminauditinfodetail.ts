import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { Storage } from '@ionic/storage';

/**
管理端：资质审核详情界面
 */

@IonicPage()
@Component({
  selector: 'page-adminauditinfodetail',
  templateUrl: 'adminauditinfodetail.html',
})
export class AdminauditinfodetailPage {
  _imageViewerCtrl: ImageViewerController;
  _servePath: any = AppGlobal.domainimage;
  u_token: any;
  region: any;
  FBAuditViewModel: any = {
    fbusinessId: '',
    ProvinceID: '',
    CityId: '',
    CountyId: '',
    address: '',
    pccname: '',
    expiredDate: '',
    companyName: '',
    clientName: '',
    mobile: '',
    imagesList: '',
    auditDec: ' 无',
    isAudit: true,
    eTaxIdeNumber: '',
    enterpriseNatureName: '',
    salesmanCode: '',
    salesmanName_OA: '',
    userIdErp: '',
    eACode_ERP: '',
    location: '',
    enterpriseNatureId: ''
  }
  tempsalesmanName: any = '';
  isShowSalesmanName: boolean = false;
  //enterpriseNature: any;
  PCCname: any;
  eTaxIdeNumber: any;
  expiredDate: any;
  isViewPage: any = false;
  pageParmasData: any;
  dependentColumns: any[] = [];
  propertyColumns: any[] = [];
  enterpriseNature: any[] = [];
  provincejson: any;
  cityjson: any;
  tempLocation: any = '';
  countyjson: any;
  isShowPCCname: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    private app: App,
    private PopoverCtrl: PopoverController,
    private ref: ChangeDetectorRef,
    public imageViewerCtrl: ImageViewerController,
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getRegion();
      this.getCompanyProperty(val);
    });
    this.FBAuditViewModel = navParams.data.itemData;
    this.FBAuditViewModel.eTaxIdeNumber = navParams.data.itemData.eTaxIdeNumber;
    this._imageViewerCtrl = imageViewerCtrl;

  }
  ionViewWillEnter() {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
  }
  ionViewDidEnter() {
    this.tempLocation = this.navParams.data.itemData.pccname;
    if (this.navParams.data.itemData.enterpriseNatureName != '无') {
      this.FBAuditViewModel.enterpriseNatureName = this.navParams.data.itemData.enterpriseNatureName;
      this.FBAuditViewModel.enterpriseNatureId = this.navParams.data.itemData.enterpriseNatureId;
    }
    if (this.navParams.data.itemData.pccname != '无') {
      this.FBAuditViewModel.pccname = this.navParams.data.itemData.pccname;
    } else {
      this.FBAuditViewModel.pccname = ''
    }
    if (this.navParams.data.itemData.eTaxIdeNumber == '无') {
      this.FBAuditViewModel.eTaxIdeNumber = ''
    }
    if (this.navParams.data.itemData.salesmanName_OA == '无') {
      this.tempsalesmanName = this.navParams.data.itemData.salesmanCode;
      if (this.tempsalesmanName != '' && this.tempsalesmanName != '无') {
        this.isShowSalesmanName = true;
      }
      this.FBAuditViewModel.salesmanName_OA = '';
      this.FBAuditViewModel.userIdErp = '';
      this.FBAuditViewModel.salesmanCode = '';
      this.FBAuditViewModel.eACode_ERP = '';
    }
    if (this.navParams.data.itemData.address == '无') {
      this.FBAuditViewModel.address = '';
    }
  }
  getCompanyProperty(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getDataCompanyProperty, u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.enterpriseNature = rs.objectData;
          if (this.navParams.data.itemData.enterpriseNatureName == '无') {
            this.FBAuditViewModel.enterpriseNatureId = rs.objectData[0].enterpriseNatureId;
            this.FBAuditViewModel.enterpriseNatureName = rs.objectData[0].enterpriseNatureName;
          }
        }
        // let options: Array<any> = [];
        // for (let i = 0; i < rs.objectData.length; i++) {
        //   let optionsitem = {
        //     text: '',
        //     value: ''
        //   }
        //   optionsitem.text = rs.objectData[i].enterpriseNatureName;
        //   optionsitem.value = rs.objectData[i].enterpriseNatureId;
        //   options.push(optionsitem);
        // }
        // this.propertyColumns = [
        //   {
        //     options: options
        //   }
        // ]
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    });
  }
  noPassAudit() {
    if (this.FBAuditViewModel.eTaxIdeNumber.length < 1) {
      this.FBAuditViewModel.eTaxIdeNumber = '无';
    }
    if (this.FBAuditViewModel.salesmanCode.length < 2) {
      this.FBAuditViewModel.salesmanName_OA = '无';
      this.FBAuditViewModel.userIdErp = '无';
      this.FBAuditViewModel.salesmanCode = '无';
      this.FBAuditViewModel.eACode_ERP = '无';
    }
    if (this.FBAuditViewModel.pccname.length < 1) {
      this.FBAuditViewModel.pccname = '无区域';
    }
    if (this.FBAuditViewModel.address.length < 1) {

      this.FBAuditViewModel.address = '无详细地址';
    }
    console.log(this.FBAuditViewModel)
    this.appConfig.popPromptView('', 'alert-bg-c', '请输入审核不通过的原因，供用户参考', 'reason', '输入审核不通过的原因', re => {
      this.FBAuditViewModel.auditDec = re.reason;
      this.FBAuditViewModel.isAudit = false;
      this.appService.httpPost_token(AppGlobal.API.postFbenterpriseSubmit, this.u_token, this.FBAuditViewModel, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.jpushMesaage('资料审核不通过', re.reason, this.FBAuditViewModel.fbusinessId);
          this.navCtrl.push('AdminauditinfolistPage');
        } else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      }, true)
    })

  }
  showOriginal(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage, {
      enableBackdropDismiss: true
    });
    imageViewer.present();
  }
  passAudit() {
    if (this.FBAuditViewModel.companyName.length < 1) {
      this.appConfig.popAlertView('企业名称不能为空！')
      return
    } else if (this.FBAuditViewModel.clientName.length < 1) {
      this.appConfig.popAlertView('企业联系人姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.mobile.length < 1) {
      this.appConfig.popAlertView('联系电话不能为空！')
      return
    } else if (!AppStaticConfig.verifyMobile(this.FBAuditViewModel.mobile)) {
      this.appConfig.popAlertView('联系电话格式不正确！')
      return
    } else if (this.FBAuditViewModel.eTaxIdeNumber.length < 1) {
      this.appConfig.popAlertView('企业识别号不能为空！')
      return
    } else if (this.FBAuditViewModel.salesmanCode.length < 2) {
      this.appConfig.popAlertView('业务员姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.expiredDatet == '') {
      this.appConfig.popAlertView('资质过期日期不能为空！')
      return
    } else if (this.FBAuditViewModel.pccname.length < 2) {
      this.appConfig.popAlertView('企业所在省市区不能为空！')
      return
    } else if (this.FBAuditViewModel.address.length < 1) {
      this.appConfig.popAlertView('企业详细地址不能为空！')
      return
    } else {
      this.FBAuditViewModel.auditDec = ' 无';
      this.FBAuditViewModel.isAudit = true;
      //this.FBAuditViewModel.eTaxIdeNumber = this.eTaxIdeNumber;
      console.log(this.FBAuditViewModel)
      this.appService.httpPost_token(AppGlobal.API.postFbenterpriseSubmit, this.u_token, this.FBAuditViewModel, rs => {
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.jpushMesaage('资料审核通过', '您提交的资料信息已经通过审核', this.FBAuditViewModel.fbusinessId);
          this.navCtrl.push('AdminauditinfolistPage');
        } else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      }, true)
    }
  }
  getRegion() {
    this.appService.getRegionContact()
      .subscribe(rs => {
        this.region = rs.json();
        let provinceData = this.region.filter(function (e) { return e.IsSingleCity == '1'; });
        let cityData = this.region.filter(function (e) { return e.IsSingleCity == '2'; });
        let countyData = this.region.filter(function (e) { return e.IsSingleCity == '3'; });
        //省份
        this.provincejson = {
          options: AppStaticConfig.addRegionData(provinceData)
        }
        this.dependentColumns.push(this.provincejson);
        //城市
        this.cityjson = {
          options: AppStaticConfig.addRegionData(cityData)
        }
        this.dependentColumns.push(this.cityjson);
        //区县
        this.countyjson = {
          options: AppStaticConfig.addRegionData(countyData)
        }
        this.dependentColumns.push(this.countyjson);
        this.ref.detectChanges();
      }, error => {
        console.log(error);
      });
  }
  saveCompanyInfo() {
    if (this.FBAuditViewModel.companyName == "") {
      this.appConfig.popAlertView('企业名称不能为空！')
      return
    } else if (this.FBAuditViewModel.clientName == "") {
      this.appConfig.popAlertView('企业联系人姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.mobile == "") {
      this.appConfig.popAlertView('联系电话不能为空！')
      return
    } else if (!AppStaticConfig.verifyMobile(this.FBAuditViewModel.mobile)) {
      this.appConfig.popAlertView('联系电话格式不正确！')
      return
    } else if (this.FBAuditViewModel.eTaxIdeNumber == "") {
      this.appConfig.popAlertView('企业识别号不能为空！')
      return
    } else if (this.FBAuditViewModel.salesmanCode == "") {
      this.appConfig.popAlertView('业务员姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.expiredDatet == '') {
      this.appConfig.popAlertView('资质过期日期不能为空！')
      return
    } else if (this.FBAuditViewModel.pccname.length < 2) {
      this.appConfig.popAlertView('企业所在省市区不能为空！')
      return
    } else if (this.FBAuditViewModel.address.length < 1) {
      this.appConfig.popAlertView('企业详细地址不能为空！')
      return
    } else {
      this.FBAuditViewModel.auditDec = ' 无';
      this.FBAuditViewModel.isAudit = true;
      //this.FBAuditViewModel.eTaxIdeNumber = this.eTaxIdeNumber;
      console.log(this.FBAuditViewModel)
      // this.appService.httpPost_token(AppGlobal.API.postCompanyDataSaveSubmit, this.u_token, this.FBAuditViewModel, rs => {
      //   if (rs.status == 401 || rs.status == 403) {
      //     this.app.getRootNav().setRoot('AdminloginPage');
      //   }
      //   if (rs.isSuccess) {
      //     this.navCtrl.push('AdminauditinfolistPage');
      //   } else {
      //     this.appConfig.popAlertView(rs.errorMessage);
      //   }
      // }, true)
    }
  }
  selectSalesman() {
    this.appConfig.popPromptViewA('', 'alert-bg-d', '业务员查询', 'salesman', '请输入业务员的姓名进行查询', rs => {
      if (rs.salesman.length <= 0) {
        this.appConfig.popAlertView('请输入你要查询的业务员姓名');
        return;
      } else {
        this.getSaleManInfo(rs.salesman);
      }
    });
  }
  getSaleManInfo(psnname) {
    this.appService.httpPost_token(AppGlobal.API.getSaleManInfo, this.u_token, { psnname: psnname }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData != null) {
          if (rs.objectData.length > 0) {
            this.appConfig.popRadioView('选择业务员', 'alert-bg-e', rs.objectData, rs => {
              let salesmaninfo = rs.split(",");
              this.FBAuditViewModel.salesmanCode = salesmaninfo[0];
              this.FBAuditViewModel.salesmanName_OA = salesmaninfo[1];
              this.FBAuditViewModel.userIdErp = salesmaninfo[2];
              this.FBAuditViewModel.eACode_ERP = salesmaninfo[3];
            });
          } else {
            this.appConfig.popAlertView(rs.errorMessage);
          }
        }
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    }, true)
  }
  jpushMesaage(alertTitle: any, alertInfo: any, fbusinessId: any) {
    let MsgViewModel: any = {
      AlertTitle: alertTitle,
      AlertInfo: alertInfo,
      SendTitle: alertTitle,
      SendContent: alertInfo,
      MsgMark: alertInfo,
      TargetAccountId: 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9',
      MsgTypeId: 2,//1、群发，2端对端
      ExtrasData: fbusinessId,//根据首营id获取AccountId
      ExtrasType: '0',//0、是资料审核，1、订单
      Audience: 'APP设备标识',
      MsgId: 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9'
    }
    // MsgViewModel.AlertTitle = alertTitle;
    // MsgViewModel.AlertInfo = alertInfo;
    // MsgViewModel.SendTitle = alertTitle;
    // MsgViewModel.SendContent = alertInfo;
    this.appService.httpPost_token(AppGlobal.API.postCustomerMsgjpush, this.u_token, { msg: MsgViewModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        //this.navCtrl.push('AdminhomePage');
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    })
  }
  jpushMesaagepost() {
    this.jpushMesaage('这是测试标题', '这是测试内容', '0a9958db-3779-44ed-b8dd-3fbedaec4956');
  }
  selectNature() {
    console.log(this.enterpriseNature)
    this.appConfig.popRadioOnlyView('选择企业性质', 'alert-bg-e', this.enterpriseNature, rs => {
      let enterpriseNature = rs.split(",");
      this.FBAuditViewModel.enterpriseNatureId = enterpriseNature[0];
      this.FBAuditViewModel.enterpriseNatureName = enterpriseNature[1];
    });
  }
  selectLocation() {
    let popover = this.PopoverCtrl.create('PartLocationOptPage', { page: 'AdminauditinfodetailPage' }, {
      cssClass: 'locationstyle',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
    popover.present({ animate: false, duration: 0, progressAnimation: false });
    popover.onDidDismiss((data) => {
      if (data != undefined) {
        console.log(data)
        this.FBAuditViewModel.pccname = data.pccName;
        this.FBAuditViewModel.ProvinceID = data.ProvinceID;
        this.FBAuditViewModel.CityID = data.CityId;
        this.FBAuditViewModel.CountyID = data.CountyId;
        this.FBAuditViewModel.provinceId = data.ProvinceID;
        this.FBAuditViewModel.cityId = data.CityId;
        this.FBAuditViewModel.countyId = data.CountyId;

      }
    });
  }
}
