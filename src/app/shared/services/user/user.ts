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

export const SpecialtyImages = {
    Oncologist: "https://healthblog.uofmhealth.org/sites/consumer/files/2018-06/michigan-med-c-oncologist-tips.jpg",
    Dentist: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/US_Navy_030124-N-1328C-510_Navy_dentist_treats_patients_aboard_ship.jpg/1200px-US_Navy_030124-N-1328C-510_Navy_dentist_treats_patients_aboard_ship.jpg",
    Kinesiologist: "https://www.sports-management-degrees.com/wp-content/uploads/2020/04/What-Degree-is-Needed-to-Be-a-Kinesiologist.jpg",
    Default: "https://www.gba.gob.ar/sites/default/files/styles/niticias_principal/public/comunicacion_publica/imagenes/LUDOVICA.jpg"
}

export enum Speciality {
    Dentist = 1,
    Kinesiologist = 2,
    Oncologist = 3,
}