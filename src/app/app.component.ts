import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BarComponent } from './bar/bar.component';
import { ScatterComponent } from './scatter/scatter.component';
import { PieComponent } from './pie/pie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BarComponent, ScatterComponent, PieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flavour-pairings';
}
