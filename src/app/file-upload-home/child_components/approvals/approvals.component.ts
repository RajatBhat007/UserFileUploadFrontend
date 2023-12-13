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
  openSubmitFeedbackPopup:boolean=false;
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
  selectedWellGroomedRating: any=0;
  selectedConfidenceLevelRating:any=0;
  selectedSubjectKnowledgeRating:any=0;
  writeFeeback:string='';
  role_id: any;
  id_type: any;
  id_value: any;
  constructor(
    private http: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.listApprovalsActive = true;
    this.openSubmitFeedbackPopup=false;
    let body={
      id_user:this.http.id_user_FromQueryparams,
      user_id: this.http.userID_FromQueryparams,
      org_id: this.http.org_id_FromQueryparams
    }
    this.http.getIDRole(body).subscribe((res:any)=>{
      console.log(res);
      this.role_id=res.level1_role_id?res.level1_role_id:res.RoleID ;

      

    })
    
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
    
      if (this.role_id==3) {
        console.log(this.role_id);
        
        const res: any = await this.http.getUserUploadForFeedback(body).toPromise();
        this.DataForListOfApprovals = res.filter(
          (item: any) => item.feedback.user_feedback === null
        );
        console.log(this.DataForListOfApprovals);
    
        this.DataForListOfApprovalsHistory = res.filter(
          (item: any) => item.feedback.user_feedback !== null
        );
        console.log(this.DataForListOfApprovalsHistory);
  
      }
      else {
        const res: any = await this.http.getuseruploadforRTMfeedback(body).toPromise();
        this.DataForListOfApprovals = res.filter(
          (item: any) => item.feedback.user_feedback === null
        );
        console.log(this.DataForListOfApprovals);
    
        this.DataForListOfApprovalsHistory = res.filter(
          (item: any) => item.feedback.user_feedback !== null
        );
        console.log(this.DataForListOfApprovalsHistory);
  
      }
   

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
    this.selectedWellGroomedRating=0;
    this.selectedConfidenceLevelRating=0;
    this.selectedSubjectKnowledgeRating=0;
    this.writeFeeback='';
    // this.openViewCard=!this.openViewCard;
  }
  ViewLessCard(index: any) {
    this.openViewCard = false;
    this.ViewButtonmessage = 'View More';
    this.selectedCardIndex = index;
    this.selectedWellGroomedRating=0;
    this.selectedConfidenceLevelRating=0;
    this.selectedSubjectKnowledgeRating=0;
    this.writeFeeback='';
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

  giveRatingWellGroomed(index:any){
    console.log(index);
    this.selectedWellGroomedRating=index; 
  }
  giveRatingConfidenceLevel(index:any){
    console.log(index);
    this.selectedConfidenceLevelRating=index;
  }
  giveRatingSubjectKnowledge(index:any){
    console.log(index);
    this.selectedSubjectKnowledgeRating=index;
  }


  async submitFeedback(data: any) {
    try {
      console.log("Clicked", data);
      this.id_value=this.http.id_user_FromQueryparams + "/" + this.http.org_id_FromQueryparams + "/" +  this.http.userID_FromQueryparams;
      if (this.role_id==3) {
        this.id_type= "RM";

      } else {
        this.id_type= "rtm";
      }
      let body = {
        "id_type":  this.id_type,
        "id_value":  this.id_value,
        "id_userdetailslog": data?.id_userdetailslog,
        // "receivers_id_user": this.http.id_user_FromQueryparams,
        // "receiver_org_id": this.http.org_id_FromQueryparams,
        // "receiver_user_id": this.http.userID_FromQueryparams,
        "feedback": this.writeFeeback,
        "rating":1,
        "Well_Groomed": this.selectedWellGroomedRating,
        "Confidence_level":this.selectedConfidenceLevelRating,
        "subject_knowledge":this.selectedSubjectKnowledgeRating,
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
  openSubmitFeedBack(){
    this.openSubmitFeedbackPopup=true;
    
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
