import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ApiService } from '../../../app/core/services/api.service';
import { CreateGpBody, TrackListElement } from '../../../app/core/models/kart-time-defs';
import { API_CREATE_GP_URL, API_TRUCKS_URL } from '../../../app/core/models/const';
import { AuthService } from '../../../app/core/services/auth.service';


@Component({
    selector: 'new-tournament-dialog',
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
        provideNativeDateAdapter()
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
    templateUrl: './new-tournament-dialog.component.html',
    styleUrl: './new-tournament-dialog.component.scss'
})
export class NewTournamentDialogComponent implements OnInit {
    private fb: FormBuilder = inject(FormBuilder);
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    
    createForm: FormGroup = this.fb.group({
        name: ["", [Validators.required]],
        court: [null, [Validators.required]],
    });

    public courts: TrackListElement[] = [];
    
    ngOnInit() {
        this.apiService.get<TrackListElement[]>(API_TRUCKS_URL).subscribe((courts)=>{
            this.courts = courts;
        });
    }

    protected createTournament(): void {
        if (this.createForm.valid) {
            const { name, court } = this.createForm.value;
            const userId = this.authService.getUserId();

            if (userId === null) {
                console.error('User ID not found!');
                return;
            }

            const createGpBody: CreateGpBody = {
                user_id: userId,
                name,
                track_id: court.id
            }

            this.apiService.post(API_CREATE_GP_URL, createGpBody).subscribe({
                next: (response) => {
                    console.log('Tournament created successfully!', response);
                    alert("Tournament created successfully!");
                },
                error: (err) => {
                    console.error('Failed to create tournament:', err);
                    alert("Failed to create tournament");
                },
            });
        }
    }

    protected actionDisabled(): boolean {
        return this.createForm.invalid;
    }
}
