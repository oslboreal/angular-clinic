import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  constructor() { }

  log(object: any) {
    if (!environment.production)
      console.log(object);
  }

  error(object: any) {
    if (!environment.production)
      console.error(object);
  }

  warn(object: any) {
    if (!environment.production)
      console.warn(object);
  }
}
