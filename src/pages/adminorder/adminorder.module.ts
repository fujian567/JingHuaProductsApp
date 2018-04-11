import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminorderPage } from './adminorder';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    AdminorderPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AdminorderPage),
  ],
})
export class AdminorderPageModule {}
