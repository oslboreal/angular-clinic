import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, FormArray, FormArrayName } from '@angular/forms';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FormBuilder } from '@angular/forms';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent implements OnInit, OnDestroy {
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter(true);

  /* Type selection */
  doctorIcon = faUserDoctor;
  userIcon = faUser;
  iconSize: SizeProp = "8x";
  selectedCard: string = '';

  /* Form  */
  userForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    age: [''],
    nationalIdentification: [''],
    healthInsurance: [''],
    email: [''],
    firstImage: [''],
    secondImage: [''],
    password: [''],
    role: [''],
    speciality: [''],
    extraSpecialities: this.formBuilder.array([])
  });

  get extraSpecialities() {
    return this.userForm.get('extraSpecialities') as FormArray;
  }

  constructor(private formBuilder: FormBuilder, private dialogService: DialogService) {
    try {
      this.dialogService.actionTaken.subscribe((action) => this.onModalActionTaken(action))
    } catch (error) {

    }
  }

  onSubmit() {
    console.warn(this.userForm.value);
  }

  addCustomSpecialitySlot() {
    let formArray = this.userForm.get('extraSpecialities') as FormArray
    formArray.push(new FormControl(''))
  }

  ngOnDestroy(): void {
    this.dialogService.actionTaken.unsubscribe();
  }

  onCardSelected(type: string) {
    this.selectedCard = type;
    this.isFormValid.emit(true);
  }

  onModalActionTaken(action: DialogEventType | undefined) {
    /* Submit action sent */
    if (action == DialogEventType.ok) {
      alert('Content saved');
    }
  }

  ngOnInit(): void {
  }
}
