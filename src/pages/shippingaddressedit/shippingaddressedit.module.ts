import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShippingaddresseditPage } from './shippingaddressedit';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    ShippingaddresseditPage
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(ShippingaddresseditPage),
  ],
})
export class ShippingaddresseditPageModule {}
