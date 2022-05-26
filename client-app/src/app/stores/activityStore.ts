import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';
import { v4 as uuid } from 'uuid';
export default class ActivityStore {
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	loadingInitial = true;
	editMode = false;
	saving = false;

	constructor() {
		makeAutoObservable(this);
	}

	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		);
	}

	get dateGroupedActivities() {
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = activity.date;
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity];
				return activities;
			}, {} as { [key: string]: Activity[] })
		);
	}

	loadActivities = async () => {
		this.setLoadingInitial(true);
		try {
			const activities = await agent.Activities.list();
			runInAction(() => {
				activities.forEach((activity) => {
					activity.date = activity.date.split('T')[0];
					this.activityRegistry.set(activity.id, activity);
				});
				this.setLoadingInitial(false);
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.setLoadingInitial(false);
			});
		}
	};

	loadActivity = async (id: string) => {
		let activity = this.getActivityFromRegistry(id);

		if (activity) {
			this.selectedActivity = activity;
			return activity;
		} else {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				this.setActivityToRegistry(activity);
				runInAction(() => {
					this.selectedActivity = activity;
				});
				this.setLoadingInitial(false);
				return activity;
			} catch (error) {
				console.log(error);
				this.setLoadingInitial(false);
			}
		}
	};

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	};

	handleSelectActivity = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
	};

	handleUnselectActivity = () => {
		this.selectedActivity = undefined;
	};

	editActivity = (id?: string) => {
		id ? this.handleSelectActivity(id) : this.handleUnselectActivity();
		this.editMode = true;
	};

	finishEditActivity = () => {
		this.handleUnselectActivity();
		this.editMode = false;
	};

	createActivity = async (activity: Activity) => {
		this.saving = true;
		activity.id = uuid();
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.editMode = false;
				this.selectedActivity = activity;
				this.saving = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.saving = false;
			});
		}
	};

	updateActivity = async (activity: Activity) => {
		this.saving = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.editMode = false;
				this.selectedActivity = activity;
				this.saving = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.saving = false;
			});
		}
	};

	deleteActivity = async (id: string) => {
		this.saving = true;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.saving = false;
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.saving = false;
			});
		}
	};

	private getActivityFromRegistry = (id: string) => {
		return this.activityRegistry.get(id);
	};

	private setActivityToRegistry = (activity: Activity) => {
		activity.date = activity.date.split('T')[0];
		this.activityRegistry.set(activity.id, activity);
	};
}
