import { Routes } from '@angular/router';
import { SubmissionPageComponent } from './submission-page/submission-page.component';
import { PieComponent } from './pie/pie.component';

export const routes: Routes = [
      { path: 'submit', component: SubmissionPageComponent },
      { path: '**', component: PieComponent }
];
