import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminauditinfodetailPage } from './adminauditinfodetail';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    AdminauditinfodetailPage,
  ],
  imports: [
    IonicImageViewerModule,
    MultiPickerModule,
    IonicPageModule.forChild(AdminauditinfodetailPage),
  ],
})
export class AdminauditinfodetailPageModule {}
