import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FileUploadHomeComponent } from './file-upload-home/file-upload-home.component';
import { HttpClientModule } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {WebcamModule} from 'ngx-webcam';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './file-upload-home/child_components/header/header.component';
import { UserUploadComponent } from './file-upload-home/child_components/user-upload/user-upload.component';
import { ApprovalsComponent } from './file-upload-home/child_components/approvals/approvals.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VideoRecorderComponent } from './file-upload-home/child_components/video-recorder/video-recorder.component';
import { AudioRecorderComponent } from './file-upload-home/child_components/audio-recorder/audio-recorder.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    FileUploadHomeComponent,
    HeaderComponent,
    UserUploadComponent,
    ApprovalsComponent,
    VideoRecorderComponent,
    AudioRecorderComponent,

    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    WebcamModule,
    FormsModule
    

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
