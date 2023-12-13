import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../fileUploadService/file-upload.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload-home',
  templateUrl: './file-upload-home.component.html',
  styleUrls: ['./file-upload-home.component.scss']
})
export class FileUploadHomeComponent implements OnInit {
  role_id: any;
  showForBelowRole: boolean=true;
  constructor(public http:FileUploadService){}

  isActiveTabUserUpload:boolean=false;
  isActiveTabApproval:boolean=false;

  ngOnInit(): void {
   this.getIDRole();
    }
    async getIDRole() {
      try {
        let body = {
          id_user: this.http.id_user_FromQueryparams,
          user_id: this.http.userID_FromQueryparams,
          org_id: this.http.org_id_FromQueryparams
        };
    
        const res: any = await this.http.getIDRole(body).toPromise();
    
        console.log(res);
        this.role_id=res.level1_role_id?res.level1_role_id:res.RoleID ;
        console.log(this.role_id)
        if(this.role_id==3 ||this.role_id==4){
          this.showForBelowRole=false;
          this.isActiveTabApproval=true;

        }
        else {
          this.showForBelowRole=true;
          this.isActiveTabUserUpload=true;


        }
      } catch (error) {
        console.error('Error in getIDRole:', error);
        // Handle the error as needed
      
        console.log(this.role_id);
      }
    }
    
    activeUserUpload(){
      this.isActiveTabUserUpload=true;
      this.isActiveTabApproval=false;
    }
    activeApprovals(){
      this.isActiveTabUserUpload=false;
      this.isActiveTabApproval=true;
    }
}
