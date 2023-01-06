import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/content/expedienteExterno/expedienteExterno.component';


@Component({
  selector: 'app-mConfirmExpediente',
  templateUrl: './mConfirmExpediente.component.html',
  styleUrls: ['./mConfirmExpediente.component.scss']
})
export class MConfirmExpedienteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MConfirmExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
    this.data.guardar = "Guardar"
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
