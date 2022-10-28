import { NgModule, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Styling modules */
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


/* Firebase dependencies */
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';

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
import { UserService } from './shared/services/user/user.service';
import { UnderConstructionComponent } from './views/under-construction/under-construction.component';

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
    UnderConstructionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    /* Styling modules */
    ToastrModule.forRoot(),
    FlexLayoutModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    /* Firebase modules */
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    AngularFireStorageModule,
    provideAuth(() => getAuth()),
    NgbModule,
  ],
  providers: [DecimalPipe, UserService, { provide: BUCKET, useValue: 'images' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
