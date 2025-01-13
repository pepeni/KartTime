import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { AtLeastOneCourt } from '../../../app/core/custom-validators';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ApiService } from '../../../app/core/services/api.service';
import { TrackListElement } from '../../../app/core/models/kart-time-defs';
import { API_TRUCKS_URL } from '../../../app/core/models/const';


@Component({
    selector: 'join-tournament-dialog',
    imports: [
        MatDialogModule, 
        MatButtonModule, 
        MatFormFieldModule, 
        FormsModule, 
        ReactiveFormsModule, 
        MatInputModule, 
        MatSelectModule,
        CommonModule,
        MatDatepickerModule,
        MatSelectModule
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
    templateUrl: './join-tournament-dialog.component.html',
    styleUrl: './join-tournament-dialog.component.scss'
})
export class JoinTournamentDialogComponent {
    private fb: FormBuilder = inject(FormBuilder)
    
    joinForm: FormGroup = this.fb.group({
        code: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    public test(): void {
        console.log(this.joinForm)
    }

    public actionDiasabled(): boolean {
        return this.joinForm.invalid;
    }
}
