import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
客户端：资料审核状态界面
 */

@IonicPage()
@Component({
  selector: 'page-infoaudit',
  templateUrl: 'infoaudit.html',
})
export class InfoauditPage {
  pageConfig: any = {
    isAuto: true,
    pagedata:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.data.auditStatus)
    this.pageConfig.pagedata=navParams.data;
    this.pageConfig.isAuto = navParams.data.auditStatus;
  }

  reRubmit(){
    let pagedata=this.pageConfig.pagedata
    this.navCtrl.setRoot('AccpuntinformationPage',{
      status:'reRubmit',
      pagedata
    });
  }
}
