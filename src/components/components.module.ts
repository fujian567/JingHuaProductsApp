import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IonProductsComponent } from './ion-products/ion-products';
import { IonAccordionComponent } from './ion-accordion/ion-accordion';
@NgModule({
	declarations: [IonProductsComponent,
    IonAccordionComponent],
	imports: [
		IonicModule
	],
	exports: [IonProductsComponent,
    IonAccordionComponent]
})
export class ComponentsModule {}
