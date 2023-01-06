import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import { loginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [
    loginComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    MaterialModule,
    PrimengModule
   ],
  exports: [
    BaseRoutingModule,
    loginComponent
  ],
  providers: [],
})
export class BaseModule {}
