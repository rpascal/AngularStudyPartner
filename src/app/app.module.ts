import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {firebaseModule} from './firebase/firebase-config';
import {routedComponents, routing} from './routing/routing';
import {HeaderComponent} from './components/header/header.component';
import {serviceProviders} from './services/services-export';



@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule,
    firebaseModule,
    routing
  ],
  providers: [serviceProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
