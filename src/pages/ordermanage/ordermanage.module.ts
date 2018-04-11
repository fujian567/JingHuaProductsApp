import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdermanagePage } from './ordermanage';

@NgModule({
  declarations: [
    OrdermanagePage,
  ],
  imports: [
    IonicPageModule.forChild(OrdermanagePage),
  ],
})
export class OrdermanagePageModule {}
