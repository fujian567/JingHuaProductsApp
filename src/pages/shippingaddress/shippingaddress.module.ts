import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShippingaddressPage } from './shippingaddress';

@NgModule({
  declarations: [
    ShippingaddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ShippingaddressPage),
  ],
})
export class ShippingaddressPageModule {}
