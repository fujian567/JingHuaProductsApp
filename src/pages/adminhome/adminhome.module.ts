import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminhomePage } from './adminhome';

@NgModule({
  declarations: [
    AdminhomePage,
  ],
  imports: [
    IonicPageModule.forChild(AdminhomePage),
  ],
})
export class AdminhomePageModule {}
