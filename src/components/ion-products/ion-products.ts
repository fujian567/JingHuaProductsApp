import { Component,Input } from '@angular/core';
import {NavController } from 'ionic-angular';
import { AppGlobal } from './../../app/app.service';
/**
 * Generated class for the IonProductsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-products',
  templateUrl: 'ion-products.html'
})
export class IonProductsComponent {
  @Input() products: Array<any>;
  _servePath: any = AppGlobal.domainimage;
  constructor(public navCtrl: NavController) {
  }
  goDetails(item) {
    //console.log(item)
    this.navCtrl.push('GoodsdetailPage', { item: item });
  }
}
