import { Component, OnInit, ViewChild, TemplateRef, Output, Input, EventEmitter } from '@angular/core';
import { DialogEventType, DialogService } from '../../dialog.service';

@Component({
  selector: 'app-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.scss']
})
export class DialogTemplateComponent implements OnInit {

  @Output() @ViewChild('content') public templateref: TemplateRef<unknown> | undefined = undefined;
  @Output() public okPressed: EventEmitter<boolean> = new EventEmitter();
  @Input() title: string = '';
  @Input() isOkButtonEnabled: Boolean = false;

  constructor(private dialogService: DialogService) {
  }

  onCrossMarkPressed() {
    this.dialogService.setDialog(DialogEventType.crossClick);
  }

  onCancelButtonPressed() {
    this.dialogService.setDialog(DialogEventType.cancel);
  }

  onOkButtonPressed() {
    this.okPressed.emit(true);
    // this.dialogService.setDialog(DialogEventType.ok);
  }

  ngOnInit(): void {
  }

}
