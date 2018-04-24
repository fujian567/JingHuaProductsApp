import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsdetailPage } from './goodsdetail';
import { Ionic2RatingModule } from "ionic2-rating";
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
@NgModule({
  declarations: [
    GoodsdetailPage,
  ],
  imports: [
    Ionic2RatingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    IonicPageModule.forChild(GoodsdetailPage),
  ],
})
export class GoodsdetailPageModule {}
