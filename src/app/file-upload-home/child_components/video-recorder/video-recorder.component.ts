// app/video-recorder/video-recorder.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss'],
})
export class VideoRecorderComponent {
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef;
  @ViewChild('recordButton', { static: true })
  recordButton!: ElementRef;

  private mediaRecorder!: MediaRecorder;
  private recordedChunks: Blob[] = [];
  private stream!: MediaStream;
  public recordedVideoUrl: string | null = null;
  hideRecordScreen: boolean = false;

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
      this.recordedChunks = [];

      this.recordedVideoUrl = URL.createObjectURL(blob);
      this.playRecordedVideo();
    };
  }

  startRecording() {
    this.recordedChunks = [];

    // Ensure the volume is set to 0 during recording
    // this.videoElement.nativeElement.volume = 0;

    this.mediaRecorder.start();
    this.recordButton.nativeElement.disabled = true;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.recordButton.nativeElement.disabled = false;

    // Reset the volume back to 1 after recording stops
    this.videoElement.nativeElement.volume = 0;
  }

  playRecordedVideo() {
    if (this.recordedVideoUrl) {
      const video = document.createElement('video');
      video.width = 640;
      video.height = 480;
      video.controls = true;
      video.style.width = '100%';
      video.src = this.recordedVideoUrl;

      // Append the video element to the component's view
      this.videoElement.nativeElement.parentNode.appendChild(video);
    }
  }

  ngOnDestroy() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }
}
