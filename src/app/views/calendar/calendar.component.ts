import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/shared/services/calendar/calendar.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  constructor(private calendar : CalendarService, private userService : UserService) { }

  ngOnInit(): void {
    let currentRole = this.userService.roleAs.getValue();
    this.calendar.getUserAppointments();
  }

}
