import { Component, OnInit } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filter = new FormControl('', { nonNullable: true });

  constructor(pipe: DecimalPipe, private userService: UserService) {
    this.users$ = userService.getUsers();
  }

  ngOnInit(): void {
  }

}
