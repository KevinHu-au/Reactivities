import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [viewingActivity, setSelectedActivity] = useState<Activity | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
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
      : setActivities([...activities, activity]);
  }

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
        />
      </Container>
    </>
  );
}

export default App;
