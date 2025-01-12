import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private tokenKey = "token";
	private userIdKey = "user_id";

	private isBrowser(): boolean {
		return (typeof window !== "undefined" && typeof window.localStorage !== "undefined");
	}

	setToken(token: string) {
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

	removeToken() {
		if (this.isBrowser()) {
			localStorage.removeItem(this.tokenKey);
		}
	}

	setUserId(userId: number) {
		if (this.isBrowser()) {
			localStorage.setItem(this.userIdKey, userId.toString());
		}
	}

	getUserId(): number | null {
		if (this.isBrowser()) {
			const userId = localStorage.getItem(this.userIdKey);
			return userId ? parseInt(userId, 10) : null;
		}
		return null;
	}

	removeUserId() {
		if (this.isBrowser()) {
			localStorage.removeItem(this.userIdKey);
		}
	}

	logout() {
		this.removeToken();
		this.removeUserId();
	}

	isLoggedIn(): boolean {
		const token = this.getToken();
		return !!token;
	}
}
