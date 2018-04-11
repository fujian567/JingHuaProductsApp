import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
客户端：主界面底部tab页面
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
@Injectable()
export class TabsPage {
  c_token: any;
  isDataRegion: boolean = false;
  tabRoots: Object[];
  constructor(
    public navCtrl: NavController,
    private storageCtrl: Storage
  ) {
    this.tabRoots = [
      {
        root: 'HomePage',
        tabTitle: '主页',
        tabIcon: 'home2'
      },
      {
        root: 'GoodscategoryPage',
        tabTitle: '分类',
        tabIcon: 'classify'
      },
      {
        root: 'ShoppingcartPage',
        tabTitle: '购物车',
        tabIcon: 'shoppingcart2'
      },
      {
        root: 'PersonalcenterPage',
        tabTitle: '个人中心',
        tabIcon: 'my'
      }
    ];
    this.storageCtrl.get('c_token').then((val) => {
      this.c_token = val;
      //this.getSystemRegional(val);
    });
  }
  getSystemRegional(u_token) {
    // this.appService.httpGet_token(AppGlobal.API.getSystemRegional, u_token, {}, rs => {
    //   if (rs.status === 401 || rs.status === 403) {
    //     this.app.getRootNav().setRoot('LoginPage');
    //   }
    //   if (rs.isSuccess) {
    //     this.storageCtrl.set('Regional', rs.objectData)
    //     this.getRegionData(rs.objectData)
    //   }
    // })
  }
  getRegionData(region: any) {
    // this.sqlite.create({
    //   name: 'jhAppSqlite.db',
    //   location: 'default'
    // }).then((database: SQLiteObject) => {
    //   database.executeSql("select count(*) as regionNum from region", {}).then((data) => {
    //     if (data.rows.item(0).regionNum > 0) {
    //       this.isDataRegion = true;
    //     }
    //   }).catch(e => console.log(e)).then(() => {
    //     console.log(this.isDataRegion)
    //     if (!this.isDataRegion) {
    //       for (let i = 0; i < region.length; i++) {
    //         let insertSql = 'INSERT INTO region VALUES (?,?,?,?)';
    //         database.executeSql(insertSql, [region[i].itemId, region[i].name, region[i].parentId, region[i].IsSingleCity]).
    //           then(() => console.log('插入成功！')).catch(e => console.log(e));
    //       }
    //     }
    //   });
    // })
  }
}
