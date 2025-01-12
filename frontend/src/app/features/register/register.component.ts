import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { ApiService } from "../../core/services/api.service";
import { UserData } from "../../core/models/user-data";


const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
	const value = control.value || '';
	const hasUpperCase = /[A-Z]/.test(value);
	const hasLowerCase = /[a-z]/.test(value);
	const hasNumber = /[0-9]/.test(value);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
	const isValidLength = value.length >= 8;
  
	const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
  
	return !isValid ? { passwordStrength: true } : null;
};

@Component({
	selector: "app-register",
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, HttpClientModule],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
})
export class RegisterComponent {
	registerForm: FormGroup;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private http: HttpClient,
		private readonly apiService: ApiService
	) {
		this.registerForm = this.fb.group({
			username: ["", [Validators.required, Validators.minLength(3)]],
			password: ["", [Validators.required, passwordValidator]],
			repeatPassword: ["", [Validators.required]],
		});
	}

	protected onSignInClick() {
		this.router.navigate(["/login"]);
	}

	protected onRegisterClick() {
		if (this.registerForm.invalid) {
			alert("Form is incorrect!");
			return;
		}

		if (this.registerForm.value.password !== this.registerForm.value.repeatPassword) {
			alert("Passwords are different!");
			return;
		}

		const userData: UserData = {
			name: this.registerForm.value.username,
			password: this.registerForm.value.password,
		};

		this.apiService.register(userData).subscribe({
			next: (res) => {
				alert("Registration completed successfully!");
				this.router.navigate(["/login"]);
			},
			error: (err) => {
				console.error(err);
				alert("Register error: " + err.error.message);
			},
		});
	}
}
