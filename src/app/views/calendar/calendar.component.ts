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
  public appointments: Observable<IAppointment[]>;
  userRole: string
  currentActionAppointmentId: string = '';
  currentAction: string = '';

  /* Form used to set a status to an appointment */
  statusForm = this.formBuilder.group({
    reason: ['']
  });

  constructor(private formBuilder: FormBuilder, private calendar: CalendarService, private userService: UserService, private dialogService: DialogService) {
    this.userRole = localStorage.getItem('role') ?? 'guest';
    this.appointments = this.calendar.appointmets$;
  }

  showActionForm(content: TemplateRef<any>, appointmentId: string, action: string) {
    this.currentActionAppointmentId = appointmentId;
    this.currentAction = action;
    this.dialogService.setDialog(DialogEventType.open, content);
  }

  onOkPressed(action: string) {
    console.log('Ok pressed on Calendar');
    switch (action) {
      // TODO : REASON FROM FORM
      case 'cancel':
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, 'Get value from form', AppointmentStatus.cancelled);
        break;
      case 'reject':
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, 'Get value from form', AppointmentStatus.rejected);
        break;
      case 'accept':
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, 'Get value from form', AppointmentStatus.accepted);
        break;
      case 'end':
        this.calendar.changeAppointmentStatus(this.currentActionAppointmentId, 'Get value from form', AppointmentStatus.done);
        break;
    }
  }

  onSubmit() {
    console.log('Form submitted.');
  }


  ngOnInit(): void {

  }
}
