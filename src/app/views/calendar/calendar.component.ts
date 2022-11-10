import { Time } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { AppointmentStatus, IAppointment } from 'src/app/shared/services/calendar/appointment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
import { SpecialtyImages, User } from 'src/app/shared/services/user/user';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  /* Component's state */
  public selectedSpecialist: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedPatient: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedSpecialty: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedDate: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public selectedTimeFrom: BehaviorSubject<Time> = new BehaviorSubject<Time>({ hours: 0, minutes: 0 });
  public selectedTimeTo: BehaviorSubject<Time> = new BehaviorSubject<Time>({ hours: 0, minutes: 0 });
  selected = 0;
  hovered = 0;
  readonly = false;
  userRole: string
  currentActionAppointmentId: string = '';
  public currentAppointmentReview: string = '';
  public currentAppointmentCalification: number | undefined = undefined;
  public currentAction: string = '';
  public currentAppointmentCalificationComment: string = '';

  /* Collections */
  public appointments: Observable<IAppointment[]>;
  public specialists$: Observable<User[]>;
  public patients$: Observable<User[]>;
  public specialities$: Observable<string[]>;



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

    /* Filtering logic */
    this.filterForm.valueChanges.subscribe(ext => {

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

  public createRange(number: number, start: number = 0) {
    return new Array(number).fill(0)
      .map((n, index) => index + start);
  }

  selectCard(value: string, type: string) {
    console.log('Specialist selected');
    switch (type) {
      case 'patient':
        this.selectedPatient.next(value);
        break;
      case 'specialist':
        this.selectedSpecialist.next(value);
        break;
      case 'specialty':
        this.selectedSpecialty.next(value)
        break;
      case 'date':
        this.selectedDate.next(Number(value))
        break;
    }
  }

  selectTime(hour: number, minute: number, type: string) {
    switch (type) {
      case 'from':
        this.selectedTimeFrom.next({ hours: hour, minutes: minute })
        break;
      case 'to':
        this.selectedTimeTo.next({ hours: hour, minutes: minute })
        break;
    }
  }

  isTimeFromSelected() {
    return this.selectedTimeFrom.getValue().hours != 0;
  }

  isTimeToSelected() {
    return this.selectedTimeTo.getValue().hours != 0;
  }

  getSpecialityImagePath(speciality: string) {
    let lower = speciality.toLocaleLowerCase();
    console.log('Getting speciality image:');
    console.log(lower);

    switch (speciality) {
      case 'Kinesiologist':
        return SpecialtyImages['Kinesiologist']
      case 'Dentist':
        return SpecialtyImages['Dentist']
      case 'Oncologist':
        return SpecialtyImages['Oncologist']
      default:
        return SpecialtyImages['Default']
    }
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
    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
  }

  showActionForm(content: TemplateRef<any>, appointmentId: string, action: string, appointmentReview: string = '', calification: number | undefined = undefined, calificationComment: string = '') {
    this.selectedTimeFrom.next({ hours: 0, minutes: 0 });
    this.selectedTimeTo.next({ hours: 0, minutes: 0 });
    this.selectedDate.next(0);

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

        let days = this.selectedDate.getValue();
        let from = this.selectedTimeFrom.getValue();
        let to = this.selectedTimeTo.getValue();
        let specialist = this.selectedSpecialist.getValue();
        let speciality = this.selectedSpecialty.getValue();

        let patient;
        if (this.userRole == 'admin')
          patient = this.selectedPatient.getValue(); // Patient selected from UI.
        else
          patient = this.userService.currentUser.getValue().email;

        let isFormReady = true;
        if (days == 0) {
          isFormReady = false;
          this.toast.error('Please select a day for the appointment.')
        }

        if (from.hours == 0) {
          isFormReady = false;
          this.toast.error('Please select the time.')
        }

        if (to.hours == 0) {
          isFormReady = false;
          this.toast.error('Please select the time.')
        }

        if (specialist == '') {
          isFormReady = false;
          this.toast.error('Please select a specialist')
        }

        if (speciality == '') {
          isFormReady = false;
          this.toast.error('Please select a speciality.')
        }

        if (patient == '') {
          isFormReady = false;
          this.toast.error('Please select a patient.')
        }

        if (to.hours < from.hours) {
          this.toast.error('The selected time is invalid')
          isFormReady = false;
        }

        if (isFormReady) {
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
            dateFrom.setHours(from.hours)
            dateFrom.setMinutes(from.minutes)
            dateTo.setHours(to.hours)
            dateTo.setMinutes(to.minutes)
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

        }

        break;
    }
  }

  onSubmit() {
    console.log('Form submitted.');
  }


  ngOnInit(): void {

  }
}
