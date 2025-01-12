import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/services/api.service';
import { TruckListElement } from '../../core/models/kart-time-defs';
import { API_TRUCKS_URL } from '../../core/models/const';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-courts',
    imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
    templateUrl: './courts.component.html',
    styleUrl: './courts.component.scss'
})
export class CourtsComponent implements OnInit {
    courts = signal<TruckListElement[]>([]);

    filteredCourts = signal<TruckListElement[]>([]);
    
    searchValue: string = '';

    constructor(private readonly apiService: ApiService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.apiService.get<TruckListElement[]>(API_TRUCKS_URL).subscribe((courts)=>{
            this.courts.set(courts);
            this.filteredCourts.set(courts);
        });
    }

    public search(): void {
        const filterValue = this.searchValue.toLocaleLowerCase();
        const filterdCourts = this.courts().filter((track) => track.track_name.toLocaleLowerCase().includes(filterValue))
        this.filteredCourts.set([...filterdCourts]);
        this.cdr.detectChanges()
    }

    public reset(): void {
        this.searchValue = "";
        this.search()
    }
}
