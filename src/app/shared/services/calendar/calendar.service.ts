import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../user/user';
import { AppointmentStatus, IAppointment, ISurvey } from './appointment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private appointments: IAppointment[];
  appointmets$: BehaviorSubject<IAppointment[]> = new BehaviorSubject<IAppointment[]>([]);

  constructor(private toastr: ToastrService) {
    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Adding appointment for testing */
    if (this.appointments.length == 0) {
      let patientTestAppointment = {} as IAppointment;
      patientTestAppointment.id = this.getUniqueId(2);
      // patientTestAppointment.calification = 4;
      patientTestAppointment.status = AppointmentStatus.pending;
      patientTestAppointment.cancellationReason = "";
      let dateFrom = new Date();
      patientTestAppointment.dateFrom = dateFrom;
      dateFrom.setMinutes(dateFrom.getMinutes() + 5);
      patientTestAppointment.dateTo = dateFrom; // Five minutes were added for testing purposes.
      patientTestAppointment.observation = "He's gonna die :(";
      patientTestAppointment.patientEmail = "patient1@vallejo-clinic.utn";
      patientTestAppointment.patientName = "Patient 1 name";
      patientTestAppointment.specialistEmail = "nynvmqtohkqdrjpfus@tmmbt.net";
      patientTestAppointment.specialistName = "Specialist One";
      patientTestAppointment.speciality = "Dentist"
      this.appointments.push(patientTestAppointment);

      let adminTestAppointment = {} as IAppointment;
      adminTestAppointment.id = this.getUniqueId(2);
      // adminTestAppointment.calification = 4;
      adminTestAppointment.status = AppointmentStatus.cancelled;
      adminTestAppointment.cancellationReason = "This is a testing one";
      dateFrom = new Date();
      adminTestAppointment.dateFrom = dateFrom;
      dateFrom.setMinutes(dateFrom.getMinutes() + 5);
      adminTestAppointment.dateTo = dateFrom; // Five minutes were added for testing purposes.
      adminTestAppointment.observation = "He's gonna die :(";
      adminTestAppointment.patientEmail = "patient1@vallejo-clinic.utn";
      adminTestAppointment.patientName = "Patient 1 name";
      adminTestAppointment.specialistEmail = "nynvmqtohkqdrjpfus@tmmbt.net";
      adminTestAppointment.specialistName = "Specialist One";
      adminTestAppointment.speciality = "Dentist"
      this.appointments.push(adminTestAppointment);

      this.setLocalStorage(this.appointments);

    }

    /* Emit apointments */
    this.appointmets$.next(this.appointments);
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
      let role = localStorage.getItem('role');

      this.appointments = this.getAppointmentsFromLocalStorage();
      return this.appointments.filter((x) => {
        if (role == 'admin') {
          return true; // returns all
        } else if (role == 'patient') {
          return x.patientEmail == email;
        } else {
          // Specialist.
          return x.specialistEmail == email;
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

  changeAppointmentStatus(appointmentId: string, reason: string, status: AppointmentStatus, appointmentReview: string = ''): Observable<boolean> {
    try {
      this.appointments = this.getAppointmentsFromLocalStorage();

      /* Cancel appointment */
      this.appointments.map((app) => {
        if (app.id == appointmentId) {
          app.status = status;
          app.review = appointmentReview;
          app.cancellationReason = reason;
        }
      });

      /* Persists changes */
      this.setLocalStorage(this.appointments);

      /* Emit apointments */
      this.appointmets$.next(this.appointments);

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

  // sendSurvey(this.currentActionAppointmentId, this.surveyForm.controls.wasGoodExperience.value, this.surveyForm.controls.wouldYouRecommendService.value);
  sendSurvey(appointmentId: string, wasGoodExperience: any, wouldYouRecommendService: any) {
    console.log('Sending survey:');
    console.log('Was a good experience? ' + wasGoodExperience);
    console.log('Would you recommend? ' + wouldYouRecommendService);

    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Calificate appointment */
    this.appointments.map((app) => {
      if (app.id == appointmentId) {
        app.survey = { wasGoodExperience: wasGoodExperience, wouldYouRecommendService: wouldYouRecommendService } as ISurvey;
      }
    });

    /* Persists changes */
    this.setLocalStorage(this.appointments);

    /* Emit apointments */
    this.appointmets$.next(this.appointments);

    this.toastr.success('Survey sent.');
  }

  // Set calification for an appointment.
  calificateAppointment(appointmentId: string, calification: number, comment: string) {
    this.appointments = this.getAppointmentsFromLocalStorage();

    /* Calificate appointment */
    this.appointments.map((app) => {
      if (app.id == appointmentId) {
        app.calification = calification;
        app.calificationComment = comment;
      }
    });

    /* Persists changes */
    this.setLocalStorage(this.appointments);

    /* Emit apointments */
    this.appointmets$.next(this.appointments);

    this.toastr.success('Appointment calificated.');
  }

  /* Local storage management */

  private setLocalStorage(appointments: IAppointment[]) {
    let json = JSON.stringify(appointments);
    localStorage.setItem('appointments', json);
  }

  private getAppointmentsFromLocalStorage() {
    let storedVal = localStorage.getItem('appointments');
    return JSON.parse(storedVal ?? '[]');
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
