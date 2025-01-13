import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ModalService } from "../../core/services/modal.service";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { Tournament } from "../../core/models/kart-time-defs";
import { API_USER_GP_LIST_URL } from "../../core/models/const";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
	selector: "app-tournaments",
	imports: [MatIconModule, MatButtonModule, CommonModule],
	templateUrl: "./tournaments.component.html",
	styleUrl: "./tournaments.component.scss",
})
export class TournamentsComponent {
	private readonly modalService = inject(ModalService);
	private readonly apiService = inject(ApiService);
    private readonly authService = inject(AuthService);
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly router = inject(Router);

	tournaments: Tournament[] = [];

    ngOnInit(): void {
        this.loadTournaments();
    }

	protected loadTournaments(): void {
        const userId = this.authService.getUserId();
        if (!userId) {
            console.error("User ID not found!");
            return;
        }

		const apiUrl = API_USER_GP_LIST_URL(userId);
        this.apiService.get<Tournament[]>(apiUrl).subscribe({
            next: (tournaments) => {
                this.tournaments = tournaments;
				this.cdr.detectChanges();
            },
            error: (err) => {
                console.error("Failed to load tournaments:", err);
            },
        });
    }

	protected openNewGPDialog() {
        this.modalService.openNewGPDialog();
    }

	protected openJoinGPDialog() {
		this.modalService.openJoinGPDialog();
	}

	protected goToTournament(gpId: number) {
		this.router.navigate([`/tournaments/${gpId}`]);
	}
}
