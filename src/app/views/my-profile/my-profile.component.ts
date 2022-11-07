import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, from, Observable, of, startWith } from 'rxjs';
import { User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, AfterViewInit {
  userRole$: Observable<string>
  currentUser: Promise<void | User>;

  constructor(private userService: UserService, private spinner: NgxSpinnerService) {
    this.userRole$ = this.userService.roleAs.asObservable();
    this.currentUser = this.userService.getUser(JSON.parse(localStorage.getItem('user') ?? '{}')?.email);
    
    this.spinner.show();
    this.currentUser.finally(() => {
      this.spinner.hide();
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

}
