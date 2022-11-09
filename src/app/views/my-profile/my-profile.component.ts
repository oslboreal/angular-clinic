import { Time } from '@angular/common';
import { AfterViewInit, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, from, Observable, of, startWith } from 'rxjs';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { ITimeAvailability, User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, AfterViewInit {
  userRole$: Observable<string>
  currentUser: Promise<void | User>;
  selectedAvailability: number | undefined;
  selectedSpeciality: string | undefined;

  availabilityForm = this.formBuilder.group({
    from: [0],
    to: [0]
  });

  timeAvailability: BehaviorSubject<ITimeAvailability[] | any> = new BehaviorSubject([]);

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private dialog: DialogService,
    private toast: ToastrService) {
    this.userRole$ = this.userService.roleAs.asObservable();
    this.currentUser = this.userService.getUser(JSON.parse(localStorage.getItem('user') ?? '{}')?.email);


    this.spinner.show();
    this.currentUser.then((user) => {
      /* Creates time availability object */
      console.log('Creating time availability for: ' + user?.email);

      let specialities: ITimeAvailability[] = [];

      if (user?.speciality) {
        let availability = user?.timeAvailability.filter(x => x.speciality == user?.speciality);

        let timeFrom;
        let timeTo;

        if (availability && availability.length != 0) {
          timeFrom = availability[0].timeFrom;
          timeTo = availability[0].timeTo;
        } else {
          timeFrom = '';
          timeTo = '';
        }

        let specialitySlot = {
          speciality: user?.speciality,
          timeFrom,
          timeTo
        } as ITimeAvailability;

        specialities.push(specialitySlot)
      }

      user?.extraSpecialities.forEach(extraSpeciality => {
        let availability = user?.timeAvailability.filter(x => x.speciality == extraSpeciality);

        let timeFrom;
        let timeTo;

        if (availability && availability.length != 0) {
          timeFrom = availability[0].timeFrom;
          timeTo = availability[0].timeTo;
        } else {
          timeFrom = '';
          timeTo = '';
        }

        let extraSpecialitySlot = {
          speciality: extraSpeciality,
          timeFrom: timeFrom,
          timeTo: timeTo
        } as ITimeAvailability;

        specialities.push(extraSpecialitySlot)
      });

      this.timeAvailability.next(specialities);
      console.log(specialities);

      this.spinner.hide();
    });
  }

  onAddTimeAvailability(content: TemplateRef<any>, index: number, speciality: string) {
    this.selectedAvailability = index;
    this.selectedSpeciality = speciality;
    console.log(speciality);

    this.dialog.setDialog(DialogEventType.open, content)
  }

  onOkPressed(message: string) {
    console.log(this.availabilityForm.value);
    let from = this.availabilityForm.controls.from.value ?? 0;
    let to = this.availabilityForm.controls.to.value ?? 0;

    if (Number(to) <= Number(from)) {
      this.toast.error('The selected time is invalid')
    } else if (to == 0 && from == 0) {
      this.toast.error('The selected time is invalid')
    }

    /* Valid time selected */
    let availability = this.timeAvailability.getValue() as ITimeAvailability[];

    let slot = availability.filter(x => x.speciality == this.selectedSpeciality).pop();
    availability = availability.filter(x => x != slot);

    if (slot) {
      /* Update */
      slot.timeFrom = { hours: from, minutes: 0 };
      slot.timeTo = { hours: to, minutes: 0 }
    } else {
      /* Create */
      slot = {
        speciality: this.selectedSpeciality,
        timeFrom: { hours: from, minutes: 0 },
        timeTo: { hours: to, minutes: 0 },
      } as ITimeAvailability
    }

    availability.push(slot);

    /* Propagate availabilty */
    this.timeAvailability.next(availability);
    this.userService.updateOrAddUserAvailability(availability);
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

}
