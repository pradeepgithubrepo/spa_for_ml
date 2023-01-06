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
import { EditComponentComponent } from './mainpage/edit-component/edit-component.component';
import { DialogConfirm } from './dialog/dialog_confirm';
import { ScrawlComponentComponent } from './mainpage/scrawl-component/scrawl-component.component'
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    MainComponentComponent,
    DialogConfirm,
    EditComponentComponent,
    ScrawlComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ],
  providers: [MlsrvcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
