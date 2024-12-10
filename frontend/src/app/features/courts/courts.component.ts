import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-courts',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './courts.component.html',
  styleUrl: './courts.component.scss'
})
export class CourtsComponent {

}
