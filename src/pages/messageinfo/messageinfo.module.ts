import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageinfoPage } from './messageinfo';

@NgModule({
  declarations: [
    MessageinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageinfoPage),
  ],
})
export class MessageinfoPageModule {}
