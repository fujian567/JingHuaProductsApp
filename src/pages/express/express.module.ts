import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressPage } from './express';

@NgModule({
  declarations: [
    ExpressPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressPage),
  ],
})
export class ExpressPageModule {}
