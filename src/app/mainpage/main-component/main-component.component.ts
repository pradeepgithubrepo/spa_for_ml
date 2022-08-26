import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel } from '@angular/forms';
import { MlsrvcService } from 'src/app/mlsrvc.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    <div class="row">
    <div class="col-md-4 mb-12"></div>
      <div class="col-md-4 mb-12">
            <form [formGroup]="schemaForm" (submit)="schemafunc()">
                <div class="form-group" class="row justify-content-center">
                    <label for="rawcolumns">Enter source column names:</label>
                    <br/>
                    <textarea ng-model="myTextarea" formControlName="rawcolumns"
                        id="rawcolumns"
                        required></textarea>
                </div>
                <br/>
                <div class="row justify-content-center">
                   <button class="btn btn-primary" type="submit">Submit</button>
                 </div>
            </form>
      </div>
    <div class="col-md-4 mb-12"></div>
    </div>
    <br/>
    <br/>
    <div class="row" *ngIf="warmup == 1">
    <div class="col-md-3 mb-12"></div>
      <div class="col-md-7 mb-12">
          <table class="table table-striped">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">SourceKey</th>
              <th scope="col">CDMKey</th>
              <th scope="col">CosineQuotient</th>
              <th scope="col">Mapping Status</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let pd of processdata; index as i">
              <th scope="row">{{ i + 1 }}</th>
              <td>{{ pd.sourcekey}}</td>
              <td>{{ pd.cdm_key}}</td>  
              <td>{{ pd.cosine_quotient}}</td>
              <td>{{ pd.comment}}</td>  
            </tr>
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
  <p style="font-size: 20px; color: white">Processing...</p></ngx-spinner>
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
  processdata = [{ "sourcekey": "sourcekey", "cdm_key": "cdm_key", "cosine_quotient": "89.56", "comment": "cool" }]
  public schemaForm = new FormGroup({
    rawcolumns: new FormControl('')
  });

  onSubmit() {
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
      // this.options.resetModel();
      // const modalRef = this.modalService.open(DialogComponent, { scrollable: true });
      // modalRef.componentInstance.my_modal_title = 'Success!';
      // modalRef.componentInstance.my_modal_content = 'Data persisted successfully!';
      // console.log("Data inserted")
    }, err => {
      // const modalRef = this.modalService.open(DialogComponent, { scrollable: true });
      // modalRef.componentInstance.my_modal_title = 'Failure!';
      // modalRef.componentInstance.my_modal_content = 'Data not saved, Check if key already present !';
      // console.log("ERROR")
    }
    );

  }

  imageSrc = 'assets/ai.png'

  constructor(private mlsrvcService: MlsrvcService, private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {

  }



}
