import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { Storage } from '@ionic/storage';
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
  constructor(
    public navCtrl: NavController,
    private storage: Storage, 
    public app: App,
    public navParams: NavParams) {
    console.log(this.navParams.get("auditStatus"))
    console.log(this.navParams.data.infodata)
    //this.pageConfig.pagedata=navParams.data;
     this.pageConfig.isAuto = this.navParams.data.auditStatus;
     this.pageConfig.infodata = navParams.data.infodata;
  }

  reRubmit(){
    let pagedata=this.pageConfig.pagedata
    this.app.getRootNav().setRoot('AccpuntinformationPage',{
      status:'reRubmit',
      pagedata
    });
    // this.navCtrl.setRoot('AccpuntinformationPage',{
    //   status:'reRubmit',
    //   pagedata
    // });
  }
  jumpLogin(){
    this.storage.clear();
    this.navCtrl.setRoot('LoginPage')
  }
}
