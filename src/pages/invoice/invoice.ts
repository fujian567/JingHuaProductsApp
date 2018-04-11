import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：发票管理
 */

@IonicPage()
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  invoiceType: any = [];
  invoiceHead: any = [{
    headId: '1',
    headName: '个人',
    isDefault: 'danger'
  }, {
    headId: '2',
    headName: '单位',
    isDefault: 'cgrayk'
  }];
  invoiceDetail: any = [{
    detailId: '1',
    detailName: '商品明细',
    isDefault: 'danger'
  }, {
    detailId: '2',
    detailName: '商品类别',
    isDefault: 'cgrayk'
  }];
  invoiceTypeBtn: any = "cgrayk";
  invoiceHeadBtn: any = "cgrayk";
  isShowPersonal: boolean = false;
  isShowCompany: boolean = false;
  pageModel: any = {
    mobile: '',
    email: '',
    Header: '个人',
    company: '',
    EtaxIdeNumber: '',
    invoiceTypeNum: 1,
    invoiceTypeHead: 1,
    invoiceDetail: 1,
    invoiceDetailC: '商品明细',
  }
  PInvoiceInfoViewModel: any = {
    PinvoiceId: this._guid,// 个人发票ID
    PinvoiceHeader: '', /// 抬头
    PinvoiceContent: '',/// 内容
    PinvoiceInfo: '', /// 信息/手机
    PinvoiceEmail: '',/// 电子邮件
    OrderId: this._guid, /// 订单ID
    PinvoiceMark: '无',/// 发票备注
    PinvoiceCreateDate: '2018-04-08' /// 发票建立日期
  }
  EInvoiceInfoViewModel: any = {
    EinvoiceId: this._guid, // 企业发票ID
    EinvoiceHeader: '', /// 抬头
    EinvoiceContent: '',/// 内容
    EinvoiceName: '',//单位名称
    EtaxIdeNumber: '',//纳税人识别号
    EinvoiceInfo: '', /// 信息/手机
    EinvoiceEmail: '',/// 电子邮件
    OrderId: this._guid, /// 订单ID
    PinvoiceMark: '无',/// 发票备注
    EinvoiceCreateDate: '2018-04-08' /// 发票建立日期
  }
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams
  ) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getInvoiceInfoType(val);
      this.getInvoiceInfoN(val);
      this.getInvoiceInfoE(val);
    });
  }
  getInvoiceInfoType(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getInvoiceType, c_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.navCtrl.setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs)
        if (rs.objectData.length > 0) {
          for (let i = 0; i < rs.objectData.length; i++) {
            let tempobj = {
              invoiceTypeId: '',
              distributionInfoId: '',
              invoiceTypeName: '',
              isDefault: 'cgrayk'
            }
            tempobj.invoiceTypeId = rs.objectData[i].invoiceTypeId;
            tempobj.distributionInfoId = rs.objectData[i].distributionInfoId;
            tempobj.invoiceTypeName = rs.objectData[i].invoiceTypeName;
            if (i == 0) {
              tempobj.isDefault = 'danger';
            }
            this.invoiceType.push(tempobj)
          }
        }
      }
    })
  }
  getInvoiceInfoN(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getInvoiceNInfo, c_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.navCtrl.setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs)
      }
    })
  }
  getInvoiceInfoE(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getInvoiceEInfo, c_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        console.log(rs)
      }
    })
  }
  selectdis(item, index) {
    for (let i = 0; i < this.invoiceType.length; i++) {
      this.invoiceType[i].isDefault = 'cgrayk';
    }
    this.invoiceType[index].isDefault = 'danger';
    this.pageModel.invoiceTypeNum = item.invoiceTypeId;
    for (let i = 0; i < this.invoiceHead.length; i++) {
      this.invoiceHead[i].isDefault = 'cgrayk';
    }
    this.invoiceHead[0].isDefault = 'danger';
    switch (item.invoiceTypeId) {
      case 1: {
        this.Invoice();
        break;
      }
      case 2: {
        this.EInvoice();
        break;
      }
      case 3: {
        this.VATInvoice();
        break;
      }
      default: {
        this.isShowPersonal = false;
        this.isShowCompany = false;
        break;
      }
    }
  }
  Invoice() {
    this.isShowPersonal = false;
    this.isShowCompany = false;
  }
  EInvoice() {
    this.isShowPersonal = true;
    this.isShowCompany = false;
  }
  VATInvoice() {
    this.isShowPersonal = false;
    this.isShowCompany = false;
  }
  selecthead(item: any, index) {
    for (let i = 0; i < this.invoiceHead.length; i++) {
      this.invoiceHead[i].isDefault = 'cgrayk';
    }
    this.invoiceHead[index].isDefault = 'danger';
    this.pageModel.invoiceTypeHead = item.headId;
    this.pageModel.Header = item.headName;
    if (item.headId == '2') {
      this.isShowCompany = true;
    } else if (item.headId == '2') {
      this.isShowCompany = false;
    }
  }
  selectdetail(item: any, index) {
    for (let i = 0; i < this.invoiceDetail.length; i++) {
      this.invoiceDetail[i].isDefault = 'cgrayk';
    }
    this.invoiceDetail[index].isDefault = 'danger';
    this.pageModel.invoiceDetail = item.detailId;
    this.pageModel.invoiceDetailC = item.detailName;
  }
  confirm() {
    if (this.pageModel.invoiceTypeHead == 2) {
      if (this.pageModel.company < 2) {
        this.appConfigCtrl.popAlertView('请输入单位名称');
        return;
      }
      if (this.pageModel.EtaxIdeNumber < 3) {
        this.appConfigCtrl.popAlertView('请输入纳税人识别号');
        return;
      }
    }
    if (this.pageModel.invoiceTypeNum == 2) {
      if (this.pageModel.mobile.length < 10) {
        this.appConfigCtrl.popAlertView('请输入收票人的手机号');
        return;
      }
      if (!AppStaticConfig.verifyMobile(this.pageModel.mobile)) {
        this.appConfigCtrl.popAlertView('请输入正确的手机号');
        return;
      }
    }
    if (this.pageModel.invoiceTypeHead == 1) {
      this.PInvoiceInfoViewModel.PinvoiceHeader = this.pageModel.Header;
      this.PInvoiceInfoViewModel.PinvoiceContent = this.pageModel.invoiceDetailC;
      this.EInvoiceInfoViewModel.EinvoiceHeader = '客户选择个人抬头，没有企业抬头';
      this.EInvoiceInfoViewModel.EinvoiceContent = '个人发票没有发票内容';
      this.EInvoiceInfoViewModel.EinvoiceInfo = '个人发票没有企业信息';
      this.EInvoiceInfoViewModel.EinvoiceEmail = '个人发票没有邮箱信息';
      this.EInvoiceInfoViewModel.EinvoiceName = "个人发票没有公司名称"
      this.EInvoiceInfoViewModel.EtaxIdeNumber = "个人发票没有企业识别号"
      if (this.pageModel.mobile.length < 2) {
        this.pageModel.mobile = '普票不需要电话';
      }
      if (this.pageModel.email.length < 2) {
        this.pageModel.email = '普票不需要邮件或者客户未填写';
      }
      this.PInvoiceInfoViewModel.PinvoiceInfo = this.pageModel.mobile;
      this.PInvoiceInfoViewModel.PinvoiceEmail = this.pageModel.email;
    } else {
      this.EInvoiceInfoViewModel.EinvoiceHeader = this.pageModel.Header;
      this.EInvoiceInfoViewModel.EinvoiceContent = this.pageModel.invoiceDetailC;
      this.PInvoiceInfoViewModel.PinvoiceHeader = '客户选择个人抬头，没有企业抬头';
      this.PInvoiceInfoViewModel.PinvoiceContent = '企业发票没有发票内容';
      this.PInvoiceInfoViewModel.EinvoiceInfo = '企业发票没有个人信息';
      this.PInvoiceInfoViewModel.EinvoiceEmail = '企业发票没有个人邮箱信息';
      if (this.pageModel.mobile.length < 2) {
        this.pageModel.mobile = '普票不需要电话';
      }
      if (this.pageModel.email.length < 2) {
        this.pageModel.email = '普票不需要邮件或者客户未填写';
      }
      this.EInvoiceInfoViewModel.EinvoiceInfo = this.pageModel.mobile;
      this.EInvoiceInfoViewModel.EinvoiceEmail = this.pageModel.email;
      if (this.pageModel.company.length < 2) {
        this.pageModel.company = '个人发票不需要单位名称';
      }
      if (this.pageModel.EtaxIdeNumber.length < 2) {
        this.pageModel.EtaxIdeNumber = '个人发票不需要纳税人识别号';
      }
      this.EInvoiceInfoViewModel.EinvoiceName = this.pageModel.company;
      this.EInvoiceInfoViewModel.EtaxIdeNumber = this.pageModel.EtaxIdeNumber;
    }
    // console.log(this.EInvoiceInfoViewModel)
    // console.log(this.PInvoiceInfoViewModel)
    // console.log(this.pageModel.invoiceTypeNum)
    this.navCtrl.setRoot('OrderPage', {
      EInvoiceInfoViewModel: this.EInvoiceInfoViewModel,
      PInvoiceInfoViewModel: this.PInvoiceInfoViewModel,
      InvoiceTypeId: this.pageModel.invoiceTypeNum,
      IsPInvoice: this.pageModel.Header == "个人" ? true : false
    });
  }
}
