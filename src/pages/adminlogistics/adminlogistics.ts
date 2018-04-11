import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig, AppStaticConfig } from './../../app/app.config';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
/**
管理端：查看物流
 */

@IonicPage()
@Component({
  selector: 'page-adminlogistics',
  templateUrl: 'adminlogistics.html',
})
export class AdminlogisticsPage {
  u_token: any;
  logisticsData: any = [
    {date:'04-08',time:'07:46',log:'186****3906-已签收',status:'1'},
    {date:'04-08',time:'07:46',log:'快件派送至快递柜【丰巢】，派件员:杨国胜',status:'0'},
    {date:'04-08',time:'07:46',log:'甘肃兰州七里河区公司-杨国胜-派件中',status:'0'},
    {date:'04-08',time:'07:46',log:'已到达-甘肃兰州七里河区公司',status:'0'},
    {date:'04-08',time:'07:46',log:'甘肃兰州中转部-已发往-甘肃兰州七里河区公司',status:'0'},
    {date:'04-08',time:'07:46',log:'已到达-甘肃兰州中转部',status:'0'},
    {date:'04-08',time:'07:46',log:'福建泉州航空部-已装袋发往-甘肃兰州航空部',status:'0'},
    {date:'04-08',time:'07:46',log:'福建安海公司-已装袋发往-福建泉州航空部',status:'0'},
    {date:'04-08',time:'07:46',log:'福建安海公司-已发往-福建泉州航空部',status:'0'},
    {date:'04-08',time:'07:46',log:'福建安海公司-已进行装袋扫描',status:'0'},
    {date:'04-08',time:'07:46',log:'福建安海公司-已收件',status:'0'},
  ]
  pagedatamodle: any = {
    goodsId: '1',
    goodsNum: 1,
    goodsName: '王氏保赤丸',
    goodsSpec: '每120丸重0.3g 每支60丸',
    approved: '国药准字12345678',
    goodsImg: './../../assets/imgs/wsbcw.jpg',
    ordernum: '20180326',
    orderstatus: '待付款',
    price: '123'
  }
  constructor(
    public navCtrl: NavController, 
    public appService: AppService,
    public appConfig: AppConfig,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminlogisticsPage');
  }

}
