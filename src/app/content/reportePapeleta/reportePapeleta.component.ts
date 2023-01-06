import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadFile } from 'src/app/Base/Util';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';




export interface reportPapeleta {
  empleado: string;
  nombre: string;
  motivo: string;
  fretorno: string;
  fsalida: string;
  lugarDestino: string;
  lugarSalida: string;
  fregistro: string;
  pdfSustento: string;
}

@Component({
  selector: 'app-reportePapeleta',
  templateUrl: './reportePapeleta.component.html',
  styleUrls: ['./reportePapeleta.component.scss']
})
export class ReportePapeletaComponent implements OnInit {


  ELEMENT_DATA:reportPapeleta[] = [];
  displayedColumns: string[] = ['empleado',  'motivo','nombre','fregistro', 'fsalida','fretorno' , 'lugarDestino','lugarSalida','Accion'];
  constructor(
    private servicio: ServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.listarReportePapeleta();
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  listarReportePapeleta(){
    this.openSpinner();
    this.servicio.listpapeleta().subscribe(
    (result:any)=>{
      this.dialog.closeAll();
      result.forEach((element:any) => {
        this.ELEMENT_DATA.push(
          { empleado: element.empleado,
            nombre: element.nombre,
            motivo: element.motivo,
            fretorno: element.fretorno,
            fsalida: element.fsalida,
            lugarDestino: element.lugarDestino,
            lugarSalida: element.lugarSalida,
            fregistro: element.fecha,
            pdfSustento: String(element.pdfSustento),}
        );
        console.log("aquiiiii",this.ELEMENT_DATA);
      });
      console.log("FECHA",result);
    }
    );
  }

  descargarAnexo(param: any) {
    console.log(param);
    DownloadFile(param.pdfSustento, param.fregistro+'_Sustento.pdf', 'application/octet-stream')
  }
}
