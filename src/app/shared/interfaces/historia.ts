export interface Historia {
    altura:      number;
    peso:        number;
    presion:     number;
    temperatura: number;
    extras:      Extra[];
}

export interface Extra {
    key:   string;
    value: string;
}

