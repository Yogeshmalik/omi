// CHANGE APP.js in routes. TeamW to TeamWork in import also
//change TeamW to TeamWork in index.js of BigDashboard

import axios from 'axios';
import './TeamWork.css';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { pageTransitions, pageVariants } from 'animations';
import { Container, TeamTabBottom, TeamTabTop, ModalBody, Projects } from './Style';
import {
	Button,
	Container as MdContainer,
	Grid,
	Modal,
	Box,
	CardMedia,
	Card,
	CardContent,
	TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TabComponent from 'components/TabComponent/TabComponent';
import moment from 'moment';
import useLongPress from '../../hooks/useLongPress';
import { alertClasses } from '@mui/material';

const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

const deleteMemberStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: '#353935',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4
};

const TeamW = ({
	isInverted,
	showTeamTabTop = true,
	showTabComponent = true,
	showActionButtons = true
}) => {
	const [tabValue, setTabValue] = useState('Team');
	const localStorageData = localStorage.getItem('redwing_data');
	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	console.log('data=', data);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [projectId, setProjectId] = useState('');
	const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [sortingOrder, setSortingOrder] = useState('DEC');
	const [sortingColumn, setSortingColumn] = useState('tasks_count');
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [deleteMember, setDeleteMember] = useState({ img: '', name: '', user_id: '' });
	/* YSM start */
	const handleSorting = col => {
		if (sortingColumn === col) {
			// Reverse the sorting order if the same column is clicked
			setSortingOrder(sortingOrder === 'DEC' ? 'ASC' : 'DEC');
		} else {
			// Set the new sorting column and initial sorting order
			setSortingColumn(col);
			setSortingOrder('ASC');
		}
		// Call your sorting function here
		sorting(col, sortingOrder);
	};
	/* YSM end */

	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 120000);
	}, []);

	const sorting = (col, sortingOrder1) => {
		// if (col === 'tasks_count' || col === 'active_count') {
		/* YSM start */
		if (col === 'tasks_count' || col === 'completed_todo') {
			/* YSM end */
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'tasks_count' || col === 'active_count') {
			/* YSM end */
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'project_ids') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col].length < b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col].length > b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'name') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		}
	};

	const getTeamWorkData = () => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					// Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				setData(res.data);
				setProjectData(res.data.projects);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				// setLoading(false);
			})
			.catch(error => {
				console.error(error);
				// setLoading(false);
			});
	};

	useEffect(() => {
		var users = [];
		if (data && data.users && data.users.length) {
			data.users.forEach(user => {
				if (user.user_id !== 33629907) {
					users.push(user);
				}
			});
			setUsers(users);
			setSortingOrder('DEC');
			setSortingColumn('tasks_count');
		}
	}, [data]);

	useEffect(() => {
		var projects = [];
		for (var k in projectData) {
			projects.push(projectData[k]);
		}
		setProjects(projects);
		console.log(projects);
	}, [projectData]);

	const handleRefreshUserList = () => {
		setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/refresh_user_list.php`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				if (res.data.status === true) {
					alert(res.data.message);
					getTeamWorkData();
					// getProjectData();
				} else {
					alert('Something went wrong');
					console.log(res.data);
				}
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	};

	const onSVGClick = () => {
		if (tabValue === 'Team') {
			setTabValue('Projects');
		}
		if (tabValue === 'Projects') {
			setTabValue('Team');
		}
	};

	const handleOpenProjectModal = () => {
		setOpenAddProjectModal(true);
	};

	const handleCloseProjectModal = () => {
		setOpenAddProjectModal(false);
	};

	const handleAddProjectId = () => {
		if (projectId) {
			setLoading(true);
			handleCloseProjectModal();
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/pages/add_project.php`,
					{ project_id: projectId },
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Access-Control-Allow-Origin': '*'
						}
					}
				)
				.then(res => {
					if (res.data.status === true) {
						alert(res.data.message);
						setProjectId('');
						getTeamWorkData();
						// getProjectData();
					} else {
						handleOpenProjectModal();
						alert('Something went wrong');
						console.log(res.data);
					}
					setLoading(false);
				})
				.catch(error => {
					console.error(error);
					setLoading(false);
				});
		}
	};

	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};

	/* ********************** YSM S *********************************** */
	const [segmentValue, setSegmentValue] = useState('Default'); // Add segmenting state
	// Add a function to handle segment change
	const handleSegmentChange = segment => {
		setSegmentValue(segment);
	};

	// Helper function to render the table based on segmentValue
	const renderTable = () => {
		if (segmentValue === 'Default') {
			// Render default table
			return (
				<table>
					{/* Render default table headers */}
					<thead>
						<tr>
							<th>Name</th>
							<th>Tasks Count</th>
							{/* Add other default table headers */}
						</tr>
					</thead>
					{/* Render default table rows */}
					<tbody>
						{users.map(user => (
							<tr key={user.user_id}>
								<td>{user.name}</td>
								<td>{user.tasks_count}</td>
								{/* Add other default table rows */}
							</tr>
						))}
					</tbody>
				</table>
			);
		} else if (segmentValue === 'Playground') {
			// Render Playground table
			return (
				<div>
					<h2>Client Projects</h2>
					<table>
						{/* Render client projects table headers */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Tasks Count</th>
								{/* Add other client projects table headers */}
							</tr>
						</thead>
						{/* Render client projects table rows */}
						<tbody>
							{clientProjects.map(project => (
								<tr key={project.id}>
									<td>{project.name}</td>
									<td>{project.tasks_count}</td>
									{/* Add other client projects table rows */}
								</tr>
							))}
						</tbody>
					</table>
					<h2>Red Wing</h2>
					<table>
						{/* Render Red Wing table headers */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Tasks Count</th>
								{/* Add other Red Wing table headers */}
							</tr>
						</thead>
						{/* Render Red Wing table rows */}
						<tbody>
							{redWingProjects.map(project => (
								<tr key={project.id}>
									<td>{project.name}</td>
									<td>{project.tasks_count}</td>
									{/* Add other Red Wing table rows */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		} else if (segmentValue === 'Project') {
			// Render Project table
			return (
				<div>
					<h2>Multitasking</h2>
					<table>
						{/* Render multitasking table headers */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Tasks Count</th>
								{/* Add other multitasking table headers */}
							</tr>
						</thead>
						{/* Render multitasking table rows */}
						<tbody>
							{multitaskingUsers.map(user => (
								<tr key={user.user_id}>
									<td>{user.name}</td>
									<td>{user.tasks_count}</td>
									{/* Add other multitasking table rows */}
								</tr>
							))}
						</tbody>
					</table>
					{/* Render individual project tables */}
					{projects.map(project => (
						<div key={project.id}>
							<h2>{project.name}</h2>
							<table>
								{/* Render project-specific table headers */}
								<thead>
									<tr>
										<th>Name</th>
										<th>Tasks Count</th>
										{/* Add other project-specific table headers */}
									</tr>
								</thead>
								{/* Render project-specific table rows */}
								<tbody>
									{project.teamMembers.map(member => (
										<tr key={member.user_id}>
											<td>{member.name}</td>
											<td>{member.tasks_count}</td>
											{/* Add other project-specific table rows */}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					))}
					<h2>Idle</h2>
					<table>
						{/* Render idle table headers */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Tasks Count</th>
								{/* Add other idle table headers */}
							</tr>
						</thead>
						{/* Render idle table rows */}
						<tbody>
							{idleUsers.map(user => (
								<tr key={user.user_id}>
									<td>{user.name}</td>
									<td>{user.tasks_count}</td>
									{/* Add other idle table rows */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		} else if (segmentValue === 'Performance') {
			// Render Performance table
			return (
				<div>
					<h2>5+ Green Ticks</h2>
					<table>
						{/* Render table headers for users with 5+ green ticks */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Green Ticks</th>
								{/* Add other table headers for users with 5+ green ticks */}
							</tr>
						</thead>
						{/* Render rows for users with 5+ green ticks */}
						<tbody>
							{highPerformers.map(user => (
								<tr key={user.user_id}>
									<td>{user.name}</td>
									<td>{user.green_ticks}</td>
									{/* Add other rows for users with 5+ green ticks */}
								</tr>
							))}
						</tbody>
					</table>
					<h2>1-5 Green Ticks</h2>
					<table>
						{/* Render table headers for users with 1-5 green ticks */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Green Ticks</th>
								{/* Add other table headers for users with 1-5 green ticks */}
							</tr>
						</thead>
						{/* Render rows for users with 1-5 green ticks */}
						<tbody>
							{mediumPerformers.map(user => (
								<tr key={user.user_id}>
									<td>{user.name}</td>
									<td>{user.green_ticks}</td>
									{/* Add other rows for users with 1-5 green ticks */}
								</tr>
							))}
						</tbody>
					</table>
					<h2>No Green Ticks</h2>
					<table>
						{/* Render table headers for users with no green ticks */}
						<thead>
							<tr>
								<th>Name</th>
								<th>Green Ticks</th>
								{/* Add other table headers for users with no green ticks */}
							</tr>
						</thead>
						{/* Render rows for users with no green ticks */}
						<tbody>
							{lowPerformers.map(user => (
								<tr key={user.user_id}>
									<td>{user.name}</td>
									<td>{user.green_ticks}</td>
									{/* Add other rows for users with no green ticks */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}
	};
	/* ********************** YSM E *********************************** */

	return (
		<>
			<div className='segmenting-options'>
				{/* Add segmenting options */}
				<span
					className={`segment-option ${segmentValue === 'Default' ? 'active' : ''}`}
					onClick={() => handleSegmentChange('Default')}
				>
					Default
				</span>
				<span
					className={`segment-option ${segmentValue === 'Playground' ? 'active' : ''}`}
					onClick={() => handleSegmentChange('Playground')}
				>
					Playground
				</span>
				<span
					className={`segment-option ${segmentValue === 'Project' ? 'active' : ''}`}
					onClick={() => handleSegmentChange('Project')}
				>
					Project
				</span>
				<span
					className={`segment-option ${segmentValue === 'Performance' ? 'active' : ''}`}
					onClick={() => handleSegmentChange('Performance')}
				>
					Performance
				</span>
			</div>

			{/* Render the table based on segmentValue */}
			{renderTable()}
		</>
	);
};

export default TeamW;
