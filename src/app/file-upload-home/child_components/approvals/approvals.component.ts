import { Component, OnInit } from '@angular/core';

import { FileUploadService } from 'src/app/fileUploadService/file-upload.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
})
export class ApprovalsComponent implements OnInit {
  listApprovalsActive: boolean = true;
  DataForListOfApprovals: any;
  DataForListOfApprovalsHistory: any;
  id_user: number = 0;
  org_id: number = 0;
  userID: string = '';

  DataForUserUploadDetails: any;
  reciever_id_user: any;
  reciever_org_id: any;
  reciever_userID: any;
  openViewCard: boolean = false;
  ViewButtonmessage: string = 'View More';
  selectedCardIndex: number = -1;

  displayContent: boolean = false;
  srcUrl: any;
  fileSize: any;
  constructor(
    private http: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.listApprovalsActive = true;
    this.getApprovalsListDetails();
  }
  getApprovalsListDetails() {
    this.reciever_id_user = 2;
    this.reciever_org_id = 2;
    this.reciever_userID = 'tcs';
    let body = {
      id_user: this.reciever_id_user,
      org_id: this.reciever_org_id,
      user_id: this.reciever_userID,
    };

    this.http.getUserUploadForFeedback(body).subscribe((res: any) => {
      this.DataForListOfApprovals = res.filter(
        (item: any) => item.feedback.user_feedback === null
      );
      console.log(this.DataForListOfApprovals);

      this.DataForListOfApprovalsHistory = res.filter(
        (item: any) => item.feedback.user_feedback !== null
      );
      console.log(this.DataForListOfApprovalsHistory);
    });
  }
  ViewCard(index: any) {
    console.log(index);

    this.openViewCard = true;
    this.ViewButtonmessage = 'View less';
    this.selectedCardIndex = index;
    this.srcUrl=''
    this.displayContent = false;
    // this.openViewCard=!this.openViewCard;
  }
  ViewLessCard(index: any) {
    this.openViewCard = false;
    this.ViewButtonmessage = 'View More';
    this.selectedCardIndex = index;
  }
  downLoadPriview(userUploadData: any, index: any) {
    console.log(userUploadData);
    console.log(userUploadData.file_type);

    console.log(this.srcUrl);
    if (this.selectedCardIndex == index) {
      if (
        userUploadData.file_type === 'video' ||
        userUploadData.file_type === 'audio' ||
        userUploadData.file_type === 'image'
      ) {
        const basePath = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.http.urlString
        );

        // Assuming 'userUploadData?.file_path' is a dynamic path that needs to be sanitized
        const filePath = this.sanitizer.bypassSecurityTrustResourceUrl(
          userUploadData?.file_path
        );

        // Concatenate the sanitized base path and file path
        this.srcUrl = `${basePath}/${filePath}`;
        if ( userUploadData.file_type === 'video' ) {
          this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`;
        }else if(userUploadData.file_type === 'image'){
          this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`;
        }
        else if(userUploadData.file_type === 'audio'){
          this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`}
        

        console.log(this.srcUrl);
        
        this.displayContent = !this.displayContent;
      } else {
        const link = document.createElement('a');
        this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`;
        link.href = this.srcUrl;
        link.target = '_self'; // Open the link in a new tab/window, optional
        link.click();
      }
    }

    // Create a hidden anchor element
  }

  openListofApprovals() {
    this.listApprovalsActive = true;
  }
  openApprovalHistory() {
    this.listApprovalsActive = false;
  }
}
