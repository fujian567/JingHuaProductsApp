import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
客户端：多商品订单详情
 */

@IonicPage()
@Component({
  selector: 'page-ordergoodslist',
  templateUrl: 'ordergoodslist.html',
})
export class OrdergoodslistPage {
  pagedatamodle: any = [
    {
      goodsId: '1',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '90',
      goodsImg: './../../assets/imgs/wsbcw.jpg',
      isCheck: false,
    },
    {
      goodsId: '2',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '100',
      goodsImg: './../../assets/imgs/nnzchykl.jpg',
      isCheck: false,
    },
    {
      goodsId: '3',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '110',
      goodsImg: './../../assets/imgs/gbkcp.jpg',
      isCheck: false,
    },
    {
      goodsId: '4',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '120',
      goodsImg: './../../assets/imgs/dchkl.jpg',
      isCheck: false,
    },
    {
      goodsId: '5',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '130',
      goodsImg: './../../assets/imgs/nnxls.jpg',
      isCheck: false,
    },
  ]
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }



}
