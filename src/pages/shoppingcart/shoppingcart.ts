import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from '../../app/app.config';
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
  imgUrl: any = AppGlobal.domainimage
  pagedatamodle: any = []
  checkNum: number = 0;
  shoppingcarNum: number = 0;
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

  }
  ionViewDidEnter() {
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      this.getShoppingCartInfo(val)
    });
  }
  goHome() {
    this.navCtrl.push('TabsPage');
    // this.navCtrl.push('TabsPage');
  }
  getShoppingCartInfo(c_token) {
    this.appService.httpGet_token(AppGlobal.API.getShoppingCartAll, c_token, {}, rs => {
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.amountPrice = rs.objectData.totalAmount;
        this.checkNum = 0;
        this.shoppingcarNum = 0;
        if (rs.objectData.scInfoList.length > 0) {
          this.shoppingcarNum = rs.objectData.scInfoList.length;
          this.pagedatamodle = rs.objectData.scInfoList;
          this.checkNum = 0;
          for (let i = 0; i < rs.objectData.scInfoList.length; i++) {
            if (rs.objectData.scInfoList[i].isSelect) {
              this.checkNum += 1;
            }
          }
          if (this.checkNum == this.shoppingcarNum) {
            this.allcheck = true;
          } else {
            this.allcheck = false;
          }
          console.log(this.checkNum)
          console.log(this.shoppingcarNum)
          if (rs.objectData.scInfoList)
            this.isShowShoppingcart = false;
        } else {
          this.isShowShoppingcart = true;
        }
      }
    }, true)
  }
  addNum(item: any, num: number) {
    this.pagedatamodle[num].isSelect = true;
    if (this.pagedatamodle[num].commQuantity > 59999) {
      this.appConfigCtrl.popAlertView('购买商品数量不能大于60000');
    } else {
      this.pagedatamodle[num].commQuantity = this.pagedatamodle[num].commQuantity + 1;
      this.shoppingCartUpdata(item, 1);
      this.amountPrice = this.amountPrice + parseInt(item.medianPrice);
    }

  }
  deductNum(item: any, num: number) {
    if (item.commQuantity > 1) {
      this.pagedatamodle[num].isSelect = true;
      this.pagedatamodle[num].commQuantity = this.pagedatamodle[num].commQuantity - 1;
      this.shoppingCartUpdata(item, -1);
      this.amountPrice = this.amountPrice - parseInt(item.medianPrice);
    }
  }
  inputNum(item: any, num: number) {
    console.log(num);
    console.log(item.commQuantity);
    this.appConfigCtrl.popPromptNumView('修改购买数量', 'addmun', '', 'number', item.commQuantity, rt => {
      if (rt.number > 60000) {
        this.appConfigCtrl.popAlertView('购买商品数量不能大于60000');
      } else if (rt.number < 1) {
        this.appConfigCtrl.popAlertView('购买商品数量不能小于1');
      } else {
        this.shoppingCartUpdata(item, parseInt(rt.number) - item.commQuantity);
      }
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
      if (this.amountPrice != 0) {
        this.navCtrl.push('OrderPage');
      }

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
    this.appConfigCtrl.popAlertConfirmView('你确定要删除该商品吗？删除后不可恢复。', '再考虑下', '残忍删除', () => {
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
        if (rs.status == 401 || rs.status == 403) {
          this.app.getRootNav().setRoot('LoginPage');
        }
        if (rs.isSuccess) {
          this.allcheck = false;
          this.getShoppingCartInfo(this.c_token)
        } else {
          this.appConfigCtrl.popAlertView(rs.errorMessage);
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
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.getShoppingCartInfo(this.c_token)
      }
    })
  }
  shoppingCartToOrder(item: any, IsSelect: any) {
    let subimtModel = {
      SCartId: item.sCartId,
      IsSelect: IsSelect
    }
    this.appService.httpPost_token(AppGlobal.API.postShoppingCartOrder, this.c_token, { sCSelect: subimtModel }, rs => {
      if (rs.status == 401 || rs.status == 403) {
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
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('LoginPage');
      }
      if (rs.isSuccess) {
        this.getShoppingCartInfo(this.c_token)
      }
    },true)
  }
}
