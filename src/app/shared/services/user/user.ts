export interface User {
    name: string;
    surname: string;
    email: string;
    age: number;
    role: string;
    enabled: boolean;
    nationalIdentification: string;
    healthInsurance: string;
    speciality: string;
    extraSpecialities: string[];
    firstImage: string;
    secondImage: string;
}