import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {DockModule} from 'primeng/dock';
import {MenubarModule} from 'primeng/menubar';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {KnobModule} from 'primeng/knob';
import {RatingModule} from 'primeng/rating';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

  ],
  exports: [
    ToastModule,
    RippleModule,
    PasswordModule,
    ButtonModule,
    DockModule,
    MenubarModule,
    InputNumberModule,
    InputTextModule,
    KnobModule,
    RatingModule,
    CardModule,
    DialogModule

  ],
  providers: [MessageService],
})
export class PrimengModule { }
