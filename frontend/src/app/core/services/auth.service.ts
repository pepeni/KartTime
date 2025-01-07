import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private tokenKey = "token";

	private isBrowser(): boolean {
		return (typeof window !== "undefined" && typeof window.localStorage !== "undefined");
	}

	setToken(token: string): void {
		if (this.isBrowser()) {
			localStorage.setItem(this.tokenKey, token);
		}
	}

	getToken(): string | null {
		if (this.isBrowser()) {
			return localStorage.getItem(this.tokenKey);
		}
		return null;
	}

	removeToken(): void {
		if (this.isBrowser()) {
			localStorage.removeItem(this.tokenKey);
		}
	}

	isLoggedIn(): boolean {
		const token = this.getToken();
		return !!token;
	}
}
