import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-profile",
	imports: [],
	templateUrl: "./profile.component.html",
	styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly cdr = inject(ChangeDetectorRef);

	courtId!: number;

	ngOnInit(): void {
		this.cdr.detectChanges();
	}
}
