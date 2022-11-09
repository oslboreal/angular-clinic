import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { AppointmentStatus, IAppointment } from 'src/app/shared/services/calendar/appointment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selected = 0;
  hovered = 0;
  readonly = false;

  public appointments: Observable<IAppointment[]>;
  userRole: string
  currentActionAppointmentId: string = '';
  public currentAppointmentReview: string = '';
  public currentAppointmentCalification: number | undefined = undefined;
  public currentAction: string = '';
  public currentAppointmentCalificationComment: string = '';

  public specialists$: Observable<User[]>;
  public patients$: Observable<User[]>;
  public specialities$: Observable<string[]>;

  public availableDays$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public availableMonths$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /* Form used to set a status to an appointment */
  statusForm = this.formBuilder.group({
    reason: ['']
  });

  calificationForm = this.formBuilder.group({
    comment: ['']
  });

  addAppointmentForm = this.formBuilder.group({
    speciality: [''],
    specialist: [''],
    patient: [''],
    from: [],
    to: [],
    days: []
  });

  surveyForm = this.formBuilder.group({
    wouldYouRecommendService: [''],
    wasGoodExperience: [''],
  });

  filterForm = this.formBuilder.group({
    speciality: [''],
    patient: [''],
    specialist: [''],
  });

  constructor(private toast: ToastrService, private formBuilder: FormBuilder, private calendar: CalendarService, private userService: UserService, private dialogService: DialogService) {
    this.userRole = localStorage.getItem('role') ?? 'guest';
    this.appointments = this.calendar.appointmets$;

    /* Loads available months and dayts to pick an appointment */
    // this.loadAvailableSlotsToPickApointment();

    /* Loads specialits and specialities */
    this.specialists$ = this.calendar.specialists$.asObservable();
    this.patients$ = this.calendar.patients$.asObservable();
    this.specialities$ = this.calendar.specialities$.asObservable();

    this.specialists$.subscribe(ext => {
      console.log('Calendar - Got specialists');

      console.log(ext);

    })

    /* Filtering logic */
    this.filterForm.valueChanges.subscribe(ext => {

      console.log(this.filterForm.controls);

      let isFilteringSpecialist = this.filterForm.controls.specialist.value != '';
      let isFilteringPatient = this.filterForm.controls.patient.value != '';
      let isFilteringSpeciality = this.filterForm.controls.speciality.value != '';

      if (isFilteringSpecialist || isFilteringPatient || isFilteringSpeciality) {
        console.log('Filtering calendar');
        let appointments = this.calendar.getUserAppointments();

        if (appointments) {
          console.log(appointments);

          if (isFilteringPatient)
            appointments = appointments.filter(x => x.patientName?.toLocaleLowerCase().includes(this.filterForm.controls.patient.value?.toLocaleLowerCase() ?? ''))

          if (isFilteringSpecialist)
            appointments = appointments.filter(x => x.specialistName.toLocaleLowerCase().includes(this.filterForm.controls.specialist.value?.toLocaleLowerCase() ?? ''))

          if (isFilteringSpeciality)
            appointments = appointments.filter(x => x.speciality.toLocaleLowerCase().includes(this.filterForm.controls.speciality.value?.toLocaleLowerCase() ?? ''))
        }

        this.calendar.appointmets$.next(appointments);
      } else {
        this.calendar.appointmets$.next(this.calendar.getUserAppointments());
      }
    })
  }

  public createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0)
      .map((n, index) => index);
  }

  public getMonth(number: number) {
    let date = new Date();
    date.setDate((date.getDate() + number));
    return date.getMonth();
  }

  public getFullDate(number: number) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let date = new Date();
    date.setDate((date.getDate() + number));
    return `${date.getDate()}/${monthNames[date.getMonth()]}`;
  }

  showActionForm(content: TemplateRef<any>, appointmentId: string, action: string, appointmentReview: string = '', calification: number | undefined = undefined, calificationComment: string = '') {
    if (calification != undefined) {
      this.currentAppointmentCalification = calification;
      this.selected = calification;
    }

    if (calificationComment != '') {
      this.calificationForm.controls.comment.setValue(calificationComment);
      this.calificationForm.controls.comment.disable();
    }

    this.currentAppointmentCalificationComment = calificationComment;

    this.currentAppointmentReview = appointmentReview;
    this.currentActionAppointmentId = appointmentId;

    this.currentAction = action;
    this.dialogService.setDialog(DialogEventType.open, content);
  }

  onOkPressed(action: string) {
    console.log('Ok pressed on Calendar');
    switch (action) {
      case 'cancel':
        console.log('Appointment cancelled');
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, this.statusForm.controls.reason.value ?? '', AppointmentStatus.cancelled);
        break;
      case 'reject':
        console.log('Appointment rejected');
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, this.statusForm.controls.reason.value ?? '', AppointmentStatus.rejected);
        break;
      case 'accept':
        console.log('Appointment accepted');
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, '', AppointmentStatus.accepted);
        break;
      case 'end':
        console.log('Appointment done');
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, '', AppointmentStatus.done, this.statusForm.controls.reason.value ?? 'No comments were added by the specialist.');
        break;
      case 'survey':
        this.calendar.sendSurvey(this.currentActionAppointmentId, this.surveyForm.controls.wouldYouRecommendService.value, this.surveyForm.controls.wasGoodExperience.value);
        break;
      case 'calificate':
        this.calendar.calificateAppointment(this.currentActionAppointmentId, this.selected, this.calificationForm.controls.comment.value ?? 'No comment was left');
        break;
      case 'create':
        console.log('Calendar - Creating appointment');

        let days = this.addAppointmentForm.controls.days.value ?? 0;
        let from = this.addAppointmentForm.controls.from.value;
        let to = this.addAppointmentForm.controls.to.value;
        let specialist = this.addAppointmentForm.controls.specialist.value;
        let speciality = this.addAppointmentForm.controls.speciality.value;
        let patient = this.addAppointmentForm.controls.patient.value;

        if (Number(to) <= Number(from)) {
          this.toast.error('The selected time is invalid')
        } else if (to == 0 && from == 0) {
          this.toast.error('The selected time is invalid')
        }

        /* Datetime from */
        let dateFrom = new Date();

        /* Set day */
        dateFrom.setDate(dateFrom.getDate() + days);

        /* Datetime to */
        let dateTo = new Date();
        dateTo.setDate(dateTo.getDate() + days);
        dateTo.setDate((dateTo.getDate()));

        /* Set hours */
        if (from && to) {
          dateFrom.setHours(from)
          dateTo.setHours(to)
        }

        let specialistUser = this.userService.getUser(specialist ?? '');
        let patientUser = this.userService.getUser(patient ?? '');

        let obs$ = forkJoin(specialistUser, patientUser)

        obs$.subscribe(next => {
          if (next != null) {
            let specialistReceived = next[0];
            let patientReceived = next[1];

            // TODO : Validate specialist availability here
            // specialistReceived?.timeAvailability.filter(x => )
            let isSlotAvailable = true;

            if (isSlotAvailable) {
              // Create appointment
              let appointment = {} as IAppointment;
              appointment.id = this.calendar.getUniqueId(2);
              appointment.status = AppointmentStatus.pending;
              appointment.cancellationReason = "";
              appointment.observation = "";

              /* Dates */
              appointment.dateFrom = dateFrom;
              appointment.dateTo = dateTo;

              /* People implied */
              appointment.patientEmail = patientReceived?.email ?? '';
              appointment.patientName = patientReceived?.name + '' + patientReceived?.surname;
              appointment.specialistEmail = specialist ?? '';
              appointment.specialistName = specialistReceived?.name + '' + specialistReceived?.surname;
              appointment.speciality = speciality ?? '';

              this.calendar.createAppointment(appointment)
            } else {
              this.toast.error('The specialist is not available at that time, please try with a different placeholder.');
            }
          }
        })





        break;
    }
  }

  onSubmit() {
    console.log('Form submitted.');
  }


  ngOnInit(): void {

  }
}
