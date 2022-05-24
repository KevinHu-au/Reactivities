import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Item, Label, List, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityList() {
  const { activityStore } = useStore();
  const { activities, editMode, submitting, handleSelectActivity } =
    activityStore;
  const [deletingId, setDeletingId] = useState("");

  function handleDeleteActivity(id: string) {
    setDeletingId(id);
    activityStore.deleteActivity(id);
  }

  return (
    <List>
      {activities.map((activity) => (
        <List.Item key={activity.id}>
          <Segment>
            <Item.Group>
              <Item key={activity.id}>
                <Item.Content>
                  <Item.Header as="a">{activity.title}</Item.Header>
                  <Item.Meta>{activity.date}</Item.Meta>
                  <Item.Description>
                    <div>{activity.description}</div>
                    <div>
                      {activity.city}, {activity.venue}
                    </div>
                  </Item.Description>
                  <Item.Extra>
                    <Button
                      disabled={editMode}
                      onClick={() => handleSelectActivity(activity.id)}
                      floated="right"
                      content="View"
                      color="blue"
                    />
                    <Button
                      loading={submitting && deletingId === activity.id}
                      onClick={() => handleDeleteActivity(activity.id)}
                      floated="right"
                      negative
                      content="Delete"
                    />
                    <Label basic content={activity.category} />
                  </Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </List.Item>
      ))}
    </List>
    //   <Segment>
    //     <Item.Group divided>
    //       {activities.map((activity) => (
    //         <Item key={activity.id}>
    //           <Item.Content>
    //             <Item.Header as="a">{activity.title}</Item.Header>
    //             <Item.Meta>{activity.date}</Item.Meta>
    //             <Item.Description>
    //               <div>{activity.description}</div>
    //               <div>
    //                 {activity.city}, {activity.venue}
    //               </div>
    //             </Item.Description>
    //             <Item.Extra>
    //               <Button floated="right" content="View" color="blue" />
    //             </Item.Extra>
    //           </Item.Content>
    //         </Item>
    //       ))}
    //     </Item.Group>
    //   </Segment>
  );
});
