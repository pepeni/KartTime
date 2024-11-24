import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private readonly http = inject(HttpClient);

	private readonly BASE_URL = 'http://127.0.0.1:5000/api/';

	get<T>(endpoint: string, params?: any): Observable<T> {
		return this.http.get<T>(`${this.BASE_URL}/${endpoint}`, { params });
	}

	post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
		return this.http.post<T>(`${this.BASE_URL}/${endpoint}`, body, { headers });
	}

	put<T>(endpoint: string, body: any): Observable<T> {
		return this.http.put<T>(`${this.BASE_URL}/${endpoint}`, body);
	}

	delete<T>(endpoint: string): Observable<T> {
		return this.http.delete<T>(`${this.BASE_URL}/${endpoint}`);
	}
}
