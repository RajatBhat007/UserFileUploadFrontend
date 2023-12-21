import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  id_user_FromQueryparams: any;
  org_id_FromQueryparams: any;
  userID_FromQueryparams: any;
  params: any;

  constructor(private Http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.id_user_FromQueryparams = params['id_user'];
      this.org_id_FromQueryparams = params['org_id'];
      this.userID_FromQueryparams = params['userID'];
    });



  }



  //urlString="http://3.109.140.126";

  //Production
  //  urlString="https://connectopia.app:8080"

  //beta
  urlString = "https://www.connectopia.app:2000"


  fileData: any;
  videoContentUploaded: boolean = false;
  openVideo: boolean = false;
  newOrgId: any;

  getIDRole(data: any) {
    var tempurl = `${this.urlString}/getRoleDetails`
    console.log(tempurl);

    return this.Http.post(tempurl, data)
  }

  getContext(data: any) {
    var tempurl = `${this.urlString}/getAllContexts?org_id=${data}`;
    return this.Http.get(tempurl, data)
  }
  getSubCategory(data: any) {
    var tempurl = `${this.urlString}/getSubtypesByContext?context=${data}&org_id=${this.org_id_FromQueryparams}`;
    return this.Http.get(tempurl, data)
  }
  postUserUpload(data: any, file: any) {

    console.log('fileData', this.fileData);
    console.log('file', file)
    const formData = new FormData();
    // formData.append('file',file?file:this.fileData)
    formData.append('file', file);

    formData.append('user_message', data.user_message)
    var tempurl = `${this.urlString}/useruploadapi?id_user=${data.id_user}&org_id=${data.org_id}&user_id=${data.user_id}&receivers_id_user=${data.receivers_id_user}&receiver_org_id=${data.receiver_org_id}&receiver_user_id=${data.receiver_user_id}&file_context=${data.file_context}&sub_type=${data.sub_type}&user_firstname=${data.user_firstname}&user_lastname=${data.user_lastname}`;
    return this.Http.post(tempurl, formData)
  }

  postRTMuseruploadapi(data:any,file:any){
    console.log('fileData', this.fileData);
    console.log('file', file)
    const formData = new FormData();
    // formData.append('file',file?file:this.fileData)
    formData.append('file', file);
    formData.append('user_message', data.user_message)
    var tempurl = `${this.urlString}/rmuseruploadapi?id_user=${data.id_user}&org_id=${data.org_id}&user_id=${data.user_id}&rtm_id_user=${data.rtm_id_user}&rtm_org_id=${data.rtm_org_id}&rtm_user_id=${data.rtm_user_id}&file_context=${data.file_context}&sub_type=${data.sub_type}&user_firstname=${data.user_firstname}&user_lastname=${data.user_lastname}`;
    return this.Http.post(tempurl, formData)

  }

  getUserUploadDatails(data: any) {
    console.log(data)
    var tempurl = `${this.urlString}/getUserUploadDetails?id_user=${data.id_user}&org_id=${data.org_id}&user_id=${data.user_id}`
    return this.Http.get(tempurl)
  }

  getUserUploadForFeedback(data: any) {
    console.log(data)
    var tempurl = `${this.urlString}/getuserupload/${data.id_user}/${data.org_id}/${data.user_id}`
    console.log(tempurl);

    return this.Http.get(tempurl, data)
  }
  getuseruploadforRTMfeedback(data: any) {
    console.log(data)
    var tempurl = `${this.urlString}/getuseruploadrtm/${data.id_user}/${data.org_id}/${data.user_id}`
    console.log(tempurl);
    return this.Http.get(tempurl, data)
  }
  postFeedBack(data: any) {
    var tempurl = `${this.urlString}/postFeedbackForFile`
    console.log(tempurl);

    return this.Http.post(tempurl, data)

  }

  getManager(data: any) {
    var tempurl = `${this.urlString}/getManagerDetails`
    console.log(tempurl);

    return this.Http.post(tempurl, data)

  }

  getFeedbackForUser(data:any){
    console.log(data)
    var tempurl = `${this.urlString}/getFeedbackForUser?receivers_id_user=${data.id_user}&receiver_org_id=${data.org_id}&receiver_user_id=${data.user_id}`
    return this.Http.get(tempurl)
  }


}
