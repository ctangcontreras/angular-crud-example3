import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';
import {MatInputModule} from '@angular/material/input';
import { MessageService } from 'primeng/api';
import {MatSelectModule} from '@angular/material/select';
import { MaterialModule } from './material/material.module';
import { PrimengModule } from './primeng/primeng.module';
import { ModalPruebaComponent } from './modalPrueba/modalPrueba.component';
import { NavsComponent } from './navs/navs.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { BaseModule } from './Base/base.module';
import { ModalModule } from './Modal/modal.module';
import { ContentModule } from './content/content.module';


@NgModule({
  declarations: [
    AppComponent,
      ModalPruebaComponent,
      NavsComponent,
      DashboardComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //Material
    MaterialModule,
    //primeNG
    PrimengModule,
    //routing
    ModalModule,
    ContentModule,



  ],
  exports: [
    MaterialModule,
    PrimengModule,
  ],
  providers: [
    //{provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
