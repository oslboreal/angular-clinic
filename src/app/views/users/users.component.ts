import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  filter = new FormControl('', { nonNullable: true });
  imageBlob: any;
  adminForm = this.formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(0)]],
    nationalIdentification: ['', Validators.required],
    email: ['', Validators.email],
    role: ['admin'],
    password: ['', Validators.required],
    firstImage: ['', Validators.required],
  });


  constructor(private toastr: ToastrService, private formBuilder: FormBuilder, pipe: DecimalPipe, private userService: UserService, private logger: LoggingService, private dialogService: DialogService) {
    this.users$ = userService.getUsers();
  }

  enableUser(email: string) {
    this.userService.enableUser(email);
  }

  disableUser(email: string) {
    this.userService.disableUser(email);
  }

  onModalActionTaken(action: DialogEventType | undefined) {
    /* Submit action sent */
    if (action == DialogEventType.ok) {
      this.onSubmit();
    }
  }

  onSubmit() {
    console.log(this.adminForm.value);

    if (!this.adminForm.valid) {
      this.toastr.error('You are trying to send invalid data, please refresh the site.');
    } else {
      this.adminForm.controls.role.setValue('admin');
      let user: User = this.adminForm.value as User;
      user.firstImage = this.imageBlob;

      this.userService.createUser(user, false).subscribe(
        () => { },
        () => { this.toastr.error('Error connecting to the data store, please try again.'); },
        () => { this.toastr.success('Admin created successfully...'); }
      )
    }
    this.dialogService.actionTaken.unsubscribe();
  }

  onFileSelected(event: any, imageNumber: number) {
    var n = Date.now();
    const file = event.target.files[0];

    this.imageBlob = file;
  }

  showForm(content: TemplateRef<any>) {
    this.dialogService.setDialog(DialogEventType.open, content);
  }

  ngOnDestroy(): void {
    this.dialogService.actionTaken.unsubscribe();
  }

  ngOnInit(): void {
    this.dialogService.actionTaken.subscribe((action) => this.onModalActionTaken(action))
  }
}
