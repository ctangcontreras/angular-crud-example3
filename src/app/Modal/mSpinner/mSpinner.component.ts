import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mSpinner',
  templateUrl: './mSpinner.component.html',
  styleUrls: ['./mSpinner.component.scss']
})
export class MSpinnerComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<MSpinnerComponent>,
  ) { }

  ngOnInit() {
    this.spinner.show();
  }

}
