export interface IAppointment {
    id: string;
    dateFrom: Date;
    dateTo: Date;
    durationInMinutes: number;
    patientEmail: string;
    patientName: string;
    specialistEmail: string;
    specialistName: string;
    speciality: string;
    observation: string;
    calification: number;
    status: AppointmentStatus;
    cancellationReason: string;
    review: string;
    calificationComment: string;
    survey: ISurvey;
}

export interface ISurvey {
    wasGoodExperience: boolean,
    wouldYouRecommendService: boolean
}

export enum AppointmentStatus {
    cancelled = "Cancelled",
    rejected = "Rejected",
    done = "Done",
    pending = "Pending",
    accepted = "Accepted"
}