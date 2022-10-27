import { Component, OnInit, TemplateRef, ContentChild, Directive } from '@angular/core';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { DialogEventType, DialogService } from '../../services/dialog/dialog.service';
import { LoginComponent } from 'src/app/views/login/login.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  nurseIcon = faUserNurse;
  nurseIconSize: SizeProp = "3x";

  /* Sign up variables */
  isSignUpOkButtonEnabled = false;

  constructor(private dialogService: DialogService, private router : Router) {
    this.dialogService.actionTaken.subscribe((result) => {
      if (result == DialogEventType.cancel || result == DialogEventType.crossClick || result == DialogEventType.close) {
        this.isSignUpOkButtonEnabled = false;
      }
    })
  }

  redirectToSignUp(){
    this.router.navigateByUrl('/signup');
  }
  
  redirectToHome(){
    this.router.navigateByUrl('/home');
  }

  onSignUpFormChange($event: boolean) {
    this.isSignUpOkButtonEnabled = $event;
    console.log('Form valid? ' + $event);
  }

  showLoginForm(content: TemplateRef<LoginComponent>) {
    this.dialogService.setDialog(DialogEventType.open, content);
  }

  ngOnInit(): void {
  }

}
