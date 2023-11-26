import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent {
  @ViewChild('audioPlayer', { static: true })
  audioPlayer!: ElementRef;
  private mediaRecorder: any;
  private audioChunks: Blob[] = [];
  chunks:any=[]

  constructor( private sanitizer: DomSanitizer) {

  }
  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.chunks.push(event.data);
            }
        };

        // mediaRecorder.onstop = () => {
        //     const blob = new Blob(this.chunks, { type: 'audio/wav' });
        //     const objectURL = URL.createObjectURL(blob);
        //     this.audioPlayer.src = objectURL;
        //     this.audioPlayer.controls = true;
        //     this.chunks = [];
        // };

        // mediaRecorder.start();
        // startRecordingButton.disabled = true;
        // stopRecordingButton.disabled = false;
    })
    .catch((error) => {
        console.error('Error accessing microphone:', error);
    });
  }

  stopRecording(): Blob {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    return new Blob(this.audioChunks, { type: 'audio/wav' });
  }


}
