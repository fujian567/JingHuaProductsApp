import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalcenterPage } from './personalcenter';

@NgModule({
  declarations: [
    PersonalcenterPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalcenterPage),
  ],
})
export class PersonalcenterPageModule {}
