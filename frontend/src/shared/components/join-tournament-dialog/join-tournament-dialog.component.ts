import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApiService } from '../../../app/core/services/api.service';
import { AuthService } from '../../../app/core/services/auth.service';
import { API_JOIN_GP_URL } from '../../../app/core/models/const';
import { JoinGP } from '../../../app/core/models/kart-time-defs';


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
    private apiService = inject(ApiService);
    private authService = inject(AuthService);
    private dialogRef = inject(MatDialogRef<JoinTournamentDialogComponent>);
    private cdr = inject(ChangeDetectorRef);
    
    joinForm: FormGroup = this.fb.group({
        code: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    public joinTournament(): void {
        if (this.joinForm.invalid) {
            return;
        }

        const userId = this.authService.getUserId();
        if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        const joinData: JoinGP = {
            user_id: userId,
            gp_code: this.joinForm.value.code
        };

        this.apiService.post(API_JOIN_GP_URL, joinData).subscribe({
            next: (response) => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                console.error("Failed to join tournament:", err);
                alert(err.error?.message || "An error occurred while joining the tournament.");
                this.cdr.detectChanges();
            }
        });
    }

    public actionDiasabled(): boolean {
        return this.joinForm.invalid;
    }
}
