import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';

/**
管理端：商品编辑-增加商品参数界面   
 */

@IonicPage()
@Component({
  selector: 'page-admin-part-parmas',
  templateUrl: 'admin-part-parmas.html',
})
export class AdminPartParmasPage {
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  _classId: any;
  partPageModel: any = {
    CommSpecName: '',
    ApprovedNumName: '',
    EnterprisesName: '',
    Address: '',
  }
  CommUPC: any = '';//商品条码
  CommPackaging: any = '';//商品包装规格
  ProductSpecViewModel: any = { //规格model
    CommSpecId: '',
    CommSpecName: '',
    CommSpecDec: '无',
    CommSpecIsEffective: true,
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
    IsEffective: true,
  }
  ProductApprovedNumViewModel: any = { //批准文号model
    ApprovedNumId: '',
    ApprovedNumName: '',
    ApprovedNumDec: '无',
    ApprovedNumTypeId: '1',
    Eaid: ''
  }
  ProductParamModelViewModel: any = {
    ApprovedNumData: '',
    CommSpecData: '',
    EnterprisesData: '',
    CommUPC: '',//商品条码
    CommPackaging: '',//商品包装规格
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private appConfigCtrl: AppConfig
  ) {
    this._classId = this.navParams.data.classId;
  }

  confirmAdd() {
    if (this.ProductParamModelViewModel.CommPackaging.length < 1 || this.ProductParamModelViewModel.CommUPC.length < 1 || this.partPageModel.CommSpecName.length < 1 || this.partPageModel.ApprovedNumName.length < 1 || this.partPageModel.EnterprisesName.length < 1 || this.partPageModel.Address.length < 1) {
      this.appConfigCtrl.popAlertView('请填写完整的参数，再提交！');
    } else {
      /* 规格赋值*/
      this.ProductSpecViewModel.CommSpecId = this._guid;
      this.ProductSpecViewModel.CommSpecName = this.partPageModel.CommSpecName;
      this.ProductSpecViewModel.ClassId = this._classId;
      this.ProductSpecViewModel.Eaid = this._guid;
      /* 批准文号赋值*/
      this.ProductApprovedNumViewModel.ApprovedNumId = this._guid;
      this.ProductApprovedNumViewModel.ApprovedNumName = this.partPageModel.ApprovedNumName;
      this.ProductApprovedNumViewModel.Eaid = this._guid;
      /* 生产企业及生产地址赋值*/
      this.ProductEnterprisesViewModel.EnterprisesId = this._guid;
      this.ProductEnterprisesViewModel.EnterprisesName = this.partPageModel.EnterprisesName;
      this.ProductEnterprisesViewModel.Address = this.partPageModel.Address;
      this.ProductEnterprisesViewModel.Eaid = this._guid;
      /* 提交参数model赋值*/
      this.ProductParamModelViewModel.ApprovedNumData = this.ProductApprovedNumViewModel;
      this.ProductParamModelViewModel.CommSpecData = this.ProductSpecViewModel;
      this.ProductParamModelViewModel.EnterprisesData = this.ProductEnterprisesViewModel;
      this.viewCtrl.dismiss(this.ProductParamModelViewModel, 'AdmingoodsparmasPage', {
        animate: false
      });
    }
  }
  closePop() {
    this.viewCtrl.dismiss();
  }
}
