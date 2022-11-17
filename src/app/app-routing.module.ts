import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { SpecialistGuard } from './shared/guards/specialist.guard';
import { VerifiedEmailGuard } from './shared/guards/verified-email.guard';
import { CalendarComponent } from './views/calendar/calendar.component';
import { HistorialComponent } from './views/historial/historial.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { MyProfileComponent } from './views/my-profile/my-profile.component';
import { SingUpComponent } from './views/sing-up/sing-up.component';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';
import { UsersComponent } from './views/users/users.component';
import { VerificationEmailSentComponent } from './views/verification-email-sent/verification-email-sent.component';

const routes: Routes = [
  { path: 'signup', component: SingUpComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, VerifiedEmailGuard] },
  { path: 'patients', component: HistorialComponent, canActivate: [VerifiedEmailGuard, SpecialistGuard]},
  { path: 'calendar', component: CalendarComponent /*, canActivate: [VerifiedEmailGuard]*/ },
  { path: 'email-sent', component: VerificationEmailSentComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
