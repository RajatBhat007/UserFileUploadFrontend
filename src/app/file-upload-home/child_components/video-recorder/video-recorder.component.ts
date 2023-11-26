// app/video-recorder/video-recorder.component.ts
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileUploadService } from 'src/app/fileUploadService/file-upload.service';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss'],
})
export class VideoRecorderComponent {
  @Output() uploadVideoData: EventEmitter<Blob> = new EventEmitter<Blob>();
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef;
  @ViewChild('recordButton', { static: true })
  recordButton!: ElementRef;
  recording: boolean = false;

  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];
  private stream!: MediaStream;
  public recordedVideoUrl: string | null = null;
  hideVideo: boolean = false;
  recordingTime: string = '00:00';
  timerInterval:any;
  constructor(
    public http: FileUploadService,
  
  ) {}

  async ngAfterViewInit() {
    // Mute the audio on the main video element
    this.videoElement.nativeElement.volume = 0;

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Set the muted stream to the main video element
    this.videoElement.nativeElement.srcObject = this.stream;

    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
      // this.recordedChunks = [];
      
      this.recordedVideoUrl = URL.createObjectURL(blob);
      console.log( this.recordedVideoUrl);

      this.playRecordedVideo();
    };
  }

  startRecording() {
    this.recordedChunks = [];

    // Ensure the volume is set to 0 during recording
    // this.videoElement.nativeElement.volume = 0;

    this.mediaRecorder.start();
    this.recording = true;

    this.recordButton.nativeElement.disabled = true;
    this.startTimer();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.recordButton.nativeElement.disabled = false;

    // Reset the volume back to 1 after recording stops
    this.recording = false;
    this.recordingTime = '00:00';
    this.videoElement.nativeElement.volume = 0;
    this.hideVideo = true; // Set hideVideo to false to show the video element
  }

  playRecordedVideo() {
    if (this.recordedVideoUrl) {
      const video = document.createElement('video');
      video.width = 640;
      video.height = 350;
      video.controls = true;
      video.style.width = '100%';
      video.src = this.recordedVideoUrl;

      // Append the video element to the component's view
      this.videoElement.nativeElement.parentNode.appendChild(video);
    }
  }
  startTimer() {
    let seconds = 0;
    this.timerInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      this.recordingTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
  }
  uploadVideo() {
    console.log(this.recordedChunks);
    
    const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
    console.log(blob);
    
    const formData = new FormData();
    formData.append('video', blob, 'recorded_video.mp4');

    // const formData = new FormData();
    // formData.append('video', blob, 'recorded_video.webm');

    // You can now send the FormData object to your server using Angular HttpClient
    // Example:
    // this.http.post('your_upload_url', formData).subscribe(
    //   (response) => {
    //     console.log('Upload success:', response);
    //   },
    //   (error) => {
    //     console.error('Upload error:', error);
    //   }
    // );

    // For demonstration purposes, you can log a simulated upload success


    
    console.log('Simulated upload success:', { success: true });
    this.uploadVideoData.emit(blob);
  }

  ngOnDestroy() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }
}
