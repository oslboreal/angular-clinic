import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormArrayName, FormBuilder } from '@angular/forms';

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
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {

  }

  onQuickAccess(role: string, id: string) {
    let defaultEmailDomain = '@vallejo-clinic.utn';
    let email = role;
    email += id + defaultEmailDomain;
    this.loginForm.controls.email.setValue(email);
    this.loginForm.controls.password.setValue('testingUser');
  }
}
