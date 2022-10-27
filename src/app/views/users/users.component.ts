import { Component, OnInit } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/services/user/user';

const USERS: User[] = [
  {
    name: 'Juan Marcos',
    age: 27,
    email: 'admin@vallejo-clinic.utn',
    role: 'admin',
    surname: 'Vallejo',
    nationalIdentification: '38589601'
  }
];

function search(text: string, pipe: PipeTransform): User[] {
  return USERS.filter((user) => {
    const term = text.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      pipe.transform(user.surname).includes(term) ||
      pipe.transform(user.email).includes(term)
    );
  });
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filter = new FormControl('', { nonNullable: true });
  
  constructor(pipe: DecimalPipe) {
    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => search(text, pipe)),
    );
  }

  ngOnInit(): void {
  }

}
