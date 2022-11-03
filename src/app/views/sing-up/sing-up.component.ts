import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, FormArray, FormArrayName, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FormBuilder } from '@angular/forms';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user/user.service';
import { from } from 'rxjs';
import { User } from 'src/app/shared/services/user/user';

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

  firstImageBlob: any;
  secondImageBlob: any;

  /* Form  */
  userForm = this.formBuilder.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(0)]],
    nationalIdentification: ['', Validators.required],
    healthInsurance: ['', this.requiredFor('patient')],
    email: ['', Validators.email],
    firstImage: ['', Validators.required],
    secondImage: ['', Validators.required],
    password: ['', Validators.required],
    role: [''],
    enabled: [false],
    speciality: ['', this.requiredFor('specialist')],
    extraSpecialities: this.formBuilder.array([])
  });

  get extraSpecialities() {
    return this.userForm.get('extraSpecialities') as FormArray;
  }

  constructor(private formBuilder: FormBuilder, private dialogService: DialogService, private toastr: ToastrService, private userService: UserService) {
    try {
      this.dialogService.actionTaken.subscribe((action) => this.onModalActionTaken(action))
      this.userForm.controls.role.setValue(this.selectedCard);
      this.userForm.valueChanges.subscribe((result) => {
        console.log(this.userForm.controls.firstImage);
      })
    } catch (error) {

    }
  }

  onSubmit() {
    console.log(this.userForm.value);


    if (!this.userForm.valid) {
      this.toastr.error('You are trying to send invalid data, please refresh the site.');
    } else {
      let user: User = this.userForm.value as User;
      user.role = this.selectedCard;
      user.firstImage = this.firstImageBlob;
      user.secondImage = this.secondImageBlob;
      this.userService.createUser(user, true).subscribe(
        () => { },
        () => { this.toastr.error('Error connecting to the data store, please try again.'); },
        () => { this.toastr.success('Signed up successfully, redirecting...'); }
      )
    }
  }

  addCustomSpecialitySlot() {
    let formArray = this.userForm.get('extraSpecialities') as FormArray
    formArray.push(new FormControl(''))
  }

  onFileSelected(event: any, imageNumber: number) {
    var n = Date.now();
    const file = event.target.files[0];

    switch (imageNumber) {
      case 1:
        this.firstImageBlob = file;
        break;
      case 2:
        this.secondImageBlob = file;
        break;
    }
  }

  ngOnDestroy(): void {
    console.log('Sign up destroyed');
    this.dialogService.actionTaken.unsubscribe();
  }

  onCardSelected(type: string) {
    this.selectedCard = type;
    this.isFormValid.emit(true);
  }

  onModalActionTaken(action: DialogEventType | undefined) {
    /* Submit action sent */
    // if (action == DialogEventType.ok) {
    //   alert('Content saved');
    // }
  }

  requiredFor(cardType: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isOk = true;

      if (this.selectedCard != cardType) {
        return null;
      } else if (this.selectedCard == cardType && control.value != '') {
        return null;
      }

      /* Error found */
      return { requiredFor: { value: control.value } };
    };
  }

  ngOnInit(): void {
  }
}
