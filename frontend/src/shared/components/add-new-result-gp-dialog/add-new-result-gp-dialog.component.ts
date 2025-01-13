import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, inject, Input } from "@angular/core";
import {
	FormsModule,
	ReactiveFormsModule,
	FormBuilder,
	FormGroup,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import {
	MatFormFieldModule,
	MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ApiService } from "../../../app/core/services/api.service";
import { API_ADD_GP_RESULT_URL } from "../../../app/core/models/const";
import { NewResultGp } from "../../../app/core/models/kart-time-defs";
import { AuthService } from "../../../app/core/services/auth.service";

@Component({
	selector: "app-add-new-result-gp-dialog",
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
		MatSelectModule,
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: "outline" },
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	templateUrl: "./add-new-result-gp-dialog.component.html",
	styleUrl: "./add-new-result-gp-dialog.component.scss",
})
export class AddNewResultGpDialogComponent {
	private fb: FormBuilder = inject(FormBuilder);
	private apiService = inject(ApiService);
	private authService = inject(AuthService);
	private dialogRef = inject(MatDialogRef<AddNewResultGpDialogComponent>);

	resultForm: FormGroup;
	gpId: number = 0;

	constructor(@Inject(MAT_DIALOG_DATA) public data: { gpId: number }) {
        this.resultForm = this.fb.group({
            lap_time: ["", [Validators.required, Validators.pattern(/^\d{1,2}:\d{2}\.\d{3}$/)]],
            standing: ["", [Validators.required, Validators.pattern(/^\d{1,2}$/)]],
        });
    }

	ngOnInit(): void {
		console.log("Received GP ID:", this.data.gpId);
        this.gpId = this.data.gpId;
        if (!this.gpId) {
            console.error("GP ID is missing!");
            this.dialogRef.close();
            return;
        }
    }

	public addResult(): void {
		if (this.resultForm.invalid) {
            alert("Invalid data! Please check your input.");
            return;
        }

        const resultData = this.resultForm.value;

		const userId = this.authService.getUserId();
		if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        const payload: NewResultGp = {
			user_id: userId,
            gp_id: this.gpId,
            lap_time: resultData.lap_time,
            standing: parseInt(resultData.standing, 10),
        };

        this.apiService.post(API_ADD_GP_RESULT_URL, payload).subscribe({
            next: (response) => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                console.error("Failed to add result:", err);
                alert("Failed to add result. Please try again.");
            },
        });
	}

	public actionDiasabled(): boolean {
		return this.resultForm.invalid;
	}
}
