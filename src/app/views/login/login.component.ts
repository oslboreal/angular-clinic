import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormArrayName, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });
  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService, private dialogService: DialogService) {
    this.dialogService.actionTaken.subscribe((action) => this.onModalActionTaken(action))
  }

  ngOnInit(): void {
  }

  onModalActionTaken(action: DialogEventType | undefined) {
    /* Submit action sent */
    if (action == DialogEventType.ok) {
      this.onSubmit();
    }
  }

  onSubmit() {
    let valid = true;
    if (!this.loginForm.controls.email) {
      valid = false;
      this.toastr.error('Invalid email address.');
    }

    if (!this.loginForm.controls.password) {
      valid = false;
      this.toastr.error('Invalid password.');
    }

    let isEmailVerified = true;
    if (!isEmailVerified) {
      valid = false
      this.toastr.error(`The specified user's email was not verified.`);
    }

    if (valid)
    {
      this.userService.loginUser(this.loginForm.controls.email.value ?? '', this.loginForm.controls.password.value ?? '');
    }
  }

  onQuickAccess(role: string, id: string) {
    let defaultEmailDomain = '@vallejo-clinic.utn';
    let email = role;
    email += id + defaultEmailDomain;
    this.loginForm.controls.email.setValue(email);
    this.loginForm.controls.password.setValue('testingUser');
  }
}
