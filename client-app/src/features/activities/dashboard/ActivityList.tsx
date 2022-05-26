import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';

export default observer(function ActivityList() {
	const { activityStore } = useStore();
	const { dateGroupedActivities } = activityStore;

	return (
		<>
			{dateGroupedActivities.map(([groupKey, activities]) => (
				<Fragment key={groupKey}>
					<Header sub color='teal' >
						{groupKey}
					</Header>
					{activities.map((activity) => {
						return <ActivityListItem key={activity.id} activity={activity} />;
					})}
				</Fragment>
			))}
		</>
	);
});
