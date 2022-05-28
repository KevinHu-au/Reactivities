import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { ToastContainer } from 'react-toastify';
import TestErrors from '../../features/errors/TestError';
import ServerError from '../../features/errors/ServerError';
import NotFound from '../../features/errors/NotFound';

function App() {
	const location = useLocation();

	return (
		<>
			<ToastContainer position='bottom-right' hideProgressBar />
			<Route exact path='/' component={HomePage} />
			<Route
				path={'/(.+)'}
				render={() => (
					<>
						<NavBar />
						<Container style={{ marginTop: '7em' }}>
							<Switch>
								<Route path='/activities' exact component={ActivityDashboard} />
								<Route path='/activities/:id' component={ActivityDetails} />
								<Route
									key={location.key}
									path={['/createActivity', '/manage/:id']}
									component={ActivityForm}
								/>
								<Route path='/errors' component={TestErrors} />
								<Route path='/server-error' component={ServerError} />
								<Route component={NotFound} />
							</Switch>
						</Container>
					</>
				)}
			/>
		</>
	);
}

export default observer(App);
