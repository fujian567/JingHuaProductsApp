import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypointPage } from './mypoint';

@NgModule({
  declarations: [
    MypointPage,
  ],
  imports: [
    IonicPageModule.forChild(MypointPage),
  ],
})
export class MypointPageModule {}
