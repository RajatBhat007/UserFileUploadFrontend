import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadHomeComponent } from './file-upload-home/file-upload-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'UserFileUpload', pathMatch: 'full' },
  { path: 'UserFileUpload', component:FileUploadHomeComponent,
  children: [
    // { path: 'badges', component:BadgesComponent},
    // { path: 'score', component:ScoreComponent},
    // { path: 'library', component:LibraryComponent},
    // { path: 'leaderboard', component:LeaderBoardComponent},

  ]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
