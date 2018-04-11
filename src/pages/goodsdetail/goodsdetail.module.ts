import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsdetailPage } from './goodsdetail';
import { Ionic2RatingModule } from "ionic2-rating";
@NgModule({
  declarations: [
    GoodsdetailPage,
  ],
  imports: [
    Ionic2RatingModule,
    IonicPageModule.forChild(GoodsdetailPage),
  ],
})
export class GoodsdetailPageModule {}
