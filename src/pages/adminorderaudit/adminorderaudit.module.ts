import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminorderauditPage } from './adminorderaudit';
import { IonicImageViewerModule } from 'ionic-img-viewer';


@NgModule({
  declarations: [
    AdminorderauditPage,
  ],
  imports: [
    IonicImageViewerModule,
    IonicPageModule.forChild(AdminorderauditPage),
  ],
})
export class AdminorderauditPageModule {}
