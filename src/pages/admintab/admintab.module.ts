import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmintabPage } from './admintab';

@NgModule({
  declarations: [
    AdmintabPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmintabPage),
  ],
})
export class AdmintabPageModule {}
