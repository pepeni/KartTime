import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../core/services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { RouterOutlet } from '@angular/router';


@Component({
	selector: "app-layout",
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatIconModule, MatButtonModule, RouterOutlet, RouterLink],
	templateUrl: "./layout.component.html",
	styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	private readonly cdr = inject(ChangeDetectorRef);

	protected logout() {
		this.authService.logout();
    	this.router.navigate(['/login']);
	}
}
