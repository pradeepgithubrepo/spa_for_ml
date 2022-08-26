import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './header/header-component/header-component.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponentComponent } from './mainpage/main-component/main-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MlsrvcService } from './mlsrvc.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    MainComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [MlsrvcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
