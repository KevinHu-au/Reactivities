import React, { Fragment, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [viewingActivity, setSelectedActivity] = useState<Activity | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Activities.list().then(data =>{
      let activities: Activity[] = [];
      data.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
  }

  function handleUnselectActivity() {
    setSelectedActivity(undefined);
  }

  function editActivity(id?: string) {
    id ? handleSelectActivity(id) : handleUnselectActivity();
    setEditMode(true);
  }

  function finishEditActivity() {
    setEditMode(false);
  }

  function handleSavingActivity(activity: Activity) {
    setEditMode(false);
    setSelectedActivity(activity);
    activity.id
      ? setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ])
      : setActivities([...activities, {...activity, id: uuid()}]);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  if (loading) return (<LoadingComponent content='Loading app...'/>)

  return (
    <>
      <NavBar createActivity={editActivity} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          viewingActivity={viewingActivity}
          viewActivityDetails={handleSelectActivity}
          cancelViewActivityDetails={handleUnselectActivity}
          editMode={editMode}
          editActivity={editActivity}
          finishEditActivity={finishEditActivity}
          savingActivity={handleSavingActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
