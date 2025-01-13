import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/services/api.service';
import { TrackListElement } from '../../core/models/kart-time-defs';
import { API_TRUCKS_URL } from '../../core/models/const';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-courts',
    imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
    templateUrl: './courts.component.html',
    styleUrl: './courts.component.scss'
})
export class CourtsComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    courts = signal<TrackListElement[]>([]);

    filteredCourts = signal<TrackListElement[]>([]);
    
    searchValue: string = '';

    ngOnInit(): void {
        this.apiService.get<TrackListElement[]>(API_TRUCKS_URL).subscribe((courts)=>{
            this.courts.set(courts);
            this.filteredCourts.set(courts);
        });
        this.cdr.detectChanges();
    }

    public search(): void {
        const filterValue = this.searchValue.toLocaleLowerCase();
        const filterdCourts = this.courts().filter((track) => 
            track.track_name.toLocaleLowerCase().includes(filterValue) || track.address.toLocaleLowerCase().includes(filterValue)
        )
        this.filteredCourts.set([...filterdCourts]);
        this.cdr.detectChanges()
    }

    public reset(): void {
        this.searchValue = "";
        this.search()
    }

    protected goToCourt(courtId: number){
        this.router.navigate([`/courts/${courtId}`]);
    }
}
