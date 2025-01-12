import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CourtsComponent } from "../courts/courts.component";
import { TournamentsComponent } from "../tournaments/tournaments.component";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";


@Component({
	selector: "app-layout",
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatIconModule, MatButtonModule, CourtsComponent, TournamentsComponent],
	templateUrl: "./layout.component.html",
	styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
	selectedView: 'courts' | 'tournaments' = 'courts';

	constructor(private authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef) {}

	protected selectView(view: 'courts' | 'tournaments') {
		this.selectedView = view;
		this.cdr.detectChanges();
		console.log(this.selectedView)
	}

	protected logout() {
		this.authService.logout();
    	this.router.navigate(['/login']);
	}
}
