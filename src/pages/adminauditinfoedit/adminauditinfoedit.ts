import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AppService, AppGlobal } from './../../app/app.service';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { Storage } from '@ionic/storage';

/**
管理端：资料查看
 */

@IonicPage()
@Component({
  selector: 'page-adminauditinfoedit',
  templateUrl: 'adminauditinfoedit.html',
})
export class AdminauditinfoeditPage {
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
    eACode_ERP:'',
    location:''
  }
  eTaxIdeNumber: any;
  ExpiredDate: any;
  isViewPage: any = false;
  pageParmasData: any;
  dependentColumns: any[] = [];
  propertyColumns: any[] = [];
  provincejson: any;
  cityjson: any;
  tempLocation: any = '';
  countyjson: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public appConfig: AppConfig,
    private storageCtrl: Storage,
    private app: App,
    private ref: ChangeDetectorRef,
    public imageViewerCtrl: ImageViewerController,
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
    console.log(navParams.data.itemData)
    this.FBAuditViewModel = navParams.data.itemData;
    this.eTaxIdeNumber = navParams.data.itemData.eTaxIdeNumber;
    this._imageViewerCtrl = imageViewerCtrl;
    this.getRegion();
    this.getCompanyProperty();
  }
  ionViewDidEnter() {
    let text = document.getElementsByClassName("multi-picker-placeholder");
    this.tempLocation = this.navParams.data.itemData.pccname;
    if (this.navParams.data.itemData.enterpriseNatureName != '无') {
      text[0].textContent = this.navParams.data.itemData.enterpriseNatureName;
      text[0].setAttribute('style','color:#222');
      this.FBAuditViewModel.location = this.navParams.data.itemData.pccname;
    }
    if (this.navParams.data.itemData.salesmanName_OA == '无') {
      this.FBAuditViewModel.salesmanName_OA = '';
      this.FBAuditViewModel.userIdErp = '';
      this.FBAuditViewModel.salesmanCode = '';
      this.FBAuditViewModel.eACode_ERP = '';
    }
    if (this.navParams.data.itemData.pccname != '无') {
      text[1].textContent = this.navParams.data.itemData.pccname;
      text[1].setAttribute('style','color:#222');
    }
  }
  getCompanyProperty() {
    this.appService.httpGet_token(AppGlobal.API.getDataCompanyProperty, this.u_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        let options: Array<any> = [];
        for (let i = 0; i < rs.objectData.length; i++) {
          let optionsitem = {
            text: '',
            value: ''
          }
          optionsitem.text = rs.objectData[i].enterpriseNatureName;
          optionsitem.value = rs.objectData[i].enterpriseNatureId;
          options.push(optionsitem);
        }
        this.propertyColumns = [
          {
            options: options
          }
        ]
      } else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    });
  }

  showOriginal(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage, {
      enableBackdropDismiss: true
    });
    imageViewer.present();
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
    console.log(this.FBAuditViewModel);
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
    } else if (this.eTaxIdeNumber == "") {
      this.appConfig.popAlertView('企业识别号不能为空！')
      return
    } else if (this.FBAuditViewModel.salesmanCode == "") {
      this.appConfig.popAlertView('业务员姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.expiredDatet == '') {
      this.appConfig.popAlertView('资质过期日期不能为空！')
      return
    } else if (this.FBAuditViewModel.location == "" || this.FBAuditViewModel.location == undefined) {
      this.appConfig.popAlertView('企业所在省市区不能为空！')
      return
    } else if (this.FBAuditViewModel.address == "" || this.FBAuditViewModel.address == undefined) {
      this.appConfig.popAlertView('企业详细地址不能为空！')
      return
    } else {
      this.FBAuditViewModel.pccname = document.getElementById('PCCname').textContent.trim();
      this.FBAuditViewModel.enterpriseNatureName = document.getElementById('enterpriseNature').textContent.trim();
      let tempLocation: any = this.FBAuditViewModel.location.split(' ');
      this.FBAuditViewModel.ProvinceID = tempLocation[0];
      this.FBAuditViewModel.CityID = tempLocation[1];
      this.FBAuditViewModel.CountyID = tempLocation[2];
      this.FBAuditViewModel.auditDec = ' 无';
      this.FBAuditViewModel.isAudit = true;
      this.FBAuditViewModel.eTaxIdeNumber = this.eTaxIdeNumber;
      this.appService.httpPost_token(AppGlobal.API.postCompanyDataSaveSubmit, this.u_token, this.FBAuditViewModel, rs => {
        console.log(rs)
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.navCtrl.push('AdminauditinfolistPage');
        } else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      }, true)
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
            this.appConfig.popRadioView('选择业务员', 'alert-bg-e', rs.objectData, re => {
              let salesmaninfo = re.split(",");
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
}
