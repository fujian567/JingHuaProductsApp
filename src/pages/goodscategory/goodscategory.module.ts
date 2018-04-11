import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodscategoryPage } from './goodscategory';
import { ComponentsModule } from './../../components/components.module';
@NgModule({
  declarations: [
    GoodscategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(GoodscategoryPage),ComponentsModule
  ],
})
export class GoodscategoryPageModule {}
