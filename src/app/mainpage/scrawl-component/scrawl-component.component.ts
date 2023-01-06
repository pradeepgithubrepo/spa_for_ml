import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MlsrvcService } from 'src/app/mlsrvc.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-scrawl-component',
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
      <div class="col-md-4 mb-12">
        <img [src]="imageSrc"/>
      </div> 
      <div class="col-md-4 mb-12"></div>
    </div>
    <div class="row">
    <div class="col-md-4 mb-12"></div>
    <div class="col-md-4 mb-12">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <formly-form
          [form]="form"
          [model]="model"
          [fields]="fields">
        </formly-form>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
       <button class="btn btn-primary" type="submit">
          Submit
        </button>

        <button class="btn btn-danger" type="reset" >
          Reset
        </button>
      </form>
    </div>
    <div class="col-md-4 mb-12"></div>
   <div>
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
export class ScrawlComponentComponent implements OnInit {

  imageSrc = 'assets/ai.png'
  constructor(private mlsrvcService: MlsrvcService, private spinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
  }
  spinnercontent = "Processing!!!"
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'source',
      type: 'select',
      props: {
        label: 'source',
        required: true,
        placeholder: 'Select a Source!!',
        options: [
          { label: 'Azure ADLS', value: 'adls' },
          { label: 'Database', value: 'db' },
          { label: 'On Premise', value: 'onprem' },
        ],
      },
    },
    {
      key: 'adlsStorageaccount',
      type: 'input',
      props: {
        label: 'ADLS Storage Account',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "db" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'adlsStoragekey',
      type: 'input',
      props: {
        label: 'ADLS Storage Key',
        required: true,
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "db" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'adlsBlobContainer',
      type: 'input',
      props: {
        label: 'ADLS Blob Container',
        required: true,
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "db" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'adlsSrcDir',
      type: 'input',
      props: {
        label: 'ADLS Source Directory',
        required: true,
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "db" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'dbConnection',
      type: 'input',
      props: {
        label: 'DB Connection String',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "adls" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'dbUserName',
      type: 'input',
      props: {
        label: 'DB Username',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "adls" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'dbPassword',
      type: 'input',
      props: {
        label: 'DB Password',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "adls" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
    {
      key: 'database',
      type: 'input',
      props: {
        label: 'Database',
      },
      expressions: {
        hide: (field: FormlyFieldConfig) => {
          return (field.model?.source === "adls" || !field.model?.source || field.model?.source === "onprem");
        },
      },
    },
  ];

  onSubmit() {
    this.spinnerService.show();
    this.spinnercontent = "Invoking Remote Databricks job....."
    var postdata = { "job_id": "680370067631383", "notebook_params": { "SourceDirectory": "nlp-poc/SourceFiles/json" } }
    var formData: any = new FormData();
    formData.append('postdata', JSON.stringify(postdata))
    this.mlsrvcService.invokeadb(formData).subscribe(data => {
      console.log("View data -> " + JSON.stringify(data))
      this.spinnerService.hide();
    })
  }


}
