import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";
export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  viewingActivity: Activity | undefined = undefined;
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

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split("T")[0];
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

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  handleSelectActivity = (id: string) => {
    this.viewingActivity = this.activityRegistry.get(id);
  };

  handleUnselectActivity = () => {
    this.viewingActivity = undefined;
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
        this.viewingActivity = activity;
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
        this.viewingActivity = activity;
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
}
