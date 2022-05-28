import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { store } from '../stores/store';

const sleep = (delay: number) => {
	return new Promise((_) => {
		setTimeout(_, delay);
	});
};

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
	async (response) => {
		await sleep(1000);
		return response;
	},
	(error: AxiosError) => handleAxiosError(error)
);

const handleAxiosError = (error: AxiosError) => {
	console.log('Error.response from Axios interceptors');
	const { data, status, config } = error.response!;
	console.log(error.response!);
	switch (status) {
		case 400:
			if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
				history.push('/not-found');
			}

			if (data.errors) {
				const modalStateErrors = [];
				for (const key in data.errors) {
					if (data.errors[key]) {
						modalStateErrors.push(data.errors[key]);
					}
				}
				throw modalStateErrors.flat();
			} else {
				toast.error(data);
			}
			break;
		case 401:
			toast.error('Unauthorised');
			break;
		case 404:
			history.push('/not-found');
			break;
		case 500:
			store.commonStore.setServerError(data);
			history.push('/server-error');
			break;
	}
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, body: {}) =>
		axios.post<T>(url, body).then(responseBody),
	put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
	del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
	list: () => requests.get<Activity[]>('/activities'),
	details: (id: string) => requests.get<Activity>(`/activities/${id}`),
	create: (activity: Activity) => requests.post('/activities', activity),
	update: (activity: Activity) =>
		requests.put(`/activities/${activity.id}`, activity),
	delete: (id: string) => requests.del(`/activities/${id}`),
};

const agent = {
	Activities,
};

export default agent;
