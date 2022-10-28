import { Component, OnInit } from '@angular/core';
import { faUserNurse, faHeartPulse, faUserDoctor, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  nurseIcon = faUserNurse;
  doctorIcon = faUserDoctor;
  heartIcon = faHeartPulse;
  userGearIcon = faUserGear;
  iconSize: SizeProp = "8x";

  constructor() { }

  ngOnInit(): void {
  }

}
