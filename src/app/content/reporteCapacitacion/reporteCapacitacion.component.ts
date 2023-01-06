import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadFile } from 'src/app/Base/Util';
import { MSpinnerComponent } from 'src/app/Modal/mSpinner/mSpinner.component';
import { ServiceService } from 'src/app/Service/service.service';

export interface reportCapacitacion {
  tema: string;
  nombre: string;
  lugarSalida: string;
  lugarDesino: string;
  fsalida: string;
  fretorno: string;
  fregistro: string;
  pdfSustento: string;
}


@Component({
  selector: 'app-reporteCapacitacion',
  templateUrl: './reporteCapacitacion.component.html',
  styleUrls: ['./reporteCapacitacion.component.scss']
})
export class ReporteCapacitacionComponent implements OnInit {

  ELEMENT_DATA:reportCapacitacion[] = [];
  displayedColumns: string[] = ['nombre', 'tema', 'lugarSalida', 'lugarDesino' ,'fregistro', 'fsalida','fretorno','Accion'];

  constructor(
    private service:ServiceService,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
    this. listarCapacitacion();
  }
  openSpinner(){
    this.dialog.open(MSpinnerComponent, {
      minHeight: '90px',
      minWidth: '90px'
    });
  }
  listarCapacitacion(){
    this.openSpinner();
    this.service.listCapacitacion().subscribe(
      (result:any)=>{
        console.log(result);
        this.dialog.closeAll();
        result.forEach((element:any) => {
          this.ELEMENT_DATA.push(
            { tema: element.tema,
              nombre: element.nombre,
              lugarSalida: element.lugarSalida,
              lugarDesino: element.lugarDesino,
              fsalida: element.fsalida,
              fretorno: element.fretorno,
              fregistro: element.fregistro,
              pdfSustento: String(element.pdfSustento),}
          );
          console.log("aquiiiii",this.ELEMENT_DATA);
        });
      }
    );
  }
  descargarAnexo(param: any) {
    console.log(param);
    DownloadFile(param.pdfSustento, param.fregistro+'_Sustento.pdf', 'application/octet-stream')
  }
}
