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
  successMessage:string='Something went wrong!!!'

  displayContent: boolean = false;
  srcUrl: any;
  fileSize: any;
  id_user_FromQueryparams: any;
  org_id_FromQueryparams: any;
  userID_FromQueryparams: any;
  selectedRating: any=0;
  writeFeeback:string='';
  constructor(
    private http: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.listApprovalsActive = true;
    this.getApprovalsListDetails();
  
    
  }
  async getApprovalsListDetails() {
    try {
      this.id_user = this.http.id_user_FromQueryparams;
      this.org_id = this.http.org_id_FromQueryparams;
      this.userID = this.http.userID_FromQueryparams;
  
      let body = {
        id_user: this.id_user,
        org_id: this.org_id,
        user_id: this.userID,
      };
  
      const res: any = await this.http.getUserUploadForFeedback(body).toPromise();
  
      this.DataForListOfApprovals = res.filter(
        (item: any) => item.feedback.user_feedback === null
      );
      console.log(this.DataForListOfApprovals);
  
      this.DataForListOfApprovalsHistory = res.filter(
        (item: any) => item.feedback.user_feedback !== null
      );
      console.log(this.DataForListOfApprovalsHistory);
    } catch (error) {
      console.error('Error fetching approvals list details:', error);
    }
  }
  
  ViewCard(index: any) {
    console.log(index);

    this.openViewCard = true;
    this.ViewButtonmessage = 'View less';
    this.selectedCardIndex = index;
    this.srcUrl=''
    this.displayContent = false;
    this.selectedRating=0;
    // this.openViewCard=!this.openViewCard;
  }
  ViewLessCard(index: any) {
    this.openViewCard = false;
    this.ViewButtonmessage = 'View More';
    this.selectedCardIndex = index;
    this.selectedRating=0;
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
  giveRating(index:any){
    console.log(index);
    // if(this.openViewCard && index === this.selectedRating){
      this.selectedRating=index;
    // }
 

  }
  async submitFeedback(data: any) {
    try {
      console.log("Clicked", data);
  
      let body = {
        "id_userdetailslog": data?.id_userdetailslog,
        "receivers_id_user": this.http.id_user_FromQueryparams,
        "receiver_org_id": this.http.org_id_FromQueryparams,
        "receiver_user_id": this.http.userID_FromQueryparams,
        "feedback": this.writeFeeback,
        "rating": this.selectedRating,
        "file_context": data?.file_context,
        "sub_type": data?.sub_type
      };
  
      const res: any = await this.http.postFeedBack(body).toPromise();
  
      console.log(res);
      this.successMessage = 'Submitted Feedback Successfully!!!';
  
    
  
      // this.getApprovalsListDetails();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }
  

  openListofApprovals() {
    this.listApprovalsActive = true;
  }
  openApprovalHistory() {
    this.listApprovalsActive = false;
  }
  submittedPopUP(){
    this.getApprovalsListDetails();
    this.openViewCard=false;
    // window.location.reload();
  }
}
