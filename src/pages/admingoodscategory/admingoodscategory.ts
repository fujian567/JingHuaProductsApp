import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { AppStaticConfig } from './../../app/app.config';
/**
管理端：商品分类列表界面
 */

@IonicPage()
@Component({
  selector: 'page-admingoodscategory',
  templateUrl: 'admingoodscategory.html',
})
export class AdmingoodscategoryPage {
  pageTitle: string = '商品分类';
  u_token: any;
  categoryList: any = [];
  isNoCategory: boolean = true;
  ProductClassViewModel: any = {
    ClassId: '',
    ClassName: '',
    ClassParentId: '0',
    ClassDec: '无',
    ClassIsEffective: 'true',
    ClassNameSpell:'wu',
    ClassTypeId:'1',
    EAId:''
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      this.getCategoryData(val);
    });
  }
  getCategoryData(u_token) {
    this.appService.httpGet_token_noparams(AppGlobal.API.getGoodsClassInfo, u_token, rs => {
      console.log(rs)
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length>0) {
          this.isNoCategory = false;
          this.categoryList = rs.objectData
        }
      }
    })
  }
  categoryadd() {
    let prompt = this.alertCtrl.create({
      title: '新建分类',
      cssClass: 'categoryname',
      inputs: [
        {
          name: 'categoryname',
          placeholder: '请输入分类名称'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '保存',
          handler: data => {
            this.saveCategory(data)
          }
        }
      ]
    });
    prompt.present();
  }
  categoryedit() {
    this.navCtrl.push('AdmingoodscategoryeditPage', {
      data:this.categoryList
    })
  }
  saveCategory(data: any) {
    let _data: any = data.categoryname.replace(/\s/gi, '');
    if (_data != "") {
      this.ProductClassViewModel.ClassId=AppStaticConfig.newGuid();
      this.ProductClassViewModel.EAId=AppStaticConfig.newGuid();
      this.ProductClassViewModel.ClassName = _data;
      this.submitData();
    }
  }
  submitData() {
    console.log(this.ProductClassViewModel)
    this.appService.httpPost_token(AppGlobal.API.postGoodsClassSubimt, this.u_token, this.ProductClassViewModel, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.getCategoryData(this.u_token);
      }
    },true)
  }
}

