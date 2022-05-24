import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";
export default class ActivityStore {
  activities: Activity[] = [];
  viewingActivity: Activity | undefined = undefined;
  loadingInitial = true;
  editMode = false;
  submitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        this.activities.push(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  handleSelectActivity = (id: string) => {
    this.viewingActivity = this.activities.find((a) => a.id === id);
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
    this.submitting = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activities.push(activity);
        this.editMode = false;
        this.viewingActivity = activity;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activities = [
          ...this.activities.filter((a) => a.id !== activity.id),
          activity,
        ];
        this.editMode = false;
        this.viewingActivity = activity;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      this.activities = [...this.activities.filter((a) => a.id !== id)];
      runInAction(() => {
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };
}
