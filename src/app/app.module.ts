import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Styling modules */
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';

/* Firebase dependencies */
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/* Shared components  */
import { TemplateComponent } from './shared/components/template/template.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

/* View components */
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { SingUpComponent } from './views/sing-up/sing-up.component';
import { LoginComponent } from './views/login/login.component';
import { UsersComponent } from './views/users/users.component';
import { AuthComponent } from './shared/services/auth/auth.component';
import { DialogTemplateComponent } from './shared/services/dialog/components/dialog-template/dialog-template.component';
import { DirectivesDirective } from './shared/services/dialog/directives.directive';
import { DecimalPipe } from '@angular/common';

/* Services */

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    NavbarComponent,
    FooterComponent,
    LandingPageComponent,
    SingUpComponent,
    LoginComponent,
    UsersComponent,
    AuthComponent,
    DialogTemplateComponent,
    DirectivesDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    /* Styling modules */
    FlexLayoutModule,
    FontAwesomeModule,
    /* Firebase modules */
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    NgbModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
