import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderdetailPage } from './orderdetail';

@NgModule({
  declarations: [
    OrderdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderdetailPage),
  ],
})
export class OrderdetailPageModule {}
