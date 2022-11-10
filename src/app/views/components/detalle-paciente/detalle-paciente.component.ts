import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-paciente',
  templateUrl: './detalle-paciente.component.html',
  styleUrls: ['./detalle-paciente.component.scss']
})
export class DetallePacienteComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    altura: ['', [Validators.required, Validators.minLength(3)]],
    peso: ['', [Validators.required, Validators.minLength(999)]],
    presion: ['', [Validators.required, Validators.minLength(999)]],
    temperatura: ['', [Validators.required, Validators.minLength(999)]],
    extras: this.fb.array([], Validators.required)
  });

  constructor(private fb: FormBuilder) { }

  get favoritosArr(){
    return this.miFormulario.get('extras') as FormArray
  }

  ngOnInit(): void {
    
  }

}
