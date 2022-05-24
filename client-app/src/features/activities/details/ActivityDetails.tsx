import { observer } from "mobx-react-lite";
import React from "react";
import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const {
    viewingActivity: activity,
    editActivity,
    finishEditActivity,
  } = activityStore;

  if (!activity) return <></>;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <ButtonGroup widths="6">
          <Button
            onClick={() => editActivity(activity.id)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={finishEditActivity}
            basic
            color="grey"
            content="Cancel"
          />
        </ButtonGroup>
      </Card.Content>
    </Card>
  );
});
