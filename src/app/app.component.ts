import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BarComponent } from './bar/bar.component';
import { ScatterComponent } from './scatter/scatter.component';
import { PieComponent } from './pie/pie.component';
import { FormsModule } from '@angular/forms';
import { SubmissionPageComponent } from './submission-page/submission-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, BarComponent, ScatterComponent, PieComponent, SubmissionPageComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flavour-pairings';
}
