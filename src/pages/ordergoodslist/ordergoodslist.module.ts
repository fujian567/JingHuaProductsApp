import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdergoodslistPage } from './ordergoodslist';

@NgModule({
  declarations: [
    OrdergoodslistPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdergoodslistPage),
  ],
})
export class OrdergoodslistPageModule {}
