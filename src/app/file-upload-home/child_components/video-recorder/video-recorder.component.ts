import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FileUploadService } from 'src/app/fileUploadService/file-upload.service';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss']
})
export class VideoRecorderComponent implements OnInit, OnDestroy{
  @ViewChild('videoStream')
  videoStream!: ElementRef<HTMLVideoElement>;
  @ViewChild('recordedVideoPreview')
  recordedVideoPreview!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  recordedChunks: Blob[] = [];


  mediaRecorder: any;

  startBtnDisabled = false;
  stopBtnDisabled = true;
  uploadBtnDisabled = true;
  constructor(private http:FileUploadService){

  }

  ngOnDestroy() {
    // Clean up resources on component destroy
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  openVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.videoStream.nativeElement.srcObject = stream;
        console.log('Media stream obtained successfully.');
      })
      .catch((error) => {
        console.error('Error accessing the camera and microphone: ', error);
      });
  }

  startRecording() {
    this.recordedChunks = [];
    const options = { mimeType: 'video/webm; codecs=vp9' };
    this.openVideo();
    // Check if srcObject is a MediaStream
    if (this.videoStream.nativeElement.srcObject instanceof MediaStream) {
      // Create a clone of the original stream to avoid modifying the original stream
      const clonedStream = this.videoStream.nativeElement.srcObject.clone();
  
      // Mute the audio track in the cloned stream
      clonedStream.getAudioTracks().forEach(track => {
        track.enabled = true; // Mute the audio track
      });
  
      // Create MediaRecorder with the modified stream
      this.mediaRecorder = new MediaRecorder(clonedStream, options);
  
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
  
        // Display the recorded video preview
        this.recordedVideoPreview.nativeElement.src = url;
        this.recordedVideoPreview.nativeElement.style.display = 'block';
  
        // Enable/disable buttons
        this.startBtnDisabled = false;
        this.stopBtnDisabled = false;
        this.uploadBtnDisabled = false;
      };
  
      this.mediaRecorder.start();
      // Enable/disable buttons
      this.startBtnDisabled = true;
      this.stopBtnDisabled = false;
      this.uploadBtnDisabled = true;
    } else {
      console.error('srcObject is not a MediaStream');
    }
  }
  

  stopRecording() {
    this.mediaRecorder.stop();
    console.log('Stopping recording...');
  }

  cancelCamera() {
    // Stop the current camera stream
    if (this.videoStream.nativeElement.srcObject instanceof MediaStream) {
      this.videoStream.nativeElement.srcObject.getTracks().forEach(track => track.stop());
      console.log('Camera stream canceled.');
    }
  }
  uploadVideo(fileInfo: { name: string, type: string, lastModified: number }) {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

    const file = new File([blob], fileInfo.name, { type: fileInfo.type, lastModified: fileInfo.lastModified });

    // Create a new FileReader
    const reader = new FileReader();
    this.http.videoContentUploaded=true;

    // Define the onload event handler for the reader
    reader.onload = (event) => {
      if (event.target) {
        // Create a new FileList with the read result
        const fileList = new DataTransfer();
        fileList.items.add(new File([event.target.result as ArrayBuffer], file.name, { type: file.type }));

        // Set the files property of the file input
        this.fileInput.nativeElement.files = fileList.files;

        // Trigger the change event to simulate user file selection
        this.fileInput.nativeElement.dispatchEvent(new Event('change'));
      }
    };

    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  }
  handleFileInput(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    
    // Check if files are selected
    if (fileInput.files && fileInput.files.length > 0) {
      const uploadedFile = fileInput.files[0];
      this.http.fileData=uploadedFile
      
      // Perform any additional actions with the uploaded file if needed
      console.log('Uploaded file:', uploadedFile);
    }
  }
  

  ngOnInit(): void {
 
    
    // Initialize your triggerObservable and other configurations
    // Example: this.triggerObservableVideoRecording = ...;
  }

}
