import { Time } from "@angular/common";

export interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    age: number;
    role: string;
    enabled: boolean;
    nationalIdentification: string;
    healthInsurance: string;
    speciality: string;
    extraSpecialities: string[];
    timeAvailability: ITimeAvailability[];
    firstImage: string;
    secondImage: string;
    emailVerified: boolean;
}

export interface ITimeAvailability {
    speciality: string; // Especialdiad asociada.
    timeFrom: Time; // Tiempo desde
    timeTo: Time; // Tiempo hasta.
    // Por ejemplo podría ser: Dentista de 3:00 a 18:30 hs.
}

export enum Speciality {
    Dentist = 1,
    Kinesiologist = 2,
    Oncologist = 3,
}