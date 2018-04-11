import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { Storage } from '@ionic/storage';
import { SQLite } from "@ionic-native/sqlite";
/**
管理端：后台管理主界面
 */

@IonicPage()
@Component({
  selector: 'page-adminhome',
  templateUrl: 'adminhome.html',
})
export class AdminhomePage {
  u_token: any;
  isDataRegion: boolean = false;
  worktab: string = "aduitinfo";
  isAduitInfo: boolean = false;
  isAduitOrder: boolean = false;
  isDeliverGoods: boolean = false;
  noAuditList: any = [
    {
      companyName: '陇西保和堂'
    }, {
      companyName: '陇西保和堂1'
    }
  ]
  pagedatamodle: any = [
    {
      goodsId: '1',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '90',
      goodsImg: './../../assets/imgs/wsbcw.jpg',
      ordernum: '20180326',
      orderstatus: '待审核',
    },
    {
      goodsId: '2',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '100',
      goodsImg: './../../assets/imgs/nnzchykl.jpg',
      ordernum: '20180326',
      orderstatus: '待审核',
    },
    {
      goodsId: '3',
      goodsNum: 1,
      goodsName: '王氏保赤丸',
      goodsSpec: '每120丸重0.3g 每支60丸',
      goodsPrice: '100',
      goodsImg: './../../assets/imgs/nnzchykl.jpg',
      ordernum: '20180326',
      orderstatus: '待审核',
    }
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    private storageCtrl: Storage,
    public app: App,
    private sqlite: SQLite
  ) {
    this.storageCtrl.get('u_token').then((val) => {
      this.u_token = val;
      //this.getSystemRegional(val);
      this.getWorkTabStatus(val);
    });
  }
  getWorkTabStatus(u_token){
    this.appService.httpPost_token(AppGlobal.API.postWorkTabStatus, u_token, { }, rs => {
      console.log(rs)
      if (rs.status == 401 || rs.status == 403) {
        this.app.getRootNav().setRoot('AdminloginPage');
      }
      if (rs.isSuccess) {
        console.log(rs)
      }
    })
  }


  infoaudit() {
    this.navCtrl.push('AdminauditinfolistPage');
  }
  replenish() {
    this.navCtrl.push('AdminreplenishinfolistPage');
  }
  category() {
    this.navCtrl.push('AdmingoodscategoryPage');
  }
  goodsinfo() {
    this.navCtrl.push('AdmingoodslistPage');
  }
  goodspublish() {
    this.navCtrl.push('AdminpublishlistPage');
  }
  goodsprice() {
    this.navCtrl.push('AdmingoodpricelistPage');
  }
  goodsputaway() {
    this.navCtrl.push('AdmingoodputawayPage');
  }
  goodsorder(){
    this.navCtrl.push('AdminorderPage');
  }
  adminpersonal() {
    this.navCtrl.push('AdminpersonalPage');
  }
  auditCompany(itemData: any) {
    this.navCtrl.push('AdminauditinfodetailPage', {
      itemData
    })
  }
  auditOrder(itemData: any) {
    this.navCtrl.push('AdminorderauditPage', {
      itemData
    })
  }
  deliverOrder(itemData: any) {
    this.navCtrl.push('AdminorderdeliverPage', {
      itemData
    })
  }
  auditPage() {
    this.navCtrl.push('AdminauditinfolistPage');
  }
  auditOrderPage(type: any) {
    console.log(type)
    this.navCtrl.push('AdminorderPage', { type: type });
  }
  // getRegionData(region: any) {
  //   this.sqlite.create({
  //     name: 'jhAppSqlite.db',
  //     location: 'default'
  //   }).then((database: SQLiteObject) => {
  //     database.executeSql("select count(*) as regionNum from region", {}).then((data) => {
  //       if (data.rows.item(0).regionNum > 0) {
  //         this.isDataRegion = true;
  //         console.log(data.rows.item(0))
  //       }
  //     }).catch(e => console.log(e)).then(() => {
  //       console.log(this.isDataRegion)
  //       if (!this.isDataRegion) {
  //         for (let i = 0; i < region.length; i++) {
  //           let insertSql = 'INSERT INTO region VALUES (?,?,?,?)';
  //           database.executeSql(insertSql, [region[i].itemId, region[i].name, region[i].parentId, region[i].isSingleCity]).
  //             then(() => console.log('插入成功！')).catch(e => console.log(e));
  //         }
  //       }
  //     });
  //   })
  // }
}
