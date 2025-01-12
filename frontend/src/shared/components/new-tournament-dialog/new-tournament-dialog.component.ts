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
import { TruckListElement } from '../../../app/core/models/kart-time-defs';
import { API_TRUCKS_URL } from '../../../app/core/models/const';


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
    private fb: FormBuilder = inject(FormBuilder)
    
    createForm: FormGroup = this.fb.group({
        name: ["", [Validators.required]],
        password: [""],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        courts: [[], [AtLeastOneCourt()]],
    });

    public courts: TruckListElement[] = [];
    
    private apiService = inject(ApiService)
    
    ngOnInit(): void {
        this.apiService.get<TruckListElement[]>(API_TRUCKS_URL).subscribe((courts)=>{
            this.courts = courts;
        });
    }

    public test(): void {
        console.log(this.createForm)
    }

    public actionDiasabled(): boolean {
        return this.createForm.invalid;
    }
}
