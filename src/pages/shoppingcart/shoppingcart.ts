import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig } from '../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
客户端：购物车界面
 */

@IonicPage()
@Component({
  selector: 'page-shoppingcart',
  templateUrl: 'shoppingcart.html',
})
export class ShoppingcartPage {
  c_token: any;
  _guid: any = 'ca3b89d1-9ff5-4998-b6d9-972d7a7e80e9';
  pagedatamodle: any = []
  SCStatisticsInfo: any = {
    TotalAmount: '',// 总计金额
    TotalNumber: '',// 总计数量
    FailureNumber: ''//失效数量
  }
  isShowShoppingcart: boolean = true;
  amountPrice: number = 0;
  allcheck: boolean = false;
  isShowEdit: boolean = false;
  deleteGoodsArray: any = [];
  editBtnTxt = "编辑";
  constructor(
    public navCtrl: NavController,
    private appConfigCtrl: AppConfig,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    public navParams: NavParams) {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getShoppingCartInfo(val)
    });
  }
  goHome() {
    this.navCtrl.setRoot('TabsPage');
  }
  getShoppingCartInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getShoppingCartAll, c_token, {}, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        if (rs.objectData.scInfoList.length > 0) {
          this.pagedatamodle = rs.objectData.scInfoList;
          this.amountPrice = rs.objectData.totalAmount;
          this.isShowShoppingcart = false;
        } else {
          this.isShowShoppingcart = true;
        }
      }
    })
  }
  addNum(item: any, num: number) {
    this.pagedatamodle[num].isSelect = true;
    this.pagedatamodle[num].commQuantity = this.pagedatamodle[num].commQuantity + 1;
    this.shoppingCartUpdata(item, 1);
    this.amountPrice = this.amountPrice + Number(item.medianPrice);
  }
  deductNum(item: any, num: number) {
    if (item.commQuantity > 1) {
      this.pagedatamodle[num].isSelect = true;
      this.pagedatamodle[num].commQuantity = this.pagedatamodle[num].commQuantity - 1;
      this.shoppingCartUpdata(item, -1);
      this.amountPrice = this.amountPrice - Number(item.medianPrice);
    }
  }
  inputNum(item: any, num: number) {
    console.log(num);
    console.log(item.commQuantity);
    this.appConfigCtrl.popPromptNumView('修改购买数量', 'addmun', '', 'number', item.commQuantity, rt => {
      this.shoppingCartUpdata(item, rt.number-item.commQuantity);
    })
  }
  updateCucumber(item: any, num: number, event: any) {
    if (event.checked) {
      if (this.isShowEdit) {
        this.deleteGoodsArray.push(item.sCartId)
        return;
      }
      this.shoppingCartToOrder(item, true);
    } else {
      if (this.isShowEdit) {
        this.deleteGoodsArray.splice(num, 1);
        return;
      }
      this.shoppingCartToOrder(item, false);
    }
  }
  selectCucumber(event: any) {
    if (this.allcheck) {
      this.allcheck = true;
      for (let i = 0; i < this.pagedatamodle.length; i++) {
        this.pagedatamodle[i].isCheck = true;
        if (this.isShowEdit) {
          this.deleteGoodsArray.push(this.pagedatamodle[i].sCartId)
        }
      }
      this.shoppingCartToOrderAll(this.pagedatamodle, true)
    } else {
      this.allcheck = false;
      for (let i = 0; i < this.pagedatamodle.length; i++) {
        this.pagedatamodle[i].isCheck = false;
      }
      this.deleteGoodsArray = []
      this.shoppingCartToOrderAll(this.pagedatamodle, false)
    }
  }
  settlement() {
    if (!this.isShowShoppingcart) {
      this.navCtrl.push('OrderPage');
    }
  }
  editClick() {
    this.isShowEdit = true;
    this.editBtnTxt = "完成";
    this.amountPrice = 0;
    this.allcheck = false;
    for (let i = 0; i < this.pagedatamodle.length; i++) {
      this.pagedatamodle[i].isSelect = false;
    }
  }
  deletegoods() {
    if (this.deleteGoodsArray.length < 1) {
      this.appConfigCtrl.popAlertView('请先选择要删除的商品！');
      return;
    }
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该商品吗？删除后不可恢复。', '我在考虑下', '残忍删除', () => {
      this.isShowEdit = false;
      this.editBtnTxt = "编辑";
      let temparray = [];
      for (let i = 0; i < this.deleteGoodsArray.length; i++) {
        temparray.push(this.deleteGoodsArray[i])
        //this.deleteGoodsArray[i].isSelect = false;
      }
      let delSCData = {
        sCartIdList: temparray
      }
      this.appService.httpPost_token(AppGlobal.API.postShoppingCartDel, this.c_token, { delSCData: delSCData }, rs => {
        if (rs.status === 401 || rs.status === 403) {
          this.app.getRootNav().setRoot('LoginPage');
        }
        if (rs.isSuccess) {
          this.getShoppingCartInfo(this.c_token)
        }
      }, true)
    })
  }
  shoppingCartUpdata(item: any, num: any) {
    let subimtModel = {
      SCartId: item.sCartId,
      DecreaseQuantity: num
    }
    this.appService.httpPost_token_fade(AppGlobal.API.postShoppingCartGoodsNum, this.c_token, { sCQuantity: subimtModel }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.getShoppingCartInfo(this.c_token)
      }
    },true)
  }
  shoppingCartToOrder(item: any, IsSelect: any) {
    let subimtModel = {
      SCartId: item.sCartId,
      IsSelect: IsSelect
    }
    this.appService.httpPost_token(AppGlobal.API.postShoppingCartOrder, this.c_token, { sCSelect: subimtModel }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.getShoppingCartInfo(this.c_token)
      }
    })
  }
  shoppingCartToOrderAll(itemList: any, IsSelect: any) {
    let tempArray = [];
    for (let i = 0; i < itemList.length; i++) {
      let subimtModel = {
        SCartId: itemList[i].sCartId,
        IsSelect: IsSelect
      }
      tempArray.push(subimtModel);
    }
    this.appService.httpPost_token(AppGlobal.API.postShoppingCartOrderAll, this.c_token, { sCSelect: tempArray }, rs => {
      if (rs.status === 401 || rs.status === 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.getShoppingCartInfo(this.c_token)
      }
    })
  }
}
