import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavsRoutingModule } from './navs-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NavsRoutingModule,
    MaterialModule,
    PrimengModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule

   ],
  exports: [NavsRoutingModule],
  providers: [],
})
export class NavsModule {}
