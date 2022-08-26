import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MlsrvcService {

  constructor(private http: HttpClient) { }

  processml(postData: any) {
    console.log(postData)
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/process', postData)
  };

}
