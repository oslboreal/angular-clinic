import { Component, OnInit, TemplateRef } from '@angular/core';

import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Historia } from 'src/app/shared/interfaces/historia';
import { DialogService,DialogEventType } from 'src/app/shared/services/dialog/dialog.service';
import { User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AltaHistoriaComponent } from '../components/alta-historia/alta-historia.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  
  items!: Historia[];
  users$: Observable<User[]>;
  filter = new FormControl('', { nonNullable: true });

  constructor(private dialogService: DialogService, private userService: UserService ) {

    this.users$ = userService.getUsers();
    this.userService.getHistorial()
    .subscribe(res =>{
      console.log(res);
      this.items = res;
    });
   }

  ngOnInit(): void {

  }

  showLoginForm(content: TemplateRef<AltaHistoriaComponent>) {
    this.dialogService.setDialog(DialogEventType.open, content);
  }


}
