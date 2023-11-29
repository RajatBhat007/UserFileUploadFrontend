import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent {
  @Output() uploadAudioData: EventEmitter<Blob> = new EventEmitter<Blob>();
  @ViewChild('audioPlayer', { static: true })
  audioPlayer!: ElementRef;
  private mediaRecorder: any;
  private audioChunks: Blob[] = [];
  chunks:any=[]
  title = 'micRecorder';
  record:any;
  recording:boolean = false;
  url:any;
  error:any;
  recordingTime: string = '00:00';
  timerInterval: any;
  hideMic:boolean=false;
  hideAudio: boolean = true;
  blobdata: any;

  constructor( private domSanitizer: DomSanitizer) {

  }

  // sanitize(url: string) {
  //   return this.domSanitizer.bypassSecurityTrustUrl(url);
  //   }
    /**
    * Start recording.
    */
    initiateRecording() {
    this.recording = true;
    this.hideMic=true;
    this.startTimer();
    let mediaConstraints = {
    video: false,
    audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }
    
    successCallback(stream:any) {
      const options: RecordRTC.Options = {
        mimeType: "audio/wav",
        numberOfAudioChannels: 1,
        sampleRate: 44100,
      };
      
      // Start Actual Recording
      const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
      this.record = new StereoAudioRecorder(stream, options);
      this.record.record();
      
      }
stopRecording() {
  this.recording = false;
  this.recordingTime = '00:00';
  clearInterval(this.timerInterval); 
  this.record.stop(this.processRecording.bind(this));
  this.hideAudio = false;
  this.hideMic = false;
  }
  
  processRecording(blob:any) {
  this.url = URL.createObjectURL(blob);
  console.log("blob", blob);
  console.log("url", this.url);
 this.blobdata=blob;
  
  }
  uploadAudio() {
    console.log(this.audioChunks);
    console.log('Simulated upload success:', { success: true });
    this.uploadAudioData.emit(this.blobdata);
    this.audioChunks=[];
    this.url=''
    this.hideAudio = true;
  }

errorCallback(error:any) {
  this.error = 'Can not play audio in your browser';
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
  
}
