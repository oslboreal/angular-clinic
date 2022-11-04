export interface IAppointment {
    id : string;
    dateFrom: Date;
    dateTo: Date;
    durationInMinutes: number;
    patientEmail: string;
    specialist: string;
    speciality: string;
    observation : string;
    calification : number;
    cancelled: boolean;
    cancellationReason : string;
}