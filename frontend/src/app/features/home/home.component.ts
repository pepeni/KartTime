import { Component } from '@angular/core';
import { materialModules } from '../../core/config/material.config';

@Component({
    selector: 'app-home',
    imports: materialModules,
    template: `
    <mat-toolbar color="primary">
      KartTime
    </mat-toolbar>
    <div style="margin: 20px;">
      <mat-card>
        <mat-card-title>Test Material</mat-card-title>
        <mat-card-actions>
          <button mat-raised-button color="primary">Start Now</button>
          <button mat-raised-button color="accent">Button 2</button>
          <button mat-raised-button color="warn">Button 3</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
    styles: [
        `
      mat-toolbar {
        font-size: 20px;
      }
      mat-card {
        max-width: 400px;
        margin: 0 auto;
      }
      button {
        margin: 0 8px;
      }
    `,
    ]
})
export class HomeComponent {

}
