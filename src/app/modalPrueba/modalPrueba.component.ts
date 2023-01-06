import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modalPrueba',
  templateUrl: './modalPrueba.component.html',
  styleUrls: ['./modalPrueba.component.scss']
})
export class ModalPruebaComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }
  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
  }
}
