import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { SingUpComponent } from './views/sing-up/sing-up.component';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';
import { UsersComponent } from './views/users/users.component';

const routes: Routes = [
  { path: 'signup', component: SingUpComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'users', component: UsersComponent },
  { path: 'patients', component: UnderConstructionComponent },
  { path: 'calendar', component: UnderConstructionComponent },
  { path: '**', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
