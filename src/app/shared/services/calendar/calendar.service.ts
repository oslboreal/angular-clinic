import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../user/user';
import { IAppointment } from './appointment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  appointments: IAppointment[];

  constructor() {
    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Adding appointment for testing */
    if (this.appointments.length == 0) {
      let testAppointment = {} as IAppointment;
      testAppointment.id = this.getUniqueId(2);
      testAppointment.calification = 4;
      testAppointment.cancelled = true;
      testAppointment.cancellationReason = "This is a testing one";
      let dateFrom = new Date();
      testAppointment.dateFrom = dateFrom;
      dateFrom.setMinutes(dateFrom.getMinutes() + 5);
      testAppointment.dateFrom = dateFrom; // Five minutes were added for testing purposes.
      testAppointment.observation = "He's gonna die :(";
      testAppointment.patientEmail = "patient1@clinic-vallejo.com";
      testAppointment.specialist = "specialist1@clinic-vallejo.com";
      testAppointment.speciality = "Dentist"
      this.appointments.push(testAppointment);

      this.setLocalStorage(this.appointments);
    }
  }

  isAppointmentSlotAvailableForPatient(user: User, dateFrom: Date, dateTo: Date) {
    try {
      // Get user appointments, check whether an appointment exists or not.
      let appointment = {} as IAppointment;
      appointment.dateFrom = dateFrom;
      appointment.dateTo = dateTo;
      appointment.patientEmail = user.email;
      appointment.durationInMinutes = (appointment.dateTo.getUTCMinutes() - appointment.dateFrom.getUTCMinutes());

      return true;
      // Check whether slot is available in list.
    } catch (error) {
      return false;
    }
  }

  getUserAppointments() {
    try {
      let user = JSON.parse(localStorage.getItem('user') ?? '');
      let email = user.email;
      let role = JSON.parse(localStorage.getItem('role') ?? '');

      this.appointments = this.getAppointmentsFromLocalStorage();
      return this.appointments.filter((x) => {
        if (role == 'admin') {
          return x.patientEmail == email;
        } else if (role == 'patient') {
          return x.patientEmail == email;
        } else {
          // Specialist.
          return x.specialist == email;
        }
      });
    } catch (error) {
      return [];
    }
  }

  createAppointment(appointment: IAppointment) {
    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Generates unique id */
    appointment.id = this.getUniqueId(2);

    /* Persists the current state */
    // if(this.isAppointmentSlotAvailableForPatient()){
    // Create appointment
    this.appointments.push(appointment);
    this.setLocalStorage(this.appointments);
    // }else
    // {
    // Otherwise show Toastr.
    // this.toastr.error('Got an error creating an appointment.')
    // }
  }

  cancelAppointment(appointmentId: string, reason: string): Observable<boolean> {
    try {
      this.appointments = this.getAppointmentsFromLocalStorage();

      /* Cancel appointment */
      this.appointments.map((app) => {
        if (app.id == appointmentId) {
          app.cancelled = true;
          app.cancellationReason = reason;
        }
      });

      /* Persists changes */
      this.setLocalStorage(this.appointments);

      return of(true);
    } catch (error) {
      return of(false);
    }

  }

  getAppointmentObservation(appointmentId: string) {
    this.appointments = this.getAppointmentsFromLocalStorage();
    let filtered = this.appointments.filter(x => x.id == appointmentId);
    return filtered[0]?.observation;
  }

  // Set calification for an appointment.
  calificateAppointment(appointmentId: string, calification: number) {
    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Calificate appointment */
    this.appointments.map((app) => {
      if (app.id == appointmentId) {
        app.calification = calification;
      }
    });

    /* Persists changes */
    this.setLocalStorage(this.appointments);
  }

  /* Local storage management */

  private setLocalStorage(appointments: IAppointment[]) {
    JSON.stringify(appointments);
  }

  private getAppointmentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('appointments') ?? '');
  }

  private getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }
}
