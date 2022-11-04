import { Component, OnInit } from '@angular/core';
import { IAppointment } from 'src/app/shared/services/calendar/appointment';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  appointments: IAppointment[];

  constructor(private calendar: CalendarService, private userService: UserService) {
    this.appointments = this.calendar.getUserAppointments();
  }

  ngOnInit(): void {

  }

}
