import { Component, OnInit } from '@angular/core';
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  items:any;
  peso:any;
  altura:any;
  temperatura:any;
  presion:any;
  fecha = new Date();
  hoy:any = this.fecha.getDate();
  mesActual:any = this.fecha.getMonth() + 1
  añoActual = this.fecha.getFullYear()

  TDocumentDefinitions: any;

  constructor(private userService: UserService) {
    this.userService.getHistorial()
    .subscribe(res =>{
      console.log(res);
      this.items = res;
    });
    
   }
  ngOnInit(): void {
  }

 

  createPdf(){

    this.items.forEach((element: any) => {
      this.peso = element.peso;
      this.altura = element.altura;
      this.temperatura = element.temperatura;
      this.presion = element.presion;
    });
    this.TDocumentDefinitions = {
      content: [
        {
          // you can also fit the image inside a rectangle
          image:'snow' ,
          fit: [100, 100]
        },
        {
          toc: {
            id: 'mainToc',
            title: {text: 'TITULO: HISTORIAL CLINICO', style: 'header'}
          }
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
    
            body: [  
              [ 'Altura', 'Peso', 'Presion', 'Temperatura' ],
              [  this.peso, this.altura, this.temperatura, this.presion ]
            ]
          }
        },
        {
          text: 'Fecha de emision: ' + this.hoy + '/' + this.mesActual + '/' + this.añoActual,
          style: 'header'
        }
      ],
      images: {
        // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
        snow: 'https://picsum.photos/id/870/200/300?grayscale&blur=2',
  
      }
    }

    const pdf = pdfMake.createPdf(this.TDocumentDefinitions);
    pdf.download();

  }

}
