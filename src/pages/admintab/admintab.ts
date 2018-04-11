import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {SQLiteObject} from "@ionic-native/sqlite";
// import { DataProvider } from './../../app/app.sql';
/**
管理端：底部tab界面
 */

@IonicPage()
@Component({
  selector: 'page-admintab',
  templateUrl: 'admintab.html',
})
export class AdmintabPage {
  // tabRoots: Object[];
  // database: SQLiteObject;
  //constructor(private dataProvider: DataProvider) {
    // this.tabRoots = [
    //   {
    //     root: 'AdminhomePage',
    //     tabTitle: '主页',
    //     tabIcon: 'home'
    //   },
    // ];
    // this.database = this.dataProvider.myAppDatabase;
    constructor() {
  }
  ionViewWillEnter(){
    
  }
}
