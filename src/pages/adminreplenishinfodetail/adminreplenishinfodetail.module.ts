import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminreplenishinfodetailPage } from './adminreplenishinfodetail';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    AdminreplenishinfodetailPage,
  ],
  imports: [
    IonicImageViewerModule,
    MultiPickerModule,
    IonicPageModule.forChild(AdminreplenishinfodetailPage),
  ],
})
export class AdminreplenishinfodetailPageModule {}
