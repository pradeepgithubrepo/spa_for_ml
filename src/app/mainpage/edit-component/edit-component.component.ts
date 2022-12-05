import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel, FormArray, FormBuilder } from '@angular/forms';
import { MlsrvcService } from 'src/app/mlsrvc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-component',
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
    <div class="col-md-2 mb-12"></div>
    <div class="col-md-4 mb-12">
      <ngb-alert [dismissible]="false">
    Source File name : <br/>
    <strong>{{srcfile}}</strong>
  </ngb-alert>
    </div>
    <div class="col-md-4 mb-12">
        <ngb-alert [dismissible]="false">
    Target CDM Table : <br/>
    <strong>{{cdmtable}}</strong>
  </ngb-alert>
    </div>
      <div class="col-md-2 mb-12"></div>
    </div>


    <br/>
    <br/>
    
    <div class="row" *ngIf="warmup == 1">
<div class="col-md-12 mb-12">
<form [formGroup]="mappingGroup" class="row justify-content-center" (ngSubmit)="onSubmit()">
  <table class="form-group">
    <tr>
              <th scope="col">#</th>
              <th scope="col">SourceKey</th>
              <th scope="col">CDMKey</th>
              <th scope="col">Confidence Level</th>
              <th scope="col">Mapping Status</th>
              <th scope="col">Target DataType</th>
              <th scope="col">Target Transformation</th>
    </tr>
    <tbody formArrayName="Rows">
      <tr
        *ngFor="let obj of formArr.controls; let i = index; let l = last"
        [formGroupName]="i">
        <th scope="row">{{ i + 1 }}</th>
        <td>
          <input
            type="textarea"
            class="form-control"
            id="sourcekey"
            formControlName="sourcekey"
          />
        </td>
        <td>
        <div *ngIf='obj.value.comment == "Mapping confirmed"' >
          <input
            type="text"
            class="form-control"
            id="cdm_key"
            formControlName="cdm_key"
          />
        </div>
        <div *ngIf='obj.value.comment !== "Mapping confirmed"' >
            
          <select formControlName="cdm_key" class="form-control">  
                <option><b>Select CDM Key</b></option>  
                <option *ngFor="let web of validcdmcols">{{web}}</option>  
          </select>  
        </div>
        </td>
        <td>
          <input
            type="text"
            class="form-control"
            id="cosine_quotient"
            formControlName="cosine_quotient"
          />
        </td>
        <td>
          <input
            type="textarea"
            class="form-control"
            id="comment"
            formControlName="comment"
          />
        </td>
        <td>
          <input
            [readonly]="true" 
            type="label"
            class="form-control"
            id="stagdatatype"
            formControlName="stagdatatype"
          />
        </td>
        <td>

                  <select formControlName="stagtransform" class="form-control">  
                <option><b>{{obj.value.stagtransform}}</b></option>  
                <option *ngFor="let a of transformlist">{{a}}</option>  
          </select>   


        </td>
        <td>
          <button
            (click)="deleteRow(i)"
            class="btn btn-danger">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
     
  <div class="col-md-5 mb-12"> </div>

  <div class="col-md-7 mb-12">
     <br/>
  <button type="button" (click)="addNewRow()" class="btn btn-dark">
    Add new Row
  </button>
  <button type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>

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

export class EditComponentComponent implements OnInit {
  processdata = [{ "sourcekey": "sourcekey", "cdm_key": "cdm_key", "cosine_quotient": "cosine_quotient", "comment": "comment", "stagdatatype": "stagdatatype", "stagtransform": "stagtransform" }]
  processedfilename: String = "";
  rawcols: String = ""
  srcfile: String = ""
  cdmtable: String = ""
  spinnercontent = "Processing!!!"
  warmup = 0
  validcdmcols = ["meternum", "accountnumer", "goldernumber"]
  transformlist = ["trim", "lower", "upper", "concat", "abs", "ceil", "floor", "round", "dayofmonth", "year", "month", "second", "hour", "todate", "trunc"]

  constructor(private mlsrvcService: MlsrvcService, private spinnerService: NgxSpinnerService,
    private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute
  ) {
    this.createMappingGroup(); // init form data
  }

  mappingGroup!: FormGroup;

  createMappingGroup() {
    this.mappingGroup = this.formBuilder.group({
      Rows: this.formBuilder.array([]),
    });
  }

  get formArr() {
    return this.mappingGroup.get('Rows') as FormArray;
  }

  initRows() {
    console.log("Constructor invoked")
    return this.formBuilder.group({
      sourcekey: ['sourcekey'],
      cdm_key: ['cdm_key'],
      cosine_quotient: ['cosine_quotient'],
      comment: ['comment'],
      stagdatatype: ['stagdatatype'],
      stagtransform: ['stagtransform']
    });
  }

  public getprocessfileinfo(filename: String): void {
    this.warmup = 0
    var postdata = { "filename": filename }
    var formData: any = new FormData();
    formData.append('postdata', JSON.stringify(postdata))
    this.mlsrvcService.getprocessfile(formData).subscribe(data => {
      this.warmup = 1
      this.spinnerService.hide();
      console.log("full")
      const processjson = JSON.parse(data)[0]
      this.srcfile = processjson['filename']
      console.log(this.srcfile)
      this.cdmtable = processjson['cdmtable']
      console.log(this.cdmtable)
      // console.log(JSON.parse(processjson['res']))
      this.processdata = JSON.parse(processjson['res'])
      console.log(this.processdata)
      this.loaddata()

      postdata = { "filename": this.cdmtable }
      var formData: any = new FormData();
      formData.append('postdata', JSON.stringify(postdata))
      this.mlsrvcService.getcdmkeys(formData).subscribe(data => {
        const cdmkeys = data
        this.validcdmcols = cdmkeys.split(',');
      })
    }, err => {

    }
    );

  }

  loaddata() {
    this.processdata.forEach((row) => {
      console.log("Each row", row)
      this.formArr.push(this.addRow(row));
    });
  }

  addRow(obj: any) {
    return this.formBuilder.group({
      sourcekey: [obj.sourcekey],
      cdm_key: [obj.cdm_key],
      cosine_quotient: [obj.cosine_quotient],
      comment: [obj.comment],
      stagdatatype: [obj.stagdatatype],
      stagtransform: [obj.stagtransform]
    });
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  onSubmit() {
    console.log('Your form data : ', this.mappingGroup.value['Rows']);
    this.spinnerService.show();
    this.spinnercontent = "Persisting user preference for " + this.processedfilename + " ...."
    var postdata = { "filename": this.processedfilename, "userdata": this.mappingGroup.value['Rows'] }
    var formData: any = new FormData();
    formData.append('postdata', JSON.stringify(postdata))
    this.mlsrvcService.updateprocessfile(formData).subscribe(data => {
      console.log("View data -> " + JSON.stringify(data))
      this.spinnerService.hide();
    })
  }

  imageSrc = 'assets/ai.png'

  addNewRow() {
    let obj1 = {
      sourcekey: 'sourcekey',
      cdm_key: 'cdm_key',
      cosine_quotient: 'cosine_quotient',
      comment: 'comment',
      stagdatatype: 'stagdatatype',
      stagtransform: 'stagtransform'
    };
    this.formArr.push(this.addRow(obj1));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.processedfilename = params['processedfilename']
      console.log("cool", this.processedfilename);
      this.getprocessfileinfo(this.processedfilename);
    });
  }

}
