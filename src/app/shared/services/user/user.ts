export interface User {
    name: string;
    surname: string;
    email: string;
    age: number;
    role: string;
    nationalIdentification: string;
}

export interface Patient extends User {
    healthInsurance: string;
}

export interface Specialist extends User {
    speciality: string;
    extraSpecialities: string[];
}