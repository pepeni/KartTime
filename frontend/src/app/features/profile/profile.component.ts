import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { CommonModule } from "@angular/common";
import { BestTime } from "../../core/models/kart-time-defs";
import { API_TRACKS_USER_BEST_TIMES, API_USER_WHOAMI } from "../../core/models/const";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-profile",
	imports: [CommonModule, MatIconModule],
	templateUrl: "./profile.component.html",
	styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly apiService = inject(ApiService);
	private readonly authService = inject(AuthService);

	bestTimes: BestTime[] = [];
	userName: string = "";

	ngOnInit(): void {
		this.loadUserProfile();
		this.loadUserBestTimes();
		this.cdr.detectChanges();
	}

	private loadUserProfile(): void {
		const userId = this.authService.getUserId();
		if (!userId) {
			console.error("User ID not found!");
			return;
		}

		const apiUrl = API_USER_WHOAMI(userId);
		this.apiService.get<{ name: string }>(apiUrl).subscribe({
				next: (response) => {
					this.userName = response.name || "User";
					this.cdr.detectChanges();
				},
				error: (err) => {
					console.error("Failed to load user profile:", err);
				},
			});
	}

	private loadUserBestTimes(): void {
		const userId = this.authService.getUserId();
		if (!userId) {
			console.error("User ID not found!");
			return;
		}

		const apiUrl = API_TRACKS_USER_BEST_TIMES(userId);
		this.apiService.get<BestTime[]>(apiUrl)
			.subscribe({
				next: (times) => {
					this.bestTimes = times;
					this.cdr.detectChanges();
				},
				error: (err) => {
					console.error("Failed to load best times:", err);
				},
			});
	}
}
