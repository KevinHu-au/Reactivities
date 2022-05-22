import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  viewingActivity: Activity | undefined;
  viewActivityDetails: (id: string) => void;
  cancelViewActivityDetails: () => void;
  editMode: boolean;
  editActivity: (id?: string) => void;
  finishEditActivity: () => void;
  savingActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

export default function ActivityDashboard(props: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          editMode={props.editMode}
          activities={props.activities}
          viewActivityDetails={props.viewActivityDetails}
          deleteActivity={props.deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width="6">
        {props.viewingActivity && !props.editMode && (
          <ActivityDetails
            activity={props.viewingActivity}
            cancelViewActivityDetails={props.cancelViewActivityDetails}
            editActivity={props.editActivity}
          />
        )}
        {props.editMode && (
          <ActivityForm
            editActivity={props.viewingActivity}
            finishEditActivity={props.finishEditActivity}
            submitActivity={props.savingActivity}
            submitting={props.submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
