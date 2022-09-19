import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel } from '@angular/forms';
import { MlsrvcService } from 'src/app/mlsrvc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationExtras, Router } from '@angular/router';
3
@Component({
  selector: 'app-main-component',
  template: `
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-12"></div>
      <div class="col-md-6 mb-12">
        <h1> Intelligent Schema Mapper </h1>
      </div>
      <div class="col-md-2 mb-12"></div>
    </div>
    <div class="row">
      <div class="col-md-4 mb-12"></div>
        <img [src]="imageSrc"/>
      <div class="col-md-2 mb-12"></div>
    </div>
    <br/>
    <br/>

    <div class="row" *ngIf="warmup == 1">
    <div class="col-md-2 mb-12"></div>
      <div class="col-md-8 mb-12">
          <table class="table table-striped">
            <thead>
            <tr>
              <th >#</th>
              <th>Filename</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let pd of processdata; index as i">
              <td scope="row">{{ i + 1 }}</td>
              <td style="word-wrap: break-word;">{{ pd.filename}}</td>
              <td><button class="btn btn-info" (click)="mlprocess($event,pd.filename,pd.columnnames)">Process</button> </td>
            </tbody>
          </table>
      </div>
    <div class="col-md-2 mb-12"></div>
    </div>
  </div>

  <ngx-spinner
  bdColor="rgba(51,51,51,0.8)"
  size="medium"
  color="#fff"
  type="ball-scale-multiple">
  <p style="font-size: 20px; color: white">{{spinnercontent}}</p></ngx-spinner>
  `,
  styles: [`
    img {
      width: 400px;
      height: 200px;
    }`
  ]
})
export class MainComponentComponent implements OnInit {

  warmup = 0
  spinnercontent = "Processing!!!"
  processdata = [{ "filename": "sourcekey", "columnnames": "cdm_key" }]

  public schemaForm = new FormGroup({
    rawcolumns: new FormControl('')
  });

  onSubmit() {
  }

  mlprocess(event: Event, filename: String, rawcols: String) {
    var postdata = { "filename": filename, "rawcols": rawcols }
    var formData: any = new FormData();
    formData.append('postdata', JSON.stringify(postdata))
    this.spinnerService.show();
    this.spinnercontent = "Identifying CDM Mapping...."
    this.mlsrvcService.processml(formData).subscribe(data => {
      console.log("View data -> " + JSON.stringify(data))
      const queryParams = { processedfilename: filename };
      this.router.navigate(['/editconfig'], { queryParams: queryParams })
        .then(success => console.log('navigation success?', success))
        .catch(console.error);
    })
  }

  public schemafunc(): void {
    this.warmup = 0
    this.spinnerService.show();
    // Logic to update the user will go here, but for now, we'll just log the values
    var formData: any = new FormData();
    formData.append('rawcolumns', this.schemaForm.controls.rawcolumns.value);
    this.mlsrvcService.processml(formData).subscribe(data => {
      this.warmup = 1
      this.spinnerService.hide();
      console.log(data)
      this.processdata = data

    }, err => {

    }
    );

  }

  public getfilefunc(): void {
    this.warmup = 0
    this.mlsrvcService.getfilelist().subscribe(data => {
      this.warmup = 1
      this.spinnerService.hide();
      console.log(data)
      this.processdata = JSON.parse(data)
    }, err => {

    }
    );

  }

  imageSrc = 'assets/ai.png'

  constructor(private mlsrvcService: MlsrvcService, private spinnerService: NgxSpinnerService, private router: Router) {
  }

  ngOnInit(): void {
    this.spinnerService.show();
    this.spinnercontent = "Retreiving contents from crawler...."
    this.getfilefunc()
  }



}
