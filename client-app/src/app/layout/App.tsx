import React, { Fragment, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [viewingActivity, setSelectedActivity] = useState<Activity | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then((data) => {
      let activities: Activity[] = [];
      data.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      setActivities(activities);
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    }
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter((x) => x.id !== id)]);
  }

  if (loading) return <LoadingComponent content="Loading app..." />;

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
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
