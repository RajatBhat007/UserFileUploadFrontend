import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/fileUploadService/file-upload.service';

@Component({
  selector: 'app-mobile-user-upload',
  templateUrl: './mobile-user-upload.component.html',
  styleUrls: ['./mobile-user-upload.component.scss']
})
export class MobileUserUploadComponent implements OnInit {
  subCategoryData: any;
  sub_typeFile: any;
  submitBtnDisabled: boolean = true;
  fileContext: any;
  sub_type: any;
  id_user: any;
  org_id: any;
  userID: any;
  inputMessage: string = '';
  receivers_id_user: any;
  uploadedFileName: any;
  fileName: any;
  file: any;

  receiver_org_id: any;
  receiver_user_id: any;
  successMessage: any = 'Something Went Wrong!!!';
  DataForUserUploadDetails: any;
  openViewCard: boolean = false;
  selectedCardIndex: number = -1;
  displayContent: boolean = false;
  srcUrl: any;
  managerData: any;
  managerUserid: any;
  managerIDuser: any;
  managerOrgId: any;
  role_id: any;
  userFirstName: any;
  userlastName: any;
  Managername: any;
  rtmUserid: any;
  rtmIDuser: any;
  rtmName: any;
  rtm_id_user: any;
  rtm_user_id: any;
  rtm_org_id: number = 0;
  fileType: any;
  fileSize: any;
  OpenAudioRecoder:boolean=false;
  constructor(private http: FileUploadService) {

  }


  UploadStatusMobile: any;
  contextData: any;
  contextName: any;
  orgId: any;

  openUploadStatus() {
    this.newUploadActive = false;
    this.isSubCategoryDataHere = true;
  }
  newUploadActive: boolean = true;
  opennewUpload() {
    this.newUploadActive = true;
  }
  contentUploadedMobile: boolean = false;
  fileTypeMobile: any;
  fileNameMobile: any;
  fileSizeMobile: any;
  data: any;
  dataFileType: any;
  demoMessage: string = ''
  dataFilesize: any;
  isSubCategoryDataHere: any;

  file1: any;
  ngOnInit(): void {

    this.getContextData();
    let body = {
      id_user: this.http.id_user_FromQueryparams,
      user_id: this.http.userID_FromQueryparams,
      org_id: this.http.org_id_FromQueryparams
    }

    console.log(this.role_id)
    this.http.getIDRole(body).subscribe((res: any) => {
      console.log(res);
      this.role_id = res.level1_role_id ? res.level1_role_id : res.RoleID;
      if (this.role_id == 1 || this.role_id == 2) {
        this.getManagerList()

      }


    })





  }

  async getContextData() {
    try {
      this.orgId = this.http.org_id_FromQueryparams;
      this.contextData = await this.http.getContext(this.orgId).toPromise();
      console.log(this.contextData);
    } catch (error) {
      console.error('Error fetching context data:', error);
    }
  }


  async getContextType(context: any) {
    try {
      console.log(context);
      this.contextName = context?.context;
      console.log(this.contextName);

      // Call Sub Category Here
      const res: any = await this.http.getSubCategory(this.contextName).toPromise();
      console.log(res);
      this.subCategoryData = res;

      if (this.subCategoryData) {
        this.isSubCategoryDataHere = false;
      }
    } catch (error) {
      console.error('Error fetching subcategory data:', error);
    }
  }

  getContextSubType(contextsubType: any) {
    console.log(contextsubType);
    this.sub_typeFile = contextsubType?.subtype;
    if (this.sub_typeFile) {
      this.submitBtnDisabled = false;
    }

  }

  handleFileInputMobileNew(event: any): void {
    console.log(event);

    this.file1 = event.target.files[0];
    console.log(this.file1)

    // Get the first selected file
    if (this.file1) {
      // Get file type
      this.contentUploadedMobile = true;
      this.fileTypeMobile = this.file1.type;

      // Get file name
      this.fileNameMobile = this.file1.name;

      // Get file size
      this.fileSizeMobile = this.formatFileSize(this.file1.size);
    }
  }
  private formatFileSize(size: number): string {
    const fileSizeInBytes = size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    return fileSizeInKB.toFixed(2) + ' KB';
  }
  showCardData() {
    this.data = this.fileNameMobile;
    this.dataFileType = this.fileTypeMobile;
    this.dataFilesize = this.fileSizeMobile;

    console.log(this.data)
  }
  async getManagerList() {
    try {
      let body = {
        id_user: this.http.id_user_FromQueryparams,
        user_id: this.http.userID_FromQueryparams,
        org_id: this.http.org_id_FromQueryparams
      };

      const res: any = await this.http.getManager(body).toPromise();

      this.managerData = res;

      console.log(this.managerData);

      this.Managername = this.managerData?.level3_firstname + " " + this.managerData?.level3_lastname;
      this.managerUserid = this.managerData?.level3_user_id;
      this.managerIDuser = this.managerData?.level3_id_user;
      this.rtmUserid = this.managerData?.level4_user_id;
      this.rtmIDuser = this.managerData?.level4_id_user;
      console.log(this.rtmIDuser);

      this.rtmName = this.managerData?.level4_firstname + " " + this.managerData?.level4_lastname;
      this.managerOrgId = this.http.org_id_FromQueryparams;
      this.userFirstName = this.managerData?.user_firstname;
      this.userlastName = this.managerData?.user_lastname;
    } catch (error) {
      console.error('Error in getManagerList:', error);
      // Handle the error as needed
    }
  }

  async postUploadedData(fileName: any) {
    try {
      console.log(fileName);

      this.fileContext = this.contextName;
      this.sub_type = this.sub_typeFile;
      this.id_user = this.http.id_user_FromQueryparams;
      this.org_id = this.http.org_id_FromQueryparams;
      this.userID = this.http.userID_FromQueryparams;

      this.inputMessage = this.demoMessage;
      this.receivers_id_user = this.managerIDuser;
      this.uploadedFileName = this.fileName;
      this.receiver_org_id = this.managerOrgId;
      this.receiver_user_id = this.managerUserid;


      console.log(this.uploadedFileName);

      let body = {
        file_context: this.contextName,
        sub_type: this.sub_typeFile,
        id_user: this.http.id_user_FromQueryparams,
        org_id: this.org_id,
        user_id: this.userID,
        user_message: this.demoMessage,
        receivers_id_user: this.receivers_id_user,
        uploadedFileName: this.uploadedFileName,
        receiver_org_id: this.receiver_org_id,
        receiver_user_id: this.receiver_user_id,
        user_firstname: this.userFirstName,
        user_lastname: this.userlastName
      };

      console.log(body);

      console.log(this.fileContext, this.sub_type);
      console.log(this.file1);

      const res: any = await this.http.postUserUpload(body, this.file1).toPromise();

      console.log(res);
      this.successMessage = res.message;
    } catch (error) {
      console.error('Error posting user upload:', error);
    }
  }

  async postRTMuseruploadapi(fileName: any) {
    try {
      console.log(fileName);
      this.fileContext = this.contextName;
      this.sub_type = this.sub_typeFile;
      this.id_user = this.http.id_user_FromQueryparams;
      this.org_id = this.http.org_id_FromQueryparams;
      this.userID = this.http.userID_FromQueryparams;

      this.inputMessage = this.demoMessage;
      this.uploadedFileName = this.fileName;
      this.rtm_id_user = this.rtmIDuser;
      this.rtm_user_id = this.rtmUserid;
      this.rtm_org_id = this.managerOrgId;
      console.log(this.uploadedFileName);

      let body = {
        file_context: this.contextName,
        sub_type: this.sub_typeFile,
        id_user: this.http.id_user_FromQueryparams,
        org_id: this.org_id,
        user_id: this.userID,
        user_message: this.demoMessage,
        uploadedFileName: this.uploadedFileName,
        user_firstname: this.userFirstName,
        user_lastname: this.userlastName,
        rtm_id_user: this.rtm_id_user,
        rtm_user_id: this.rtm_user_id,
        rtm_org_id: this.rtm_org_id,
      };

      console.log(body);

      console.log(this.fileContext, this.sub_type);
      console.log(this.file);

      const res: any = await this.http.postRTMuseruploadapi(body, this.file1).toPromise();

      console.log(res);
      this.successMessage = res.message;
    } catch (error) {
      console.error('Error posting user upload:', error);
    }
  }



  async getUserUploadDetails() {
    try {
      this.id_user = this.http.id_user_FromQueryparams;
      this.org_id = this.http.org_id_FromQueryparams;
      this.userID = this.http.userID_FromQueryparams;

      let body = {
        id_user: this.id_user,
        org_id: this.org_id,
        user_id: this.userID,
      };

      const res: any = await this.http.getUserUploadDatails(body).toPromise();

      console.log(res);
      this.DataForUserUploadDetails = res;
    } catch (error) {
      console.error('Error fetching user upload details:', error);
    }
  }
  downLoadPriview(userUploadData: any, index: any) {
    console.log(userUploadData);
    console.log(userUploadData.file_type);

    // Concatenate the sanitized base path and file path

    console.log(this.srcUrl);
    // removeComment after https applied
    if (this.selectedCardIndex == index) {
      if (userUploadData.file_type === 'video' || userUploadData.file_type === 'audio' || userUploadData.file_type === 'image') {
        const basePath = this.http.urlString;

        // Assuming 'userUploadData?.file_path' is a dynamic path that needs to be sanitized
        const filePath = userUploadData?.file_path;

        // Concatenate the sanitized base path and file path
        this.srcUrl = `${basePath}/${filePath}`;
        this.displayContent = !this.displayContent;
      }
      else {
        const link = document.createElement('a');
        this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`;
        link.href = this.srcUrl;
        link.target = '_blank'; // Open the link in a new tab/window, optional
        link.click();

      }
    }

    // Create a hidden anchor element
  }
  ViewCard(index: any) {
    console.log(index);
    this.srcUrl = ''
    this.displayContent = false;
    this.openViewCard = true;
    // this.ViewButtonmessage = 'View less';
    this.selectedCardIndex = index;

    // this.openViewCard=!this.openViewCard;
  }
  ViewLessCard(index: any) {
    this.openViewCard = false;
    // this.ViewButtonmessage = 'View More';
    this.selectedCardIndex = index;
  }
  closeSubmitBtn() {
    window.location.reload();
  }
  openAudioRecorderModal(){
    this.OpenAudioRecoder=true;
  }
  closeAudio(){
    this.OpenAudioRecoder=false;
  }
  handleAudioUpload(audioData: any) {
    this.contentUploadedMobile = true;
    console.log(audioData);
    const file = new File(
      [audioData],
      `captured_audio_${new Date().getTime()}.mp3`,
      { type: 'audio/mp3' }
    );
    console.log('Received audioData data:', audioData);
    this.file1 = file;
  
    const imageName = `captured_audio_${new Date().getTime()}.mp3`;
    this.fileNameMobile = imageName;
    this.fileTypeMobile = this.file1.type;
    // Get file size
    this.fileSizeMobile = this.formatFileSize(this.file1.size);
    this.data = this.fileNameMobile;
    this.dataFileType = this.fileTypeMobile;
    this.dataFilesize = this.fileSizeMobile;
    console.log(this.data);
    console.log(this.dataFileType);
    console.log(this.dataFilesize);
    
    
  }

}
