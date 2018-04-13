import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { AppStaticConfig,AppConfig } from './../../app/app.config';
/**
管理端：商品分类编辑界面
 */


@IonicPage()
@Component({
  selector: 'page-admingoodscategoryedit',
  templateUrl: 'admingoodscategoryedit.html',
})
export class AdmingoodscategoryeditPage {
  u_token: any;
  categoryList: any = [];
  isNoCategory: boolean = true;
  subimtType: any = 'addtion';
  ProductClassViewModel: any = {
    ClassId: '',
    ClassName: '',
    ClassParentId: '0',
    ClassDec: '无',
    ClassIsEffective: 'true',
    ClassNameSpell: '',
    ClassTypeId: '1',
    EAId: ''
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public appService: AppService,
    public appConfig:AppConfig,
    private storageCtrl: Storage,
    public app: App,
  ) {
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
          this.isNoCategory = false;
          this.categoryList = rs.objectData
        }
      }
    })
  }
  editTishcategory(item: any) {
    let prompt = this.alertCtrl.create({
      title: '修改分类',
      cssClass: 'categoryname',
      inputs: [
        {
          name: 'categoryname',
          placeholder: '请输入分类名称',
          value: item.className
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
            this.saveCategory(data, item)
          }
        }
      ]
    });
    prompt.present();
  }
  saveCategory(data: any, item: any) {
    let _data: any = data.categoryname.replace(/\s/gi, '');
    if (_data != "") {
      if (item.classId != undefined) {
        this.ProductClassViewModel.ClassId = item.classId;
        this.ProductClassViewModel.EAId = item.eaId;
        this.ProductClassViewModel.ClassParentId = item.classParentId;
        this.ProductClassViewModel.ClassDec = item.classDec;
        this.ProductClassViewModel.ClassIsEffective = item.classIsEffective;
        this.ProductClassViewModel.ClassNameSpell = item.classNameSpell;
        this.ProductClassViewModel.ClassTypeId = item.classTypeId;
        this.subimtType = 'modify';
      }else{
        this.ProductClassViewModel.ClassId = AppStaticConfig.newGuid();
        this.ProductClassViewModel.EAId = AppStaticConfig.newGuid();
        this.subimtType = 'addtion';
      }
      this.ProductClassViewModel.ClassName = _data;
      
      this.submitData(this.subimtType);
    }
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
            this.saveCategory(data, '')
          }
        }
      ]
    });
    prompt.present();
  }
  submitData(type: any) {
    console.log(type)
    console.log(this.ProductClassViewModel)
    let postUrl: any;
    if (type == 'addtion') {
      postUrl = AppGlobal.API.postGoodsClassSubimt;
    } else {
      postUrl = AppGlobal.API.postGoodsClassModify;
    }
    this.appService.httpPost_token(postUrl, this.u_token, this.ProductClassViewModel, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.getCategoryData(this.u_token);
      }else {
        this.appConfig.popAlertView(rs.errorMessage);
      }
    }, true)
  }
}
