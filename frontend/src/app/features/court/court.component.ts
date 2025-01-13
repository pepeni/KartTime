import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-court',
    imports: [],
    templateUrl: './court.component.html',
    styleUrl: './court.component.scss'
})
export class CourtComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);

    courtId!: number;

    ngOnInit(): void {
        this.courtId = Number(this.route.snapshot.paramMap.get("courtId"));
        this.cdr.detectChanges();
    }
}
