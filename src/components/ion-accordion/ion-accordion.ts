import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';

/**
 * Generated class for the IonAccordionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-accordion',
  templateUrl: 'ion-accordion.html'
})
export class IonAccordionComponent {
  @Input() headerColor: string = '#fff';
  @Input() textColor: string = '#000';
  @Input() contentColor: string = '#F9F9F9';
  @Input() title: string;
  @Input() hasMargin: boolean = true;
  @Input() expanded: boolean=false;
  @ViewChild('accordionContent') elementView: ElementRef;
  viewHeight: number;
  constructor(public renderer: Renderer) { }
  ngAfterViewInit() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;
    if (!this.expanded) {
      this.renderer.setElementStyle(this.elementView.nativeElement, 'height', 0 + 'px');
    }
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
    const newHeight = this.expanded ? '100%' : '0px';
    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', newHeight);
  }
}
