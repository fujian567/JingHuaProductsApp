import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
管理端：价格管理-选择地区   
 */


@IonicPage()
@Component({
  selector: 'page-admin-part-location',
  templateUrl: 'admin-part-location.html',
})
export class AdminPartLocationPage {
  location: any = [
    {
      area: '东北',
      RegionalClassId: 1,
      provinces: [
        { name: '黑龙江省', itemid: '210000', dischecked: false, checked: false, rclassId: '1' },
        { name: '吉林省', itemid: '220000', dischecked: false, checked: false, rclassId: '1' },
        { name: '辽宁省', itemid: '230000', dischecked: false, checked: false, rclassId: '1' }
      ]
    },
    {
      area: '华东',
      RegionalClassId: 2,
      provinces: [
        { name: '上海市', itemid: '310000', dischecked: false, checked: false, rclassId: '2' },
        { name: '江苏省', itemid: '320000', dischecked: false, checked: false, rclassId: '2' },
        { name: '浙江省', itemid: '330000', dischecked: false, checked: false, rclassId: '2' },
        { name: '安徽省', itemid: '340000', dischecked: false, checked: false, rclassId: '2' },
        { name: '福建省', itemid: '350000', dischecked: false, checked: false, rclassId: '2' },
        { name: '江西省', itemid: '360000', dischecked: false, checked: false, rclassId: '2' },
        { name: '山东省', itemid: '370000', dischecked: false, checked: false, rclassId: '2' },
      ]
    },
    {
      area: '华北',
      RegionalClassId: 3,
      provinces: [
        { name: '北京市', itemid: '110000', dischecked: false, checked: false, rclassId: '3' },
        { name: '天津市', itemid: '120000', dischecked: false, checked: false, rclassId: '3' },
        { name: '山西省', itemid: '140000', dischecked: false, checked: false, rclassId: '3' },
        { name: '河北省', itemid: '130000', dischecked: false, checked: false, rclassId: '3' },
        { name: '内蒙古自治区', itemid: '150000', dischecked: false, checked: false, rclassId: '3' },
      ]
    },
    {
      area: '华中',
      RegionalClassId: 4,
      provinces: [
        { name: '河南省', itemid: '410000', dischecked: false, checked: false, rclassId: '4' },
        { name: '湖北省', itemid: '420000', dischecked: false, checked: false, rclassId: '4' },
        { name: '湖南省', itemid: '430000', dischecked: false, checked: false, rclassId: '4' },
      ]
    },
    {
      area: '华南',
      RegionalClassId: 5,
      provinces: [
        { name: '广东省', itemid: '440000', dischecked: false, checked: false, rclassId: '5' },
        { name: '广西壮族自治区', itemid: '450000', dischecked: false, checked: false, rclassId: '5' },
        { name: '海南省', itemid: '460000', dischecked: false, checked: false, rclassId: '5' },
      ]
    },
    {
      area: '西南',
      RegionalClassId: 6,
      provinces: [
        { name: '重庆', itemid: '500000', dischecked: false, checked: false, rclassId: '6' },
        { name: '四川省', itemid: '510000', dischecked: false, checked: false, rclassId: '6' },
        { name: '贵州省', itemid: '520000', dischecked: false, checked: false, rclassId: '6' },
        { name: '云南省', itemid: '530000', dischecked: false, checked: false, rclassId: '6' },
        { name: '西藏自治区', itemid: '540000', dischecked: false, checked: false, rclassId: '6' },
      ]
    },
    {
      area: '西北',
      RegionalClassId: 7,
      provinces: [
        { name: '陕西省', itemid: '610000', dischecked: false, checked: false, rclassId: '7' },
        { name: '甘肃省', itemid: '620000', dischecked: false, checked: false, rclassId: '7' },
        { name: '宁夏回族自治区', itemid: '640000', dischecked: false, checked: false, rclassId: '7' },
        { name: '青海省', itemid: '630000', dischecked: false, checked: false, rclassId: '7' },
        { name: '新疆维吾尔自治区', itemid: '650000', dischecked: false, checked: false, rclassId: '7' },
      ]
    },
    {
      area: '特别行政区',
      RegionalClassId: 8,
      provinces: [
        { name: '台湾省', itemid: '710000', dischecked: false, checked: false, rclassId: '8' },
        { name: '香港特别行政区', itemid: '810000', dischecked: false, checked: false, rclassId: '8' },
        { name: '澳门特别行政区', itemid: '820000', dischecked: false, checked: false, rclassId: '8' }
      ]
    }
  ]
  pageParmas: any = [];
  alreadyItemID: any = [];
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public navParams: NavParams) {
  }
  ionViewWillEnter() {
    console.log(this.navParams.data.alreadyItemID)
    if(this.navParams.data.alreadyItemID.length>0){
      this.alreadyItemID = this.navParams.data.alreadyItemID;
      for (let i = 0; i < this.navParams.data.alreadyItemID.length; i++) {
        for (let m = 0; m < this.location.length; m++) {
          for(let n = 0; n < this.location[m].provinces.length; n++){
            if (this.navParams.data.alreadyItemID[i] == this.location[m].provinces[n].itemid) {
              this.location[m].provinces[n].dischecked = true;
            }
          }
        }
      }
    }
    if (this.navParams.data.selectLocatioObj.length > 0) {
      this.pageParmas = this.navParams.data.selectLocatioObj;
      for (let i = 0; i < this.navParams.data.selectLocatioObj.length; i++) {
        for (let m = 0; m < this.location.length; m++) {
          for(let n = 0; n < this.location[m].provinces.length; n++){
            if (this.navParams.data.selectLocatioObj[i].itemid == this.location[m].provinces[n].itemid) {
              this.location[m].provinces[n].checked = true;
            }
          }
        }
      }
    }
  }
  cancel() {
    this.viewCtrl.dismiss('', '', {
      animate: false
    });
  }
  unfold(event) {
    let initSelected: any = document.getElementsByClassName('item-group');
    for (let i = 0; i < initSelected.length; i++) {
      initSelected[i].classList.remove("unfold");
    }
    event.currentTarget.classList.add("unfold");
  }
  updateCucumber(name: any, itemid: any, rclassId: any, event: any) {
    if (event.checked) {
      let tempObj = {
        name: '',
        itemid: '',
        rclassId: ''
      }
      tempObj.name = name;
      tempObj.itemid = itemid;
      tempObj.rclassId = rclassId;
      if(this.pageParmas.findIndex((rs) => (rs.itemid == itemid))==-1){
        this.pageParmas.push(tempObj);
      }
    } else {
      this.pageParmas.splice(this.pageParmas.findIndex((rs) => (rs.itemid == itemid)), 1);
    }
  }
  confirmData() {
    if (this.pageParmas.length > 0) {
      this.viewCtrl.dismiss(this.pageParmas, 'AdmingoodpricePage', {
        animate: false
      });
    } else {
      this.viewCtrl.dismiss('', '', {
        animate: false
      });
    }
  }
}
