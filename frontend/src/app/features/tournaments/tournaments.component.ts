import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ModalService } from "../../core/services/modal.service";

@Component({
	selector: "app-tournaments",
	imports: [MatIconModule, MatButtonModule],
	templateUrl: "./tournaments.component.html",
	styleUrl: "./tournaments.component.scss",
})
export class TournamentsComponent {
	private readonly modalService = inject(ModalService);

	protected openNewGPDialog() {
        this.modalService.openNewGPDialog();
    }

	protected openJoinGPDialog() {
		this.modalService.openJoinGPDialog();
	}
}
