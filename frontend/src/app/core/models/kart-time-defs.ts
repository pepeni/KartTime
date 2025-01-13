export interface TrackListElement {
    address: string;
    id: number;
    opening_hours: string;
    phone_number: string;
    track_name: string;
    url: string;
}

export interface UserData {
    name: string,
	password: string,
}

export interface CreateGpBody {
    user_id: number,
    name: string,
    track_id: number
}

export interface Tournament {
    gp_id: number;
    name: string;
    gp_code: string;
    track_id: number;
    track_name: string;
}