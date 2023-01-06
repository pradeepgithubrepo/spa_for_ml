import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MlsrvcService {

  constructor(private http: HttpClient) { }

  processml(postData: any) {
    for (var key of postData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    // var processdata = JSON.stringify(postData);
    // var formData = new FormData();
    // formData.append("postData", postData);
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/process', postData)
  };

  getfilelist() {
    return this.http.get<any>('http://pradeep.southindia.cloudapp.azure.com:5000/listfiles')
  };


  getprocessfile(postData: any) {
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/getprocessfile', postData)
  };

  updateprocessfile(postData: any) {
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/updprocessfile', postData)
  };

  getcdmkeys(postData: any) {
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/getcdmkeylist', postData)
  };

  invokeadb(postData: any) {
    return this.http.post<any>('http://pradeep.southindia.cloudapp.azure.com:5000/invokeadb', postData)
  };

}
