import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：商品管理内嵌选择分类页面 
 */

@IonicPage()
@Component({
  selector: 'page-admin-part-category',
  templateUrl: 'admin-part-category.html',
})
export class AdminPartCategoryPage {
  u_token: any;
  goodsCategory: Array<string>;
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
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public appService: AppService,
    private storageCtrl: Storage,
  ) {
    this.goodsCategory = this.navParams.get('goodsCategory');
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
    });
  }

  selectCategory(goodsCategoryName: string) {
    this.viewCtrl.dismiss(goodsCategoryName, 'AdmingoodseditPage', {
      animate: false
    });
  }
  closePop() {
    this.viewCtrl.dismiss('', '', {
      animate: false
    });
  }
  addCategory() {
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
  newGuid() {
    let guid = "";
    for (let i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    return guid;
  }
  saveCategory(data: any) {
    let _data: any = data.categoryname.replace(/\s/gi, '');
    if (_data != "") {
      this.ProductClassViewModel.ClassId = this.newGuid();
      this.ProductClassViewModel.EAId = this.newGuid();
      this.ProductClassViewModel.ClassName = _data;
      this.submitData()
    }
  }
  submitData() {
    this.appService.httpPost_token(AppGlobal.API.postGoodsClassSubimt, this.u_token, this.ProductClassViewModel, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.navCtrl.setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        this.getCategoryData(this.u_token);
      }
    }, true);
  }
  getCategoryData(u_token) {
    this.appService.httpGet_token(AppGlobal.API.getGoodsClassInfo, u_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.navCtrl.setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.length > 0) {
          this.goodsCategory = rs.objectData
        }
      }
    })
  }
}
