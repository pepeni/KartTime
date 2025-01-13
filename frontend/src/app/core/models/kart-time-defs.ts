export interface TrackListElement {
	address: string;
	id: number;
	opening_hours: string;
	phone_number: string;
	track_name: string;
	url: string;
}

export interface UserData {
	name: string;
	password: string;
}

export interface CreateGpBody {
	user_id: number;
	name: string;
	track_id: number;
}

export interface Tournament {
	gp_id: number;
	name: string;
	gp_code: string;
	track_id: number;
	track_name: string;
}

export interface Participant {
	id: number;
	name: string;
}

export interface TournamentWithParticipants extends Tournament {
    participants: Participant[];
}

export interface Result {
    id: number;
    user_id: number;
    user_name: number;
	standing: number;
	lap_time: string;
	lap_date: string;
}

export interface JoinGP {
	user_id: number;
	gp_code: string;
};

export interface NewResultGp {
	user_id: number;
	gp_id: number;
	lap_time: string;
	standing: number;
}
