import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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
  _servePath: any = AppGlobal.domain;
  u_token: any;
  region: any;
  FBAuditViewModel: any = {
    fbusinessId: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    Address: '',
    pccname: '',
    ExpiredDate: '',
    companyName: '',
    clientName: '',
    mobile: '',
    salesmanCode: ' ',
    imagesList: '',
    AuditDec: ' 无',
    IsAudit: true,
    eTaxIdeNumber: '',
    enterpriseNatureName: ''
  }
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
    this.isViewPage = navParams.get("isView");
    if (this.isViewPage != undefined) {
      console.log(this.isViewPage)
      this.ExpiredDate = navParams.data.itemData.expiredDate;
      console.log(navParams.data.itemData)
      this.FBAuditViewModel = navParams.data.itemData;
      this.FBAuditViewModel.ProvinceID = navParams.data.itemData.pccName;
      let getDateYear = new Date(this.ExpiredDate).getFullYear();
      let getDateMonth = new Date(this.ExpiredDate).getMonth();
      let getDateDay = new Date(this.ExpiredDate).getDate();
      let convterDate: any = `${getDateYear}/${getDateMonth + 1}/${getDateDay + 1}`
      convterDate = new Date(convterDate);
      this.FBAuditViewModel.ExpiredDate = convterDate.toISOString()
      this.FBAuditViewModel.Address = navParams.data.itemData.address;
      let text = document.getElementsByClassName("multi-picker-placeholder");
      this.tempLocation = navParams.data.itemData.pccname;
      console.log(navParams.data.itemData.pccname)
      console.log(text.length)
      for (let i = 0; i < text.length; i++) {
        text[i].textContent = navParams.data.itemData.pccname;
      }
    } else {
      console.log(navParams.data.itemData)
      this.FBAuditViewModel = navParams.data.itemData;
      if(navParams.data.itemData.eTaxIdeNumber=='无'){
        this.FBAuditViewModel.eTaxIdeNumber='';
      }
      if(navParams.data.itemData.enterpriseNatureName==''){
        this.FBAuditViewModel.eTaxIdeNumber='';
      }
      this.FBAuditViewModel.Address=navParams.data.itemData.address
      
      //text[1].textContent = navParams.data.itemData.pccName;
      // this.FBAuditViewModel.Address = ''
      // this.FBAuditViewModel.eTaxIdeNumber = '';
      // this.FBAuditViewModel.enterpriseNatureName = '';
    }
    this._imageViewerCtrl = imageViewerCtrl;
    this.getRegion();
    this.getCompanyProperty();
  }
  ionViewDidEnter(){
    let text = document.getElementsByClassName("multi-picker-placeholder");
    let date = document.getElementsByClassName("datetime-text datetime-placeholder")
    this.tempLocation = this.navParams.data.itemData.pccname;
    console.log(this.navParams.data.itemData.pccname)
    console.log(text.length)
    text[0].textContent = this.navParams.data.itemData.enterpriseNatureName;
    text[1].textContent = this.navParams.data.itemData.pccname;
    date[0].textContent = new Date(this.navParams.data.itemData.expiredDate).toLocaleDateString()
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
        this.appConfig.popAlertView('网络错误，请稍后再试！')
      }


    });
  }
  noPassAudit() {
    this.appConfig.popPromptView('', 'alert-bg-c', '请输入审核不通过的原因，供用户参考', 'reason', '输入审核不通过的原因', rs => {
      this.FBAuditViewModel.AuditDec = rs.reason;
      this.FBAuditViewModel.IsAudit = false;
      this.FBAuditViewModel.Address = '无详细地址';
      this.FBAuditViewModel.Pccname = '无区域';
      this.appService.httpPost_token(AppGlobal.API.postFbenterpriseSubmit, this.u_token, this.FBAuditViewModel, rs => {
        console.log(rs)
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('AdminloginPage');
        }
        if (rs.isSuccess) {
          this.navCtrl.push('AdminauditinfolistPage');
        }else {
          this.appConfig.popAlertView(rs.errorMessage);
        }
      },true)
    })
  }
  showOriginal(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage, {
      enableBackdropDismiss: true
    });
    imageViewer.present();
  }
  passAudit() {
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
    } else if (this.FBAuditViewModel.SalesmanCode == "") {
      this.appConfig.popAlertView('业务员姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.ExpiredDatet == '') {
      this.appConfig.popAlertView('资质过期日期不能为空！')
      return
    } else if (this.FBAuditViewModel.provinceId == "" || this.FBAuditViewModel.provinceId == undefined) {
      this.appConfig.popAlertView('企业所在省市区不能为空！')
      return
    } else if (this.FBAuditViewModel.Address == "" || this.FBAuditViewModel.Address == undefined) {
      this.appConfig.popAlertView('企业详细地址不能为空！')
      return
    } else {
      this.FBAuditViewModel.pccname = document.getElementById('PCCname').textContent.trim();
      let tempLocation: any = this.FBAuditViewModel.provinceId.split(' ');
      this.FBAuditViewModel.ProvinceID = tempLocation[0];
      this.FBAuditViewModel.CityID = tempLocation[1];
      this.FBAuditViewModel.CountyID = tempLocation[2];
      this.FBAuditViewModel.AuditDec = ' 无';
      this.FBAuditViewModel.IsAudit = true;
      this.appService.httpPost_token(AppGlobal.API.postFbenterpriseSubmit, this.u_token, this.FBAuditViewModel, rs => {
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
        console.log(this.dependentColumns)
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
    } else if (this.FBAuditViewModel.eTaxIdeNumber == "") {
      this.appConfig.popAlertView('企业识别号不能为空！')
      return
    } else if (this.FBAuditViewModel.enterpriseNatureId == "") {
      this.appConfig.popAlertView('企业性质不能为空！')
      return
    } else if (this.FBAuditViewModel.mobile == "") {
      this.appConfig.popAlertView('联系电话不能为空！')
      return
    } else if (!AppStaticConfig.verifyMobile(this.FBAuditViewModel.mobile)) {
      this.appConfig.popAlertView('联系电话格式不正确！')
      return
    } else if (this.FBAuditViewModel.SalesmanCode == "") {
      this.appConfig.popAlertView('业务员姓名不能为空！')
      return
    } else if (this.FBAuditViewModel.ExpiredDatet == '') {
      this.appConfig.popAlertView('资质过期日期不能为空！')
      return
    } else if (this.FBAuditViewModel.ProvinceID == "" || this.FBAuditViewModel.ProvinceID == undefined) {
      this.appConfig.popAlertView('企业所在省市区不能为空！')
      return
    } else if (this.FBAuditViewModel.Address == "" || this.FBAuditViewModel.Address == undefined) {
      this.appConfig.popAlertView('企业详细地址不能为空！')
      return
    } else {
      this.FBAuditViewModel.pccname = document.getElementById('PCCname').textContent.trim();
      let tempLocation: any = this.FBAuditViewModel.ProvinceID.split(' ');
      this.FBAuditViewModel.ProvinceID = tempLocation[0];
      this.FBAuditViewModel.CityID = tempLocation[1];
      this.FBAuditViewModel.CountyID = tempLocation[2];
      this.FBAuditViewModel.AuditDec = ' 无';
      this.FBAuditViewModel.IsAudit = true;
      console.log(this.FBAuditViewModel)
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
}
