import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilter from './ActivityFilter';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
	const { activityStore } = useStore();
	const { loadingInitial, loadActivities } = activityStore;

	useEffect(() => {
		loadActivities();
	}, [loadActivities]);

	if (loadingInitial)
		return <LoadingComponent content='Loading activities...' />;

	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityList />
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilter/>
			</Grid.Column>
		</Grid>
	);
});
