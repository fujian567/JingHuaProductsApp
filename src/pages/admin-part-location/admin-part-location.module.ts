import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPartLocationPage } from './admin-part-location';
import { ComponentsModule } from './../../components/components.module';

@NgModule({
  declarations: [
    AdminPartLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPartLocationPage),ComponentsModule
  ],
})
export class AdminPartLocationPageModule {}
