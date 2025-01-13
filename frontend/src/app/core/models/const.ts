export const API_LOGIN_URL = 'auth/login';
export const API_REGISTER_URL = 'auth/register';

export const API_TRUCKS_URL = 'tracks';
export const API_TRUCKS_TIMES_URL = (courtId: number) => `${API_TRUCKS_URL}/${courtId}/times`;
export const API_TRUCKS_ADD_TIME_URL = `${API_TRUCKS_URL}/add_time`;
export const API_CREATE_GP_URL = 'gp/create';
export const API_USER_GP_LIST_URL = (userId: number) => `gp/user/${userId}/gplist`;
export const API_GP_INFO_PARTICIPANTS_URL = (gpId: number) => `gp/${gpId}/participants`;
export const API_GP_TIMES_URL = (gpId: number) => `gp/${gpId}/times`;