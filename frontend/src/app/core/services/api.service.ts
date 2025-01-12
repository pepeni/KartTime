import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { API_LOGIN_URL, API_REGISTER_URL } from "../models/const";
import { UserData } from "../models/user-data";

@Injectable({
    providedIn: "root",
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);

    private readonly BASE_URL = "http://127.0.0.1:5000/api/";

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        if (token) {
            return new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });
        }
        return new HttpHeaders();
    }

    get<T>(endpoint: string, params?: any): Observable<T> {
        // const headers = this.getAuthHeaders();
        return this.http.get<T>(`${this.BASE_URL}${endpoint}`, { params });
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        const headers = this.getAuthHeaders();
        return this.http.post<T>(`${this.BASE_URL}${endpoint}`, body, { headers });
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        const headers = this.getAuthHeaders();
        return this.http.put<T>(`${this.BASE_URL}${endpoint}`, body, { headers });
    }

    delete<T>(endpoint: string): Observable<T> {
        const headers = this.getAuthHeaders();
        return this.http.delete<T>(`${this.BASE_URL}${endpoint}`, { headers });
    }

    login(body: UserData): Observable<any> {
        return this.http.post(`${this.BASE_URL}${API_LOGIN_URL}`, body);
    }

    register(body: UserData): Observable<any> {
        return this.http.post(`${this.BASE_URL}${API_REGISTER_URL}`, body);
    }
}