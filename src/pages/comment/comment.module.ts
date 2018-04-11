import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentPage } from './comment';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    CommentPage,
  ],
  imports: [
    Ionic2RatingModule,
    IonicPageModule.forChild(CommentPage),
  ],
})
export class CommentPageModule {}
