import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isModalOpened: boolean = false;
  public actionTaken = new BehaviorSubject<DialogEventType | undefined>(undefined);

  constructor(private modalService: NgbModal) { }

  private setDialogContent(content: any | undefined): void {
    this.modalService.open(content, { windowClass: "app-dialog", ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => this.onModalActionTaken(result),
      (reason) => this.onModalActionTaken(reason),
    );
  }

  private onModalActionTaken(actionTanken: any) {
    this.actionTaken.next(actionTanken);
    this.isModalOpened = false;
    console.log('Modal status changed to: ' + actionTanken);
  }

  public setDialog(event: DialogEventType, content: any = undefined) {
    switch (event) {
      case DialogEventType.open:
        this.setDialogContent(content);
        this.isModalOpened = true;
        break;
      case DialogEventType.ok:
        this.modalService.dismissAll(DialogEventType.ok);
        break;
      case DialogEventType.cancel:
        this.modalService.dismissAll(DialogEventType.cancel);
        break;
      case DialogEventType.close:
        this.modalService.dismissAll(DialogEventType.close);
        break;
      case DialogEventType.crossClick:
        this.modalService.dismissAll(DialogEventType.crossClick);
        break;
    }
  }
}

export enum DialogEventType {
  close,
  open,
  ok,
  cancel,
  crossClick
}