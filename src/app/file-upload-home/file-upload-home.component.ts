import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../fileUploadService/file-upload.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload-home',
  templateUrl: './file-upload-home.component.html',
  styleUrls: ['./file-upload-home.component.scss']
})
export class FileUploadHomeComponent implements OnInit {
  constructor(public http:FileUploadService){}

  isActiveTabUserUpload:boolean=true;
  isActiveTabApproval:boolean=false;

  ngOnInit(): void {
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
