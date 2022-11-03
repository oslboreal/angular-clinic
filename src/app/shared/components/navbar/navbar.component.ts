import { Component, OnInit, TemplateRef, ContentChild, Directive } from '@angular/core';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { DialogEventType, DialogService } from '../../services/dialog/dialog.service';
import { LoginComponent } from 'src/app/views/login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  nurseIcon = faUserNurse;
  nurseIconSize: SizeProp = "3x";

  isCurrentPath(path: string) {
    return this.router.url == path ? 'btn-light' : 'btn-link';
  }

  public isUserLogged$: Observable<boolean>;
  userRole$ : Observable<string>

  /* Sign up variables */
  isSignUpOkButtonEnabled = false;

  constructor(private dialogService: DialogService, private router: Router, private userService: UserService) {
    this.dialogService.actionTaken.subscribe((result) => {
      if (result == DialogEventType.cancel || result == DialogEventType.crossClick || result == DialogEventType.close) {
        this.isSignUpOkButtonEnabled = false;
      }
    })

    this.isUserLogged$ = this.userService.isLoggedIn.asObservable();
    this.userRole$ = this.userService.roleAs.asObservable();
  }

  isUserAdmin(){
    return this.userService.roleAs.getValue() == 'admin';
  }

  redirectToSignUp() {
    this.router.navigateByUrl('/signup');
  }

  redirectTo(page: string) {
    this.router.navigateByUrl(page);
  }

  redirectToUsers() {
    this.router.navigateByUrl('/users');
  }

  onSignUpFormChange($event: boolean) {
    this.isSignUpOkButtonEnabled = $event;
    console.log('Form valid? ' + $event);
  }

  showLoginForm(content: TemplateRef<LoginComponent>) {
    this.dialogService.setDialog(DialogEventType.open, content);
  }

  logOut() {
    this.userService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/home');
  }

  ngOnInit(): void {
  }

}
