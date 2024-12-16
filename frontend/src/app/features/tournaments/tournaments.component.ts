import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-tournaments",
	imports: [MatIconModule, MatButtonModule],
	templateUrl: "./tournaments.component.html",
	styleUrl: "./tournaments.component.scss",
})
export class TournamentsComponent {
	openedTournaments = [
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
	];

	myTournaments = [
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
		{
			name: "Kraków Bronowice",
			date: "10.11.2023 - 11.11.2024",
			owner: "user1",
		},
	];
}
