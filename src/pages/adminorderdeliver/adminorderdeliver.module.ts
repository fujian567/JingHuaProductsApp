import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminorderdeliverPage } from './adminorderdeliver';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    AdminorderdeliverPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AdminorderdeliverPage),
  ],
})
export class AdminorderdeliverPageModule {}
