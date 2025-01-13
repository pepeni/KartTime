import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { API_TRUCKS_ADD_TIME_URL, API_TRUCKS_TIMES_URL, API_TRUCKS_URL } from '../../core/models/const';
import { LapTimeRequest, LapTimeResponse, TrackListElement } from '../../core/models/kart-time-defs';
import { catchError, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-court',
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './court.component.html',
    styleUrl: './court.component.scss'
})
export class CourtComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly apiService = inject(ApiService);
    private readonly authService = inject(AuthService);

    public newTime: string = '';

    private courtId!: number;

    public truck = signal<TrackListElement | null>(null);

    public bestScores = signal<LapTimeResponse[]>([]);

    public hasScore: Signal<boolean> = computed(() => this.bestScores().length > 0);

    ngOnInit(): void {
        this.courtId = Number(this.route.snapshot.paramMap.get("courtId"));
        this.cdr.detectChanges();

        this.getTruckDetails();
        this.getBestScores();
    }

    public addTime(): void {
        if (this.newTime && this.newTime.includes(':') && this.newTime.length < 10) {
            const req: LapTimeRequest = {
                user_id: this.authService.getUserId() as number,
                track_id: this.courtId,
                lap_time: this.newTime,
            };
    
            this.apiService.post<{message: string}>(API_TRUCKS_ADD_TIME_URL, req)
                .subscribe((response)=> {
                    if (response.message == 'Czas dodany pomyślnie!') {
                        this.getBestScores();
                    }
                });
        }
    }

    private getTruckDetails(): void {
        this.apiService.get<TrackListElement>(`${API_TRUCKS_URL}/${this.courtId}`)
            .subscribe((apiTruck)=> {
                this.truck.set(apiTruck)
            });
    }

    private getBestScores(): void {
        this.apiService.get<LapTimeResponse[]>(API_TRUCKS_TIMES_URL(this.courtId))
            .pipe(
                catchError(() => {
                    this.bestScores.set([]);
                    return of()
                })
            )
            .subscribe({
                next: (times) => {
                    this.bestScores.set(times.slice(0, 8));
                },
                error: () => {
                    this.bestScores.set([]);
                }
            });
    }
}
