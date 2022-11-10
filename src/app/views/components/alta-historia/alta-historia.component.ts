import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-alta-historia',
  templateUrl: './alta-historia.component.html',
  styleUrls: ['./alta-historia.component.scss']
})
export class AltaHistoriaComponent  {

  modalSubscription: Subscription | undefined = undefined;

  miFormulario: FormGroup = this.fb.group({
    altura: ['', [Validators.required, Validators.minLength(3)]],
    peso: ['', [Validators.required, Validators.minLength(999)]],
    presion: ['', [Validators.required, Validators.minLength(999)]],
    temperatura: ['', [Validators.required, Validators.minLength(999)]],
    extras: this.fb.array([], Validators.required)
  });

  nuevoFavoritoKey : FormControl = this.fb.control('', Validators.required);
  nuevoFavoritoValue : FormControl = this.fb.control('', Validators.required);

  get favoritosArr(){
    return this.miFormulario.get('extras') as FormArray
  }

  constructor( private fb: FormBuilder,
               private dialogService: DialogService, 
               private userService: UserService ) { }
  
  ngOnInit(): void {
    if (!this.dialogService.actionTaken.observed)
      this.modalSubscription = this.dialogService.actionTaken.subscribe(next => this.onModalActionTaken(next))
  }

  onModalActionTaken(action: DialogEventType | undefined) { 
    /* Submit action sent */
    this.onSubmit();
    if (action == DialogEventType.ok && !this.userService.isLoggedIn.getValue()) {
    }
  }

  onSubmit(){
    if( this.miFormulario.invalid ){

      this.miFormulario.markAllAsTouched();
      return;
    }

    this.userService.savePoll(this.miFormulario.value, this.userService.userEmail.value);
  }

  agregarFavorito(){

    //  if( this.nuevoFavorito.invalid ){ return; }

    this.favoritosArr.push( this.fb.control( {key: this.nuevoFavoritoKey.value, value: this.nuevoFavoritoValue.value }, Validators.required ) )

    console.log(this.favoritosArr);
    this.nuevoFavoritoKey.reset();
    this.nuevoFavoritoValue.reset();
  }

  borrar( index: number ){
    console.log(index)
    this.favoritosArr.removeAt(index);
  }
}
