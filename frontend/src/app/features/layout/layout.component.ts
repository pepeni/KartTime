import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourtsComponent } from '../courts/courts.component';

@Component({
  selector: 'layout-register',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CourtsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
