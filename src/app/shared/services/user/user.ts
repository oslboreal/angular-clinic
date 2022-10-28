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
    firstImage: string;
    secondImage: string;
    emailVerified: boolean;
}