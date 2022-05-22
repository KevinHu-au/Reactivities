import { useState } from "react";
import { Button, Item, Label, List, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  editMode: boolean;
  activities: Activity[];
  viewActivityDetails: (id: string) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

export default function ActivityList(props: Props) {
  const [deletingId, setDeletingId] = useState("");

  function handleDeleteActivity(id: string) {
    setDeletingId(id);
    props.deleteActivity(id);
  }

  return (
    <List>
      {props.activities.map((activity) => (
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
                      disabled={props.editMode}
                      onClick={() => props.viewActivityDetails(activity.id)}
                      floated="right"
                      content="View"
                      color="blue"
                    />
                    <Button
                      loading={props.submitting && deletingId === activity.id}
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
}
