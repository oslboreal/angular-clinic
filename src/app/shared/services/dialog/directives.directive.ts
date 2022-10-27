import { Directive, TemplateRef, Renderer2, ElementRef, ComponentRef, ɵRender3ComponentFactory, Injector } from '@angular/core';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { DialogService } from './dialog.service';

@Directive({
  selector: '[appDirectives]'
})
export class DirectivesDirective {

  constructor(public componentRef: TemplateRef<unknown>,
    private renderer: Renderer2,
    private dialogService: DialogService) {
    // var dialog = factory.create(injector)
    // var dialog2 = new DialogTemplateComponent(this.dialogService);
    // dialog2.templateref?.createEmbeddedView(componentRef.elementRef);
    // // renderer.
    // // var dialogParent = renderer.appendChild(parent, templateRef)
    // // var element = renderer.createElement();
    // this.dialogService.OpenModal(componentRef);
    // console.log('directive called');
  }
}
