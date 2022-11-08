import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppointmentStatus, IAppointment } from 'src/app/shared/services/calendar/appointment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { DialogEventType, DialogService } from 'src/app/shared/services/dialog/dialog.service';
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

  /* Form used to set a status to an appointment */
  statusForm = this.formBuilder.group({
    reason: ['']
  });

  calificationForm = this.formBuilder.group({
    comment: ['']
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

  constructor(private formBuilder: FormBuilder, private calendar: CalendarService, private userService: UserService, private dialogService: DialogService) {
    this.userRole = localStorage.getItem('role') ?? 'guest';
    this.appointments = this.calendar.appointmets$;

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
        this.calendar.sendSurvey(this.currentActionAppointmentId, this.surveyForm.controls.wouldYouRecommendService.value , this.surveyForm.controls.wasGoodExperience.value);
        break;
      case 'calificate':
        this.calendar.calificateAppointment(this.currentActionAppointmentId, this.selected, this.calificationForm.controls.comment.value ?? 'No comment was left');
        break;
    }
  }

  onSubmit() {
    console.log('Form submitted.');
  }


  ngOnInit(): void {

  }
}
