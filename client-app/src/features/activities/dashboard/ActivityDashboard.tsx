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
}

export default function ActivityDashboard(props: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          activities={props.activities}
          viewActivityDetails={props.viewActivityDetails}
        />
      </Grid.Column>
      <Grid.Column width="6">
        {props.viewingActivity && (
          <ActivityDetails
            activity={props.viewingActivity}
            cancelViewActivityDetails={props.cancelViewActivityDetails}
          />
        )}
        <ActivityForm />
      </Grid.Column>
    </Grid>
  );
}
