import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminauditinfoeditPage } from './adminauditinfoedit';
import { MultiPickerModule } from 'ion-multi-picker';
import { IonicImageViewerModule } from 'ionic-img-viewer';
@NgModule({
  declarations: [
    AdminauditinfoeditPage,
  ],
  imports: [
    MultiPickerModule,
    IonicImageViewerModule,
    IonicPageModule.forChild(AdminauditinfoeditPage),
  ],
})
export class AdminauditinfoeditPageModule {}
