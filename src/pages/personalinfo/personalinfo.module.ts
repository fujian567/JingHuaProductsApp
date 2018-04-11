import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalinfoPage } from './personalinfo';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    PersonalinfoPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(PersonalinfoPage),
  ],
})
export class PersonalinfoPageModule {}
