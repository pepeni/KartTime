import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { ApiService } from "../../core/services/api.service";
import { UserData } from "../../core/models/user-data";

@Component({
	selector: "app-login",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		HttpClientModule,
	],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private http: HttpClient,
		private authService: AuthService,
		private readonly apiService: ApiService
	) {
		this.loginForm = this.fb.group({
			username: ["", [Validators.required]],
			password: ["", [Validators.required]],
		});
	}

	protected onSignUpClick() {
		this.router.navigate(["/register"]);
	}

	protected onLoginClick() {
		if (this.loginForm.invalid) {
			alert("Form is invalid!");
			return;
		}

		const loginData: UserData = {
			name: this.loginForm.value.username,
			password: this.loginForm.value.password,
		};

		this.apiService.login(loginData).subscribe({
			next: (res: any) => {
				this.authService.setToken(res.access_token);
				this.authService.setUserId(res.user_id);
				this.router.navigate(["/"]);
			},
			error: (err) => {
				console.error(err);
				alert("Login error: " + err.error.message);
			},
		});
	}
}
