import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { Participant, Result, Tournament, TournamentWithParticipants } from "../../core/models/kart-time-defs";
import { API_GP_INFO_PARTICIPANTS_URL, API_GP_TIMES_URL } from "../../core/models/const";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { GpCodeDialogComponent } from "../../../shared/components/gp-code-dialog/gp-code-dialog.component";
import { ModalService } from "../../core/services/modal.service";


@Component({
	selector: "app-tournament",
	imports: [MatIconModule, MatButtonModule, CommonModule],
	templateUrl: "./tournament.component.html",
	styleUrl: "./tournament.component.scss",
})
export class TournamentComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly apiService = inject(ApiService);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	private readonly dialog = inject(MatDialog);
	private readonly modalService = inject(ModalService);

	tournament: Tournament = {
		gp_id: 0,
		name: "",
		gp_code: "",
		track_id: 0,
		track_name: ""
	};
	participants: Participant[] = [];
	results: Result[] = [];

	selectedParticipant: number | null = null;

	ngOnInit(): void {
		const gpId = Number(this.route.snapshot.paramMap.get("gpId"));
		if (!gpId) {
			this.router.navigate(["/tournaments"]);
			return;
		}
		this.cdr.detectChanges();
		this.loadTournamentDetails(gpId);
		this.loadTournamentResults(gpId);
	}

	private loadTournamentDetails(gpId: number) {
		const apiUrl = API_GP_INFO_PARTICIPANTS_URL(gpId);
		this.apiService.get<TournamentWithParticipants>(apiUrl).subscribe({
			next: (data) => {
				this.tournament = {
					gp_id: data.gp_id,
					name: data.name,
					gp_code: data.gp_code,
					track_id: data.track_id,
					track_name: data.track_name
				};
				this.participants = data.participants;
				this.cdr.detectChanges();
			},
			error: () => {
				alert("Failed to load tournament details!");
				this.cdr.detectChanges();
			},
		});
	}

	private loadTournamentResults(gpId: number) {
		const apiUrl = API_GP_TIMES_URL(gpId);
		this.apiService.get<Result[]>(apiUrl).subscribe({
			next: (results) => {
				this.results = results.sort((a, b) => a.standing - b.standing);
				this.cdr.detectChanges();
			},
			error: () => {
				this.cdr.detectChanges();
			},
		});
	}

	protected onShowGPCodeClick() {
		this.dialog.open(GpCodeDialogComponent, {
			data: { gpCode: this.tournament.gp_code }
		});
	}

	protected selectParticipant(participantId: number) {
		this.selectedParticipant = participantId;
	}

	protected openAddNewResultGPDialog() {
		this.modalService.openAddNewResultGpDialog(this.tournament.gp_id).subscribe((resultAdded) => {
			if (resultAdded) {
				this.loadTournamentResults(this.tournament.gp_id);
				this.cdr.detectChanges();
			}
		});
	}

	addNewResult(): void {
		alert("Open new score dialog");
	}
}
