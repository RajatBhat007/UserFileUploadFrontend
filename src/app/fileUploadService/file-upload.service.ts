import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {


  constructor(private Http:HttpClient) { }

  urlString="http://3.109.140.126";
  fileData:any;
  videoContentUploaded:boolean=false;
  openVideo:boolean=false;
  

  getContext(data:any){
    var tempurl=`${this.urlString}/getAllContexts?org_id=${data}`;
    return this.Http.get(tempurl,data)
  }
  getSubCategory(data:any){
    var tempurl=`${this.urlString}/getSubtypesByContext?context=${data}`;
    return this.Http.get(tempurl,data)
  }
  postUserUpload(data:any,file:any){
  
    console.log('fileData',this.fileData);
    console.log('file',file)
    const formData= new FormData();
    // formData.append('file',file?file:this.fileData)
    formData.append('file', file);

    formData.append('user_message',data.user_message)
     var tempurl=`${this.urlString}/useruploadapi?id_user=${data.id_user}&org_id=${data.org_id}&user_id=${data.user_id}&receivers_id_user=${data.receivers_id_user}&receiver_org_id=${data.receiver_org_id}&receiver_user_id=${data.receiver_user_id}&file_context=${data.file_context}&sub_type=${data.sub_type}`;
    return this.Http.post(tempurl,formData)
  }
  getUserUploadDatails(data:any){
    console.log(data)
    var tempurl=`${this.urlString}/getUserUploadDetails?id_user=${data.id_user}&org_id=${data.org_id}&user_id=${data.user_id}`
    return this.Http.get(tempurl)
  }

getUserUploadForFeedback(data:any){
  console.log(data)
  var tempurl = `${this.urlString}/getuserupload/${data.id_user}/${data.org_id}/${data.user_id}`
  console.log(tempurl);
    
    return this.Http.get(tempurl,data)

}

searchmanager(data:any){
  var tempurl=`https://www.m2ost.in/M2OST_Console_PriME/api/KPI/UserSearchAPI?SearchString=${data}`
  return this.Http.post(tempurl,data)

}


}
