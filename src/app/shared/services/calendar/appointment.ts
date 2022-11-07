export interface IAppointment {
    id: string;
    dateFrom: Date;
    dateTo: Date;
    durationInMinutes: number;
    patientEmail: string;
    specialist: string;
    speciality: string;
    observation: string;
    calification: number;
    status: AppointmentStatus;
    cancellationReason: string;
    review: string;
}

export enum AppointmentStatus {
    cancelled = "Cancelled",
    rejected = "Rejected",
    done = "Done",
    pending = "Pending",
    accepted = "Accepted"
}