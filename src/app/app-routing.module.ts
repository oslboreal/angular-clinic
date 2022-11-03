import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { VerifiedEmailGuard } from './shared/guards/verified-email.guard';
import { CalendarComponent } from './views/calendar/calendar.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { SingUpComponent } from './views/sing-up/sing-up.component';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';
import { UsersComponent } from './views/users/users.component';
import { VerificationEmailSentComponent } from './views/verification-email-sent/verification-email-sent.component';

const routes: Routes = [
  { path: 'signup', component: SingUpComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, VerifiedEmailGuard] },
  { path: 'patients', component: UnderConstructionComponent, canActivate: [VerifiedEmailGuard]},
  { path: 'calendar', component: CalendarComponent /*, canActivate: [VerifiedEmailGuard]*/ },
  { path: 'email-sent', component: VerificationEmailSentComponent },
  { path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
