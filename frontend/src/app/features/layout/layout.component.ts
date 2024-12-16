import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CourtsComponent } from "../courts/courts.component";
import { TournamentsComponent } from "../tournaments/tournaments.component";

@Component({
	selector: "layout-register",
	standalone: true,
	imports: [MatIconModule, MatButtonModule, CourtsComponent, TournamentsComponent],
	templateUrl: "./layout.component.html",
	styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
	selectedView: 'courts' | 'tournaments' = 'courts';

	protected selectView(view: 'courts' | 'tournaments') {
		this.selectedView = view;
	}
}
