import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FileUploadService } from 'src/app/fileUploadService/file-upload.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.scss'],
})
export class UserUploadComponent implements OnInit {
  contextName: any;
  subCategoryData: any;
  isSubCategoryDataHere: boolean = true;
  capturedImageDataUrl: string = '';
  mageHeight: number = 200;
  imageWidth: number = 300;
  webcamImage: any;
  capturedImageName: string = '';
  sizeInKB: string = '';
  videoPreviewUrl: string = '';
  fileContext: any;
  sub_type: any;
  sub_typeFile: any;
  id_user: any = '';
  demoMessage: any = '';
  inputMessage: any = '';
  uploadedFileName: any = '';
  org_id: any = '';
  userID: any;
  receivers_id_user: any;
  receiver_org_id: number = 0;
  receiver_user_id: any;
  rtm_id_user: any;
  rtm_user_id:any;
  rtm_org_id: number = 0;
  DataForUserUploadDetails: any;
  file: any;
  successMessage: any = 'Something Went Wrong!!!';
  ViewButtonmessage: string = 'view More';
  srcUrl: any;
  displayContent: boolean = false;
  fileInput: any;
  id_user_FromQueryparams: any;
  org_id_FromQueryparams: any;
  userID_FromQueryparams: any;
  CameraModal: boolean=false;
  openvideoRecorder: boolean=false;
  submitModalActivated: boolean=false;
  OpenRecoder: boolean=false;
  OpenAudioRecoder:boolean=false;
  openSelectManagerCard: boolean=false;
  disabledSubmitBtn:boolean=true;
  displayuser: boolean=false;
  managerData: any;
  managerUserid: any;
  managerIDuser: any;
  rtmUserid:any;
  rtmIDuser:any;
  rtmName:any;
  managerOrgId: any;
  Managername: any;
  firstName: any;
  userFirstName: any;
  userlastName: any;
  role_id: any;
  OpenAudioRecoderWeb:boolean=false;
  loader: boolean=true;

  constructor(
    public http: FileUploadService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public _router: ActivatedRoute,
  ) {}
  @ViewChild('videoElement')
  videoElement!: ElementRef<any>;
  @Input() idRole: any;
  video!: HTMLVideoElement;
  newUploadActive: boolean = true;
  contentUploaded: boolean = false;
  fileName: string = '';
  fileType: any;
  fileSize: any;
  ordId: any;
  contextData: any;
  ClickedUploadButton: boolean = false;
  showWebcam: boolean = false;
  openViewCard: boolean = false;
  searchManger:string='';
  selectedCardIndex: number = -1;
  public isRecording: boolean = false;
  private mediaRecorder: MediaRecorder | undefined;
  public recordedChunks: Blob[] = [];
  submitBtnDisabled:boolean=true;
  contentUploadedMobile:boolean=true;

  // Video Recorder
  modal!: HTMLElement | null;

  startRecordingBtn!: HTMLElement | null;
  stopRecordingBtn!: HTMLElement | null;
  cancelBtn!: HTMLElement | null;
  uploadBtn!: HTMLElement | null;
  recordedVideoPreview!: HTMLVideoElement | null;
  startRecordingVideo: boolean = false;
  location: any;


  listOfManagers=[{
    'name':'Shubham karad',
    'emailId':'shubham.karad12@gmail.com',
    'EmployeeId':'TGC127'
  },
  {
    'name':'Rajat Bhat',
    'emailId':'rajat1995@gmail.com',
    'EmployeeId':'TGC093'

  },
  {
    'name':'Shubham Dhekolkar',
    'emailId':'shubhamd26@gmail.com',
    'EmployeeId':'TGC117'

  }
];
  ngOnInit(): void {
    this.getContextData();
    let body={
      id_user:this.http.id_user_FromQueryparams,
      user_id: this.http.userID_FromQueryparams,
      org_id: this.http.org_id_FromQueryparams
    }
    this.http.getIDRole(body).subscribe((res:any)=>{
      console.log(res);
      this.role_id=res.level1_role_id?res.level1_role_id:res.RoleID ;
      if(this.role_id==1 ||this.role_id==2){
        this.getManagerList()
  
      }
      

    })
    
    this.location = window.location.href
    var url = new URL(this.location)
    console.log(this.idRole)
   
   
    console.log(url);
   
  


  }


  public trigger: Subject<void> = new Subject<void>();
  public videoOptions: MediaTrackConstraints = {
    facingMode: 'environment', // Use 'user' for front camera, 'environment' for rear camera
  };

  public triggerObservable: Observable<void> = this.trigger.asObservable();
  public triggerObservableVideoRecording: Observable<void> =
    this.trigger.asObservable();
  private mediaStream: MediaStream | undefined;

  handleImage(webcamImage: any): void {
    // Handle captured image here
    console.log('Captured image:', webcamImage);
    const imageName = `captured_image_${new Date().getTime()}.png`;

    // Set the captured image data URL for preview
    // if(this.ClickedUploadButton==true)
    this.contentUploaded = true;
    this.capturedImageDataUrl = webcamImage.imageAsDataUrl;
    this.capturedImageName = imageName;
    this.fileType = webcamImage._mimeType;
    this.fileName = this.capturedImageName;
    // Calculate file size
    const binaryData = atob(this.capturedImageDataUrl.split(',')[1]);
    const fileSizeInBytes = binaryData.length;
    // console.log('File Size:', fileSizeInBytes, 'bytes', fileSizeInKB, 'KB', fileSizeInMB, 'MB');
    this.fileSize = this.formatFileSize(fileSizeInBytes);
  }

  captureImage(): void {
    // Trigger image capture
    this.trigger.next();
    this.contentUploaded = false;
  }

  openCamera() {
    this.showWebcam = true;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.mediaStream = stream; // Store the MediaStream
        this.video = this.videoElement.nativeElement;
        this.video.srcObject = stream;
        this.video.play(); // Start playing the video stream
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
    this.capturedImageDataUrl = '';
  }
  openCameraModal(){
    this.CameraModal=true
    this.openvideoRecorder=false}
  openVideoRecorderModal(){
    this.openvideoRecorder=true
    this.CameraModal=false

  }
  openSubmitModal(){
    this.submitModalActivated=true;

  }
  
  closeCamera() {
    this.showWebcam = false; // Set the flag to false to hide the webcam
    this.OpenRecoder=false;

    if (this.mediaStream) {
      // Stop the video stream
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }
  }
  cancelCapture() {
    this.showWebcam = true; // Set the flag to true to show the webcam
    this.capturedImageDataUrl = ''; // Clear the captured image data URL
  }
  
  // Modify your uploadImage function
  uploadImage() {
    this.closeCamera();
    this.contentUploaded = true;
    // console.log('Captured image:', this.capturedImageDataUrl);

    // Convert data URL to binary
    const binaryData = atob(this.capturedImageDataUrl.split(',')[1]);

    // Convert binary string to Uint8Array
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'image/png' });

    // Create a File object from the Blob
    const file = new File(
      [blob],
      `captured_image_${new Date().getTime()}.png`,
      { type: 'image/png' }
    );
    console.log(file);
    this.file = file;

    // Set up a file input element
    this.fileInput = document.createElement('input');
    console.log(this.fileInput);
    this.fileInput.type = 'file';
    this.fileInput.style.display = 'none';
    document.body.appendChild(this.fileInput);

    // Set the file to the file input element
    this.fileInput.files = [file];

    // Trigger the change event on the file input to simulate a file upload
    const event = new Event('change', { bubbles: true });
    this.fileInput.dispatchEvent(event);

    // Clean up the file input element
    document.body.removeChild(this.fileInput);
    this.fileInput = null;

    // If needed, you can also update your component properties

    this.capturedImageName = file.name;
    this.fileType = file.type;
    this.fileName = file.name;
    this.file = file;

    // Calculate file size
    const fileSizeInBytes = file.size;
    this.fileSize = this.formatFileSize(fileSizeInBytes);

  }

  // Video REcorder
  openVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (this.video) {
          this.video.srcObject = stream;
          this.modal!.classList.add('show');
          this.modal!.style.display = 'block';
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera: ', error);
      });
  }

  startRecording() {
    this.startRecordingVideo = true;
   
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }


  uploadVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
    const formData = new FormData();
    formData.append('video', blob, 'recorded_video.mp4');

 
    // For demonstration purposes, you can log a simulated upload success
    console.log('Simulated upload success:', { success: true });
  }

  setupEventListeners() {
    if (this.modal) {
      this.modal.querySelector('.close')?.addEventListener('click', () => {
        if (this.video) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              const tracks = stream.getTracks();
              console.log('Tracks:', tracks);
            })
            .catch((error) => {
              console.error('Error accessing media devices:', error);
            });
          if (this.modal) this.modal.style.display = 'none';
        }
      });

      this.modal.addEventListener('hidden.bs.modal', () => {
        if (this.video) {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              const tracks = stream.getTracks();
              console.log('Tracks:', tracks);
            })
            .catch((error) => {
              console.error('Error accessing media devices:', error);
            });
        }
      });
    }

    if (this.startRecordingBtn)
      this.startRecordingBtn.addEventListener('click', () =>
        this.startRecording()
      );
    if (this.stopRecordingBtn)
      this.stopRecordingBtn.addEventListener('click', () =>
        this.stopRecording()
      );
    // if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.cancelCamera());
    if (this.uploadBtn)
      this.uploadBtn.addEventListener('click', () => this.uploadVideo());
  }

  async getContextData() {
  try {
    this.ordId = this.http.org_id_FromQueryparams;
    this.contextData = await this.http.getContext(this.ordId).toPromise();
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
    if(this.sub_typeFile){
     this.submitBtnDisabled=false;
    }
    
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
      this.rtmUserid=this.managerData?.level4_user_id;
      this.rtmIDuser=this.managerData?.level4_id_user;
      this.rtmName=this.managerData?.level4_firstname + " " + this.managerData?.level4_lastname;
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
        user_firstname:this.userFirstName,
        user_lastname:this.userlastName,
      };
      console.log(body);
      console.log(this.fileContext, this.sub_type);
      console.log(this.file);
      const res: any = await this.http.postUserUpload(body, this.file).toPromise();

      console.log(res);
      console.log(res.status!=200);
      console.log(res.status);
      
      if (res) {
        this.successMessage = res.message;
      }
    } catch (error) {
      console.error('Error posting user upload:', error);
    }finally {
      this.loader = false;
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
      this.rtm_id_user=this.rtmIDuser;
      this.rtm_user_id=this.rtmUserid;
      this.rtm_org_id=this.managerOrgId;
      console.log(this.uploadedFileName);
  
      let body = {
        file_context: this.contextName,
        sub_type: this.sub_typeFile,
        id_user: this.http.id_user_FromQueryparams,
        org_id: this.org_id,
        user_id: this.userID,
        user_message: this.demoMessage,
        uploadedFileName: this.uploadedFileName,
        user_firstname:this.userFirstName,
        user_lastname:this.userlastName,
        rtm_id_user:this.rtm_id_user,
        rtm_user_id:this.rtm_user_id,
        rtm_org_id: this.rtm_org_id,
      };
  
      console.log(body);
  
      console.log(this.fileContext, this.sub_type);
      console.log(this.file);
  
      const res: any = await this.http.postRTMuseruploadapi(body, this.file).toPromise();
  
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
  

  handleFileInput(event: any): void {
    console.log(event);

    this.file = event.target.files[0];

    // Get the first selected file
    if (this.file) {
      // Get file type
      this.contentUploaded = true;
      this.fileType = this.file.type;

      // Get file name
      this.fileName = this.file.name;
        
      // Get file size
      this.fileSize = this.formatFileSize(this.file.size);
    }
  }

  private formatFileSize(size: number): string {
    const fileSizeInBytes = size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    return fileSizeInKB.toFixed(2) + ' KB';
  }

  opennewUpload() {
    this.newUploadActive = true;
  }

  openUploadStatus() {
    this.newUploadActive = false;
    this.isSubCategoryDataHere = true;
  }
 
  openVideoRecorderCamera(){
    this.OpenRecoder=true;
  }
  downLoadPriview(userUploadData: any, index: any) {
    console.log(userUploadData);
    console.log(userUploadData.file_type);

    // Concatenate the sanitized base path and file path

    console.log(this.srcUrl);
    // removeComment after https applied
    if (this.selectedCardIndex == index) {
      if(userUploadData.file_type==='video'||userUploadData.file_type==='audio'||userUploadData.file_type==='image'){
        const basePath = this.http.urlString;

        // Assuming 'userUploadData?.file_path' is a dynamic path that needs to be sanitized
        const filePath = userUploadData?.file_path;

        // Concatenate the sanitized base path and file path
        this.srcUrl = `${basePath}/${filePath}`;
        this.displayContent=!this.displayContent;
      }
      else{
      const link = document.createElement('a');
      this.srcUrl = `${this.http.urlString}/${userUploadData?.file_path}`;
      link.href = this.srcUrl;
      link.target = '_blank'; // Open the link in a new tab/window, optional
      link.click();

      }
    }

    // Create a hidden anchor element
  }


  handleVideoUpload(videoData: Blob) {
    this.contentUploaded = true;
    const file = new File(
      [videoData],
      `video_${new Date().getTime()}.mp4`,
      { type: 'video/mp4' }
    );
  console.log('Received video data:', videoData);
  this.file=file;
  console.log( this.file);
  console.log('123',this.fileName);

    const imageName = `video_${new Date().getTime()}.mp4`;
    this.fileName = imageName;
    this.fileSize=this.formatFileSize(this.file.size);
    this.fileType=this.file.type
    console.log('filesize',this.fileSize);
    
     console.log(this.fileName);

  }
  handleAudioUpload(audioData:any){
    this.contentUploaded = true;

    console.log(audioData);
    const file = new File(
      [audioData],
      `captured_audio_${new Date().getTime()}.mp3`,
      { type: 'audio/mp3' }
    );
  console.log('Received audioData data:', audioData);
  this.file=file;
  console.log( this.file);
  console.log('123',this.fileName);

    const imageName = `captured_audio_${new Date().getTime()}.mp3`;
    this.fileName = imageName;
    this.fileSize=this.formatFileSize(this.file.size);
    this.fileType=this.file.type
    console.log('filesize',this.fileSize);
    
     console.log(this.fileName);

    }
  
  openSelectManager(){
    this.openSelectManagerCard=!this.openSelectManagerCard;

  }
  searchManagerFunction(){
    if (this.searchManger.length>4) {
      this.displayuser=true;

    }
    console.log(this.searchManger)
    // this.http.searchmanager(this.searchManger).subscribe((res)=>{
    //   console.log(res);
    // })

  }
  addedManager:any=[]
  addManager(data:any){
    console.log(data);
    this.addedManager.push(data);
    console.log(this.addedManager)
  }
  deletemanger(data:any,index:any){
    if(this.addedManager){
      this.addedManager.splice(index, 1);
      console.log(this.addedManager);
    }
   

  }
  closeAudio(){
    this.OpenAudioRecoderWeb=false;
  }
  openAudioRecorder(){
    this.OpenAudioRecoderWeb=true;

  }
  closeSubmitBtn(){
    window.location.reload();
  }
  ViewCard(index: any) {
    console.log(index);
    this.srcUrl=''
    this.displayContent = false;
    this.openViewCard = true;
    this.ViewButtonmessage = 'View less';
    this.selectedCardIndex = index;

    // this.openViewCard=!this.openViewCard;
  }
  ViewLessCard(index: any) {
    this.openViewCard = false;
    this.ViewButtonmessage = 'View More';
    this.selectedCardIndex = index;
  }

}
